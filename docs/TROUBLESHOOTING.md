# Troubleshooting Guide

> **Purpose**: Solutions for common problems you might encounter.

## Table of Contents

1. [Quick Diagnostic Checklist](#quick-diagnostic-checklist)
2. [WhatsApp Connection Issues](#whatsapp-connection-issues)
3. [Claude Code Issues](#claude-code-issues)
4. [Video Rendering Issues](#video-rendering-issues)
5. [Voice Generation Issues](#voice-generation-issues)
6. [Browser Automation Issues](#browser-automation-issues)
7. [Python Pipeline Issues](#python-pipeline-issues)
8. [Permission Issues](#permission-issues)
9. [Performance Issues](#performance-issues)
10. [Error Message Reference](#error-message-reference)

---

## Quick Diagnostic Checklist

Before diving into specific issues, check these common causes:

### Basic Checks

- [ ] Is the bot running? (Check terminal for "WhatsApp bot is ready!")
- [ ] Did you start the message with `/claude ` (with a space)?
- [ ] Are you messaging yourself (not a group)?
- [ ] Is your internet connection working?
- [ ] Are your API keys set in `.env`?

### Verify Components

```bash
# Check Node.js
node --version
# Expected: v18.x.x or higher

# Check Claude Code
claude --version
# Expected: Version number

# Check Python
python --version
# Expected: Python 3.10.x or higher

# Check FFmpeg
ffmpeg -version
# Expected: Version info
```

---

## WhatsApp Connection Issues

### Problem: QR Code Not Appearing

**Symptoms**: Terminal starts but no QR code shows

**Solutions**:

1. **Clear session and restart**:
   ```bash
   rm -rf .wwebjs_auth
   npm start
   ```

2. **Check Puppeteer installation**:
   ```bash
   # Reinstall puppeteer
   npm uninstall puppeteer
   npm install puppeteer
   ```

3. **On Linux, install Chrome dependencies**:
   ```bash
   sudo apt install -y libgbm1 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2
   ```

### Problem: QR Code Shows But Won't Scan

**Symptoms**: QR code appears but WhatsApp won't recognize it

**Solutions**:

1. **Make terminal window larger** - QR might be cut off

2. **Regenerate QR code**:
   ```bash
   # Press Ctrl+C to stop
   # Then restart
   npm start
   ```

3. **Check WhatsApp version** - Update WhatsApp on your phone

4. **Try a different terminal** - Some terminals render QR poorly

### Problem: "Session Expired" or Disconnected

**Symptoms**: Was working, now doesn't connect

**Solutions**:

1. **Delete session and re-authenticate**:
   ```bash
   rm -rf .wwebjs_auth
   rm -rf .wwebjs_cache
   npm start
   # Scan QR code again
   ```

2. **Check if WhatsApp logged out** - Open WhatsApp → Settings → Linked Devices

### Problem: Bot Connects But Doesn't Respond

**Symptoms**: "WhatsApp bot is ready!" shows but messages aren't processed

**Solutions**:

1. **Verify message format**:
   - Must start with `/claude ` (lowercase, with space)
   - Must be sent to yourself

2. **Check for JavaScript errors** in terminal

3. **Try simpler command**:
   ```
   /claude hello
   ```

---

## Claude Code Issues

### Problem: "claude: command not found"

**Symptoms**: Terminal says claude isn't recognized

**Solutions**:

1. **Install Claude Code**:
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **Check npm global path**:
   ```bash
   npm config get prefix
   # Add this path/bin to your PATH
   ```

3. **Use npx instead**:
   Edit `whatsapp-bot.js`, change spawn command:
   ```javascript
   spawn('npx', ['claude', '-p', task, ...])
   ```

### Problem: "Authentication Required"

**Symptoms**: Claude asks for login

**Solutions**:

1. **Run authentication**:
   ```bash
   claude auth login
   ```

2. **Check credentials exist**:
   ```bash
   ls ~/.claude/
   # Should show config files
   ```

### Problem: Claude Task Times Out

**Symptoms**: "Task timed out after 20 minutes"

**Solutions**:

1. **Break into smaller tasks** - Complex tasks take time

2. **Timeout is already 20 minutes** in `whatsapp-bot.js`:
   ```javascript
   const EXECUTION_TIMEOUT = 1200000; // 20 minutes (default)
   ```
   Increase if needed for very long tasks.

3. **Check if Claude is stuck**:
   - Look at terminal output
   - Press Ctrl+C to cancel if needed

### Problem: Claude Doesn't Remember Previous Messages

**Symptoms**: You answer Claude's question but it doesn't understand the context

**This is now fixed!** The bot automatically continues conversations. However:

1. **If restarting the bot** - Conversation history is lost when you restart
   - Start fresh with a complete command

2. **To intentionally start fresh**:
   ```
   /claude --new your new topic here
   ```
   or
   ```
   /claude -n your new topic here
   ```

3. **How it works**:
   - First `/claude` message = new conversation
   - All subsequent messages = automatically continue
   - `--new` or `-n` = force a new conversation

---

## Video Rendering Issues

### Problem: "remotion: command not found"

**Symptoms**: Can't run Remotion commands

**Solutions**:

1. **Install Remotion dependencies**:
   ```bash
   cd remotion-videos
   npm install
   ```

2. **Use npx**:
   ```bash
   npx remotion studio
   npx remotion render ...
   ```

### Problem: Video Render Fails Immediately

**Symptoms**: Error when starting render

**Solutions**:

1. **Check composition name** - Must be exact (case-sensitive):
   ```
   ✓ ClaudeCodeIntro
   ✗ claudecodeintro
   ✗ Claude Code Intro
   ```

2. **Preview first**:
   ```bash
   cd remotion-videos
   npx remotion studio
   ```

3. **Check output directory exists**:
   ```bash
   mkdir -p output
   ```

### Problem: Video Render Crashes Midway

**Symptoms**: Render starts but fails partway

**Solutions**:

1. **Check memory**:
   - Close other applications
   - Videos are memory-intensive

2. **Render shorter clip first**:
   ```bash
   npx remotion render ClaudeCodeIntro out.mp4 --frames=0-30
   ```

3. **Check FFmpeg**:
   ```bash
   ffmpeg -version
   ```

### Problem: Rendered Video is Black/Empty

**Symptoms**: Video file created but contains nothing

**Solutions**:

1. **Check composition code** - Might have errors

2. **Preview in studio** - Find which frame is problematic

3. **Check props** - Default props might be empty

---

## Voice Generation Issues

### Problem: "OPENAI_API_KEY not set"

**Symptoms**: TTS fails with API key error

**Solutions**:

1. **Check .env file exists** and contains:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

2. **No spaces around equals sign**:
   ```
   ✓ OPENAI_API_KEY=sk-xxx
   ✗ OPENAI_API_KEY = sk-xxx
   ```

3. **Restart the bot** after changing .env

### Problem: "Invalid API Key"

**Symptoms**: API rejects the key

**Solutions**:

1. **Check key is correct** - Copy from OpenAI dashboard again

2. **Check key hasn't expired** - Create new key if needed

3. **Check billing** - OpenAI requires payment method

### Problem: Voice Generation Slow

**Symptoms**: Takes very long to generate audio

**Solutions**:

1. **Check text length** - Longer text takes longer

2. **Use faster model**:
   ```javascript
   model: 'tts-1'  // Instead of 'tts-1-hd'
   ```

3. **Check internet connection**

---

## Browser Automation Issues

### Problem: "Extension not connected"

**Symptoms**: Browser commands fail

**Solutions**:

1. **Install Claude-in-Chrome extension**

2. **Open Chrome manually** and check extension is enabled

3. **Run `/chrome` command** in Claude Code to connect

### Problem: Browser Opens But Actions Fail

**Symptoms**: Chrome opens but can't click/type

**Solutions**:

1. **Make sure you're logged into the site** (Twitter, YouTube, etc.)

2. **Check for popups/modals** blocking the page

3. **Try manually first** - If site changed, automation might need update

### Problem: "Element not found"

**Symptoms**: Can't find buttons or inputs

**Solutions**:

1. **Website may have changed** - UI updates break automation

2. **Wait longer** - Page might not be fully loaded

3. **Check if site requires login**

---

## Python Pipeline Issues

### Problem: "ModuleNotFoundError"

**Symptoms**: Python can't find a package

**Solutions**:

1. **Install dependencies**:
   ```bash
   pip install -r video-pipeline/requirements.txt
   ```

2. **Check Python version**:
   ```bash
   python --version
   # Needs 3.10 or higher
   ```

3. **Try pip3**:
   ```bash
   pip3 install -r video-pipeline/requirements.txt
   ```

### Problem: "FAL_KEY not set"

**Symptoms**: Avatar generation fails

**Solutions**:

1. **Add to .env**:
   ```
   FAL_KEY=your-fal-key-here
   ```

2. **Get key from** https://fal.ai

### Problem: Avatar Video Generation Hangs

**Symptoms**: video_generator.py doesn't complete

**Solutions**:

1. **Check fal.ai status** - Service might be down

2. **Check uploaded files** - Might have failed upload

3. **Try smaller audio** - Very long audio takes longer

---

## Permission Issues

### Problem: "Permission denied" writing files

**Symptoms**: Can't create files in output/

**Solutions**:

1. **Check folder permissions**:
   ```bash
   ls -la output/
   ```

2. **Create folder if missing**:
   ```bash
   mkdir -p output
   ```

3. **Fix permissions**:
   ```bash
   chmod 755 output
   ```

### Problem: Claude Can't Run Commands

**Symptoms**: Bash commands fail in Claude

**Solutions**:

1. **Check settings.json**:
   ```json
   {
       "permissions": {
           "allow": [
               "Bash(npm *)",
               "Bash(node *)"
           ]
       }
   }
   ```

2. **Add the specific command**:
   ```json
   "Bash(your-command *)"
   ```

---

## Performance Issues

### Problem: Bot Responds Slowly

**Symptoms**: Long delay before response

**Possible Causes**:
1. Complex task taking time
2. Internet connection slow
3. Claude API busy

**Solutions**:

1. **Break task into steps**

2. **Check network**:
   ```bash
   ping google.com
   ```

3. **Watch terminal** for progress

### Problem: High Memory Usage

**Symptoms**: Computer becomes slow

**Solutions**:

1. **Close unused applications**

2. **Render videos one at a time**

3. **Restart bot periodically**:
   ```bash
   # Press Ctrl+C then
   npm start
   ```

### Problem: High CPU During Render

**Symptoms**: Computer fans spin up

**This is normal!** Video rendering uses lots of CPU.

**Solutions**:

1. **Render when not using computer**

2. **Render shorter videos**

3. **Lower quality** (higher CRF value):
   ```bash
   npx remotion render ... --crf=28
   ```

---

## Error Message Reference

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `ENOENT` | File or folder not found | Check path, create if needed |
| `EACCES` | Permission denied | Check file/folder permissions |
| `ECONNREFUSED` | Connection failed | Check if service is running |
| `ETIMEDOUT` | Operation timed out | Check network, try again |
| `SyntaxError` | Code has syntax error | Check the file mentioned |
| `TypeError` | Wrong data type | Check variable types |

### WhatsApp-specific Errors

| Error | Solution |
|-------|----------|
| `Protocol error` | Delete .wwebjs_auth and restart |
| `Session closed` | Re-scan QR code |
| `Rate limit` | Wait a few minutes |

### Claude-specific Errors

| Error | Solution |
|-------|----------|
| `Authentication failed` | Run `claude auth login` |
| `API error` | Check Anthropic status page |
| `Context too long` | Break into smaller requests |

### Remotion-specific Errors

| Error | Solution |
|-------|----------|
| `Composition not found` | Check composition name spelling |
| `FFmpeg not found` | Install FFmpeg |
| `Out of memory` | Close other apps, render shorter video |

---

## Still Stuck?

1. **Read the specific guide**:
   - [Installation Guide](INSTALLATION.md)
   - [User Guide](USER_GUIDE.md)
   - [Developer Guide](DEVELOPER_GUIDE.md)

2. **Check the logs**:
   - Terminal output shows errors
   - Check `/var/log/agent.log` for scheduled tasks

3. **Try the minimal case**:
   - Simplest possible command
   - One thing at a time

4. **Restart everything**:
   - Stop the bot (Ctrl+C)
   - Close Chrome
   - Start fresh
