# Network Security Guide for Clawdbot

> **Warning:** Exposed Clawdbot gateways have been found on Shodan. An open gateway = shell access + browser automation + API keys.

## TL;DR Checklist

- [ ] Gateway binds to `loopback` only (default)
- [ ] Auth token set via `GATEWAY_AUTH_TOKEN` env var (not in config file)
- [ ] Port 18789 blocked by firewall (if on VPS)
- [ ] Bot tokens in env vars, not config files
- [ ] Consider Cloudflare Tunnel or Tailscale for remote access

---

## 1. Gateway Configuration (clawdbot.json)

**Secure defaults (already set):**

```json
{
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token"
    }
  }
}
```

| Setting | Safe Value | Why |
|---------|-----------|-----|
| `bind` | `"loopback"` | Only accepts connections from 127.0.0.1 |
| `mode` | `"local"` | Not exposed publicly |
| `auth.mode` | `"token"` | Requires authentication |

**Never do this:**

```json
{
  "gateway": {
    "bind": "0.0.0.0",  // EXPOSED TO INTERNET!
    "auth": {
      "mode": "none"    // NO AUTHENTICATION!
    }
  }
}
```

---

## 2. Environment Variables (Railway Dashboard)

All secrets should be in Railway environment variables, not in config files:

```
GATEWAY_AUTH_TOKEN=<generate with: openssl rand -hex 24>
TELEGRAM_BOT_TOKEN=<your telegram token>
DISCORD_BOT_TOKEN=<your discord token>
MINIMAX_API_KEY=<your api key>
ANTHROPIC_API_KEY=<your api key>
BRAVE_API_KEY=<your api key>
```

**Why?**
- Config files can be committed to git accidentally
- Environment variables are isolated per deployment
- Railway encrypts env vars at rest

---

## 3. Firewall Rules (VPS/Hetzner/DigitalOcean)

If running on a raw VPS (not Railway), block port 18789:

```bash
# UFW (Ubuntu)
sudo ufw deny 18789

# iptables
sudo iptables -A INPUT -p tcp --dport 18789 -j DROP

# Verify
sudo ss -tlnp | grep 18789  # Should only show 127.0.0.1
```

**Railway:** Port 18789 is not exposed by default. Only exposed if you create a public domain.

---

## 4. Secure Remote Access Options

If you need to access the gateway remotely:

### Option A: Cloudflare Tunnel (Free, Recommended)

```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared

# Create tunnel
./cloudflared tunnel login
./cloudflared tunnel create clawdbot
./cloudflared tunnel route dns clawdbot bot.yourdomain.com

# Run tunnel (connects localhost:18789 to Cloudflare)
./cloudflared tunnel --url http://localhost:18789 run clawdbot
```

Benefits:
- No open ports
- Cloudflare Access for additional auth
- DDoS protection
- Free tier available

### Option B: Tailscale (Also Free)

```json
{
  "gateway": {
    "mode": "tailscale",
    "tailscale": {
      "mode": "userspace",
      "hostname": "clawdbot"
    }
  }
}
```

Benefits:
- Encrypted mesh VPN
- Only accessible from your Tailscale network
- No exposed ports
- MagicDNS naming

### Option C: SSH Tunnel (Manual)

```bash
# From your local machine
ssh -L 18789:localhost:18789 user@your-vps

# Now access gateway at localhost:18789
```

---

## 5. Shodan Self-Check

Check if your gateway is exposed:

```bash
# Check from external network (not the VPS itself)
nmap -p 18789 YOUR_VPS_IP

# Or use Shodan
# https://www.shodan.io/search?query=port%3A18789+clawdbot
```

If your gateway appears on Shodan:
1. Immediately change all API keys
2. Rotate the gateway auth token
3. Fix the `bind` setting
4. Enable firewall

---

## 6. What Gets Exposed

An unprotected gateway gives attackers:

| Access | Impact |
|--------|--------|
| Bash tool | Full shell on your VPS |
| Browser tool | Automated web actions under your identity |
| Message tool | Send messages as you to any platform |
| File read/write | Access all workspace files |
| API keys | All your LLM/service credentials |
| Session history | Your entire conversation history |

**This is not hypothetical.** Exposed gateways have been found on Shodan.

---

## 7. Railway-Specific Notes

Railway doesn't expose ports by default. Your gateway is safe if:
- You haven't created a public domain pointing to port 18789
- You haven't enabled "Expose Port" in service settings

To verify in Railway:
1. Go to your service
2. Check "Settings" > "Networking"
3. Ensure no public domain routes to port 18789

---

## Quick Security Audit

Run this to check your setup:

```bash
# 1. Check gateway config
grep -E "(bind|auth|token)" clawdbot.json

# 2. Check for hardcoded secrets (should find nothing)
grep -rE "(sk-|xox|ghp_|AAAA)" --include="*.json" --include="*.md" .

# 3. Check what's listening (on VPS)
ss -tlnp | grep LISTEN

# 4. Check env vars are set (Railway)
echo "GATEWAY_AUTH_TOKEN is ${GATEWAY_AUTH_TOKEN:+SET}"
echo "TELEGRAM_BOT_TOKEN is ${TELEGRAM_BOT_TOKEN:+SET}"
```

---

*Stay safe. Don't let your lobster get cooked.*
