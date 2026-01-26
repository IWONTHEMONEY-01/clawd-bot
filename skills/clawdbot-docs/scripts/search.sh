#!/bin/bash
# Search Clawdbot documentation by keyword
# Usage: ./search.sh <keyword>

KEYWORD="$1"

if [ -z "$KEYWORD" ]; then
  echo "Usage: ./search.sh <keyword>"
  echo "Example: ./search.sh discord"
  exit 1
fi

DOCS_URL="https://docs.clawd.bot"

# Hardcoded doc paths for quick search
DOCS=(
  "start/getting-started"
  "start/setup"
  "start/faq"
  "gateway/configuration"
  "gateway/configuration-examples"
  "gateway/security"
  "gateway/troubleshooting"
  "providers/discord"
  "providers/telegram"
  "providers/whatsapp"
  "providers/slack"
  "providers/signal"
  "providers/imessage"
  "providers/msteams"
  "providers/matrix"
  "providers/troubleshooting"
  "concepts/agent"
  "concepts/sessions"
  "concepts/messages"
  "concepts/models"
  "concepts/queues"
  "concepts/streaming"
  "concepts/system-prompt"
  "tools/bash"
  "tools/browser"
  "tools/skills"
  "tools/reactions"
  "tools/subagents"
  "tools/thinking"
  "automation/cron-jobs"
  "automation/webhook"
  "automation/gmail-pubsub"
  "cli/gateway"
  "cli/message"
  "cli/sandbox"
  "platforms/macos"
  "platforms/linux"
  "platforms/windows"
  "platforms/hetzner"
  "install/docker"
  "install/ansible"
  "install/bun"
  "reference/templates"
  "reference/rpc"
)

echo "Searching for: $KEYWORD"
echo "========================"
echo ""

KEYWORD_LOWER=$(echo "$KEYWORD" | tr '[:upper:]' '[:lower:]')

for doc in "${DOCS[@]}"; do
  doc_lower=$(echo "$doc" | tr '[:upper:]' '[:lower:]')
  if [[ "$doc_lower" == *"$KEYWORD_LOWER"* ]]; then
    echo "  $DOCS_URL/$doc"
  fi
done

echo ""
echo "Tip: Use fetch-doc.sh <path> to get the full content"
