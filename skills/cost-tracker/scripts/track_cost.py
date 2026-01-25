#!/usr/bin/env python3
"""
ClawdBot Cost Tracker

Parses session JSONL files to track API costs and alerts when threshold is reached.
"""

import json
import os
import sys
import glob
from pathlib import Path
from datetime import datetime
import argparse

# Default paths
CLAWDBOT_DIR = Path.home() / ".clawdbot"
SESSIONS_DIR = CLAWDBOT_DIR / "agents" / "main" / "sessions"
TRACKER_FILE = CLAWDBOT_DIR / "cost-tracker.json"

def load_tracker():
    """Load existing tracker state or create new one."""
    if TRACKER_FILE.exists():
        with open(TRACKER_FILE, 'r') as f:
            return json.load(f)
    return {
        "total_cost": 0.0,
        "threshold": 10.0,
        "alert_sent": False,
        "last_alert_at": None,
        "last_check_at": None,
        "sessions_processed": [],
        "cost_history": []
    }

def save_tracker(tracker):
    """Save tracker state."""
    with open(TRACKER_FILE, 'w') as f:
        json.dump(tracker, f, indent=2)

def parse_session_costs(session_file):
    """Parse a session JSONL file and extract costs."""
    costs = []
    try:
        with open(session_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                    if entry.get("type") == "message":
                        msg = entry.get("message", {})
                        if msg.get("role") == "assistant":
                            usage = msg.get("usage", {})
                            cost = usage.get("cost", {})
                            total = cost.get("total", 0)
                            if total > 0:
                                costs.append({
                                    "timestamp": entry.get("timestamp"),
                                    "model": msg.get("model", "unknown"),
                                    "cost": total,
                                    "tokens": usage.get("totalTokens", 0)
                                })
                except json.JSONDecodeError:
                    continue
    except Exception as e:
        print(f"Error reading {session_file}: {e}", file=sys.stderr)
    return costs

def calculate_total_cost(reset=False):
    """Calculate total cost from all session files."""
    tracker = load_tracker() if not reset else {
        "total_cost": 0.0,
        "threshold": 10.0,
        "alert_sent": False,
        "last_alert_at": None,
        "last_check_at": None,
        "sessions_processed": [],
        "cost_history": []
    }

    total = 0.0
    session_files = list(SESSIONS_DIR.glob("*.jsonl"))

    for sf in session_files:
        costs = parse_session_costs(sf)
        for c in costs:
            total += c["cost"]

    tracker["total_cost"] = round(total, 6)
    tracker["last_check_at"] = datetime.now().isoformat()
    save_tracker(tracker)

    return tracker

def check_threshold(threshold=None):
    """Check if cost threshold has been reached."""
    tracker = load_tracker()

    if threshold:
        tracker["threshold"] = threshold

    # Recalculate total
    total = 0.0
    session_files = list(SESSIONS_DIR.glob("*.jsonl"))
    for sf in session_files:
        costs = parse_session_costs(sf)
        for c in costs:
            total += c["cost"]

    tracker["total_cost"] = round(total, 6)
    tracker["last_check_at"] = datetime.now().isoformat()

    exceeded = tracker["total_cost"] >= tracker["threshold"]
    needs_alert = exceeded and not tracker["alert_sent"]

    if needs_alert:
        tracker["alert_sent"] = True
        tracker["last_alert_at"] = datetime.now().isoformat()

    save_tracker(tracker)

    return {
        "total_cost": tracker["total_cost"],
        "threshold": tracker["threshold"],
        "exceeded": exceeded,
        "needs_alert": needs_alert
    }

def reset_alert():
    """Reset the alert flag (after user acknowledges)."""
    tracker = load_tracker()
    tracker["alert_sent"] = False
    save_tracker(tracker)
    return tracker

def format_report(tracker):
    """Format a cost report."""
    pct = (tracker["total_cost"] / tracker["threshold"]) * 100 if tracker["threshold"] > 0 else 0
    return f"""ClawdBot Cost Report
====================
Total Cost: ${tracker['total_cost']:.4f}
Threshold:  ${tracker['threshold']:.2f}
Progress:   {pct:.1f}%
Remaining:  ${max(0, tracker['threshold'] - tracker['total_cost']):.4f}

Last Check: {tracker.get('last_check_at', 'Never')}
Alert Sent: {'Yes' if tracker.get('alert_sent') else 'No'}"""

def main():
    parser = argparse.ArgumentParser(description='ClawdBot Cost Tracker')
    parser.add_argument('command', choices=['check', 'report', 'reset', 'reset-alert', 'set-threshold'],
                       help='Command to run')
    parser.add_argument('--threshold', type=float, help='Cost threshold in dollars')
    parser.add_argument('--json', action='store_true', help='Output as JSON')

    args = parser.parse_args()

    if args.command == 'check':
        result = check_threshold(args.threshold)
        if args.json:
            print(json.dumps(result, indent=2))
        else:
            if result["needs_alert"]:
                print(f"ALERT: Cost threshold exceeded! ${result['total_cost']:.4f} >= ${result['threshold']:.2f}")
            else:
                print(f"Cost: ${result['total_cost']:.4f} / ${result['threshold']:.2f}")

    elif args.command == 'report':
        tracker = calculate_total_cost()
        if args.json:
            print(json.dumps(tracker, indent=2))
        else:
            print(format_report(tracker))

    elif args.command == 'reset':
        tracker = calculate_total_cost(reset=True)
        print("Tracker reset. Current cost recalculated.")
        if args.json:
            print(json.dumps(tracker, indent=2))

    elif args.command == 'reset-alert':
        tracker = reset_alert()
        print("Alert flag reset.")

    elif args.command == 'set-threshold':
        if not args.threshold:
            print("Error: --threshold required", file=sys.stderr)
            sys.exit(1)
        tracker = load_tracker()
        tracker["threshold"] = args.threshold
        tracker["alert_sent"] = False  # Reset alert when threshold changes
        save_tracker(tracker)
        print(f"Threshold set to ${args.threshold:.2f}")

if __name__ == "__main__":
    main()
