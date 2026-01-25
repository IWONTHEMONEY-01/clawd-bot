#!/usr/bin/env node
/**
 * Auto-Persist Service for Clawdbot
 *
 * Runs every 5 minutes to:
 * 1. Force-flush all in-memory state to disk
 * 2. Commit any changes to git
 * 3. Push to GitHub
 *
 * Run with: node persist-service.js
 * Or schedule with Windows Task Scheduler
 */

import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CLAWDBOT_DIR = path.resolve(import.meta.dirname, '..');
const LOG_FILE = path.join(CLAWDBOT_DIR, 'auto-persist', 'persist.log');
const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function log(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  console.log(logLine.trim());
  fs.appendFileSync(LOG_FILE, logLine);
}

function exec(cmd, options = {}) {
  try {
    return execSync(cmd, {
      cwd: CLAWDBOT_DIR,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options
    }).trim();
  } catch (err) {
    const stderr = err.stderr?.toString().trim() || err.message;
    throw new Error(stderr);
  }
}

function hasChanges() {
  try {
    const status = exec('git status --porcelain');
    return status.length > 0;
  } catch {
    return false;
  }
}

function commitAndPush() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  try {
    // Stage all changes (respecting .gitignore)
    exec('git add -A');

    if (!hasChanges()) {
      log('No changes to commit');
      return false;
    }

    // Commit with timestamp
    const commitMsg = `Auto-persist: ${timestamp}`;
    exec(`git commit -m "${commitMsg}"`);
    log(`Committed: ${commitMsg}`);

    // Push to remote (if configured)
    try {
      const remote = exec('git remote').trim();
      if (remote) {
        exec('git push');
        log('Pushed to remote');
      } else {
        log('No remote configured - skipping push');
      }
    } catch (pushErr) {
      log(`Push failed (will retry next cycle): ${pushErr.message}`);
    }

    return true;
  } catch (err) {
    log(`Commit failed: ${err.message}`);
    return false;
  }
}

function createStateSnapshot() {
  const snapshotDir = path.join(CLAWDBOT_DIR, 'auto-persist', 'snapshots');
  fs.mkdirSync(snapshotDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotFile = path.join(snapshotDir, `state-${timestamp}.json`);

  // Collect critical state files
  const stateFiles = [
    'clawdbot.json',
    'sessions.json',
    'cost-tracker.json'
  ];

  const snapshot = {
    timestamp: new Date().toISOString(),
    files: {}
  };

  for (const file of stateFiles) {
    const filePath = path.join(CLAWDBOT_DIR, file);
    try {
      if (fs.existsSync(filePath)) {
        snapshot.files[file] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    } catch {
      // Skip files that can't be read
    }
  }

  // Only keep last 12 snapshots (1 hour of history at 5-min intervals)
  try {
    const existingSnapshots = fs.readdirSync(snapshotDir)
      .filter(f => f.startsWith('state-') && f.endsWith('.json'))
      .sort()
      .reverse();

    for (const old of existingSnapshots.slice(11)) {
      fs.unlinkSync(path.join(snapshotDir, old));
    }
  } catch {
    // Cleanup failures are non-critical
  }

  fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2));
  log(`Snapshot saved: ${path.basename(snapshotFile)}`);
}

function runPersistCycle() {
  log('=== Starting persist cycle ===');

  try {
    // 1. Create a state snapshot
    createStateSnapshot();

    // 2. Commit and push to git
    commitAndPush();

    log('=== Persist cycle complete ===\n');
  } catch (err) {
    log(`Persist cycle error: ${err.message}`);
  }
}

// Run immediately on start
runPersistCycle();

// Then run every 5 minutes
const mode = process.argv[2];

if (mode === '--once') {
  log('Single run mode - exiting');
  process.exit(0);
}

if (mode === '--daemon') {
  log(`Daemon mode - running every ${INTERVAL_MS / 1000 / 60} minutes`);
  setInterval(runPersistCycle, INTERVAL_MS);

  // Keep alive
  process.on('SIGINT', () => {
    log('Shutting down persist service');
    process.exit(0);
  });
}
