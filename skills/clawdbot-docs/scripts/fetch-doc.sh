#!/bin/bash
# Fetch a specific Clawdbot documentation page
# Usage: ./fetch-doc.sh <path>
# Example: ./fetch-doc.sh gateway/configuration

DOC_PATH="$1"

if [ -z "$DOC_PATH" ]; then
  echo "Usage: ./fetch-doc.sh <path>"
  echo "Example: ./fetch-doc.sh gateway/configuration"
  echo ""
  echo "Common paths:"
  echo "  - gateway/configuration"
  echo "  - providers/discord"
  echo "  - providers/telegram"
  echo "  - automation/cron-jobs"
  echo "  - tools/skills"
  exit 1
fi

DOCS_URL="https://docs.clawd.bot"
FULL_URL="$DOCS_URL/$DOC_PATH"

echo "Fetching: $FULL_URL"
echo "========================"
echo ""

# Use curl to fetch the page, convert to text
if command -v curl &> /dev/null; then
  curl -sL "$FULL_URL" | \
    sed 's/<[^>]*>//g' | \
    sed '/^$/d' | \
    head -100
else
  echo "Error: curl not found. Please install curl."
  exit 1
fi

echo ""
echo "========================"
echo "Full URL: $FULL_URL"
