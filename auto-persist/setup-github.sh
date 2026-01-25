#!/bin/bash
# Setup GitHub authentication for unattended access
# Run with: bash setup-github.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAWDBOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== GitHub Setup for Clawdbot Auto-Persist ==="
echo ""

# Check if git is configured
if [ -z "$(git config --global user.email)" ]; then
    read -p "Enter your Git email: " GIT_EMAIL
    git config --global user.email "$GIT_EMAIL"
fi

if [ -z "$(git config --global user.name)" ]; then
    read -p "Enter your Git name: " GIT_NAME
    git config --global user.name "$GIT_NAME"
fi

echo ""
echo "Choose authentication method:"
echo "1) Personal Access Token (PAT) - Recommended for servers"
echo "2) SSH Key - If you already have one configured"
echo "3) GitHub CLI (gh) - Interactive setup"
echo ""
read -p "Select option [1-3]: " AUTH_METHOD

case $AUTH_METHOD in
    1)
        echo ""
        echo "Create a PAT at: https://github.com/settings/tokens"
        echo "Required scopes: repo (full control)"
        echo ""
        read -sp "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
        echo ""

        # Store credentials using git credential helper
        git config --global credential.helper store

        read -p "Enter your GitHub username: " GITHUB_USER
        read -p "Enter your repository name (e.g., clawdbot-state): " REPO_NAME

        # Set up the remote with embedded credentials (stored securely)
        REMOTE_URL="https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

        cd "$CLAWDBOT_DIR"

        # Remove existing origin if present
        git remote remove origin 2>/dev/null || true

        # Add new origin
        git remote add origin "$REMOTE_URL"

        # Store credentials for future use
        echo "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com" >> ~/.git-credentials
        chmod 600 ~/.git-credentials

        echo ""
        echo "Testing connection..."
        if git ls-remote origin &>/dev/null; then
            echo "Connection successful!"

            # Push initial commit
            echo "Pushing to GitHub..."
            git push -u origin master || git push -u origin main
            echo "Done! Your clawdbot state is now backed up to GitHub."
        else
            echo "Connection failed. Please check your token and try again."
            exit 1
        fi
        ;;

    2)
        echo ""
        echo "Make sure your SSH key is added to GitHub:"
        echo "https://github.com/settings/keys"
        echo ""
        read -p "Enter your GitHub username: " GITHUB_USER
        read -p "Enter your repository name: " REPO_NAME

        cd "$CLAWDBOT_DIR"
        git remote remove origin 2>/dev/null || true
        git remote add origin "git@github.com:${GITHUB_USER}/${REPO_NAME}.git"

        echo "Testing SSH connection..."
        if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
            echo "SSH connection successful!"
            git push -u origin master || git push -u origin main
        else
            echo "SSH test completed. Attempting push..."
            git push -u origin master || git push -u origin main
        fi
        ;;

    3)
        if ! command -v gh &>/dev/null; then
            echo "GitHub CLI not installed. Installing..."
            if command -v apt-get &>/dev/null; then
                curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
                echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
                sudo apt update && sudo apt install gh -y
            else
                echo "Please install gh manually: https://cli.github.com/"
                exit 1
            fi
        fi

        gh auth login
        gh auth setup-git

        read -p "Enter your GitHub username: " GITHUB_USER
        read -p "Enter your repository name: " REPO_NAME

        cd "$CLAWDBOT_DIR"
        git remote remove origin 2>/dev/null || true
        git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
        git push -u origin master || git push -u origin main
        ;;

    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "=== Setup Complete ==="
echo "Remote: $(git remote get-url origin 2>/dev/null | sed 's/:[^@]*@/:***@/')"
echo ""
echo "The auto-persist service will now push to GitHub every 5 minutes."
