# Installation Guide

> **Goal**: Get the WhatsApp-Claude system running on your computer, step by step.

## Table of Contents

1. [Prerequisites Overview](#prerequisites-overview)
2. [Step 1: Install Node.js](#step-1-install-nodejs)
3. [Step 2: Install Python](#step-2-install-python)
4. [Step 3: Install Claude Code CLI](#step-3-install-claude-code-cli)
5. [Step 4: Install Chrome Browser](#step-4-install-chrome-browser)
6. [Step 5: Install FFmpeg](#step-5-install-ffmpeg)
7. [Step 6: Get API Keys](#step-6-get-api-keys)
8. [Step 7: Download the Project](#step-7-download-the-project)
9. [Step 8: Install Dependencies](#step-8-install-dependencies)
10. [Step 9: Configure Environment](#step-9-configure-environment)
11. [Step 10: First Run and QR Code](#step-10-first-run-and-qr-code)
12. [Step 11: Verify Installation](#step-11-verify-installation)
13. [Troubleshooting Installation Issues](#troubleshooting-installation-issues)

---

## Prerequisites Overview

Before starting, you'll need:

| Software | Required | Purpose |
|----------|----------|---------|
| Node.js 18+ | Yes | Runs the WhatsApp bot |
| Python 3.10+ | For avatars | Runs video pipeline |
| Claude Code CLI | Yes | AI assistant |
| Chrome Browser | For browser features | Browser automation |
| FFmpeg | For video features | Video processing |
| OpenAI API Key | Yes | Voice generation |
| fal.ai API Key | For avatars | Avatar generation |

**Time estimate**: 30-60 minutes for complete setup

---

## Step 1: Install Node.js

Node.js is a program that runs JavaScript on your computer (outside of a web browser).

### Windows

1. Go to https://nodejs.org
2. Download the **LTS** version (the button on the left)
3. Run the installer
4. Click "Next" through all the prompts
5. **Important**: Check the box that says "Automatically install necessary tools"
6. Click "Install"
7. If a command prompt opens, let it finish and press Enter when prompted

### macOS

**Option A: Direct Download**
1. Go to https://nodejs.org
2. Download the LTS version
3. Open the .pkg file
4. Follow the installer prompts

**Option B: Using Homebrew (if you have it)**
```bash
brew install node
```

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Verify Installation

Open a new terminal/command prompt and run:

```bash
node --version
```

**Expected output**: Something like `v20.10.0` (version 18 or higher)

```bash
npm --version
```

**Expected output**: Something like `10.2.0` (version 9 or higher)

**If these commands don't work:**
- Close and reopen your terminal
- Restart your computer
- See [Troubleshooting](#troubleshooting-installation-issues)

---

## Step 2: Install Python

Python is needed for the AI avatar video pipeline.

### Windows

1. Go to https://python.org/downloads
2. Click "Download Python 3.12.x" (or latest 3.10+)
3. Run the installer
4. **IMPORTANT**: Check the box "Add Python to PATH" at the bottom
5. Click "Install Now"

### macOS

**Option A: Direct Download**
1. Go to https://python.org/downloads
2. Download the latest version
3. Run the installer

**Option B: Using Homebrew**
```bash
brew install python
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

### Verify Installation

```bash
python --version
# or on some systems:
python3 --version
```

**Expected output**: `Python 3.10.x` or higher

```bash
pip --version
# or:
pip3 --version
```

**Expected output**: `pip 23.x.x` or similar

---

## Step 3: Install Claude Code CLI

Claude Code is the AI assistant that processes your commands.

### Install via npm

```bash
npm install -g @anthropic-ai/claude-code
```

**What this does**:
- Downloads the Claude Code program
- Installs it globally so you can run it from anywhere
- `-g` means "global" installation

### Authenticate Claude Code

```bash
claude auth login
```

This will:
1. Open a browser window
2. Ask you to log in to Anthropic
3. Authorize the CLI access

**Follow the on-screen prompts.**

### Verify Installation

```bash
claude --version
```

**Expected output**: Version number like `1.0.0`

Test it works:
```bash
claude -p "say hello"
```

**Expected output**: Claude should respond with a greeting.

---

## Step 4: Install Chrome Browser

Chrome is needed for browser automation features.

### Download Chrome

1. Go to https://google.com/chrome
2. Download Chrome
3. Install it

**If you already have Chrome installed, you're good!**

### Install Claude-in-Chrome Extension (Optional but Recommended)

For browser automation to work:

1. Open Chrome
2. Go to the Chrome Web Store
3. Search for "Claude in Chrome" or visit the extension page
4. Click "Add to Chrome"
5. Follow the setup prompts

---

## Step 5: Install FFmpeg

FFmpeg is a tool for processing video and audio files.

### Windows

**Option A: Using Chocolatey (Recommended)**

First, install Chocolatey if you don't have it:
1. Open PowerShell as Administrator
2. Run:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Then install FFmpeg:
```powershell
choco install ffmpeg
```

**Option B: Manual Installation**
1. Go to https://ffmpeg.org/download.html
2. Click "Windows builds from gyan.dev"
3. Download the "ffmpeg-release-essentials.zip"
4. Extract to `C:\ffmpeg`
5. Add `C:\ffmpeg\bin` to your PATH:
   - Search "Environment Variables" in Windows
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit"
   - Click "New"
   - Add `C:\ffmpeg\bin`
   - Click OK on all windows

### macOS

```bash
brew install ffmpeg
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install ffmpeg
```

### Verify Installation

```bash
ffmpeg -version
```

**Expected output**: FFmpeg version info (version 5 or higher recommended)

---

## Step 6: Get API Keys

### OpenAI API Key (Required)

This is needed for voice generation.

1. Go to https://platform.openai.com
2. Sign up or log in
3. Click your profile → "View API keys"
4. Click "Create new secret key"
5. Give it a name like "WhatsApp-Claude"
6. **Copy the key immediately** (you can't see it again!)
7. Save it somewhere safe

**Cost**: OpenAI charges per usage. TTS costs about $0.015 per 1000 characters.

### fal.ai API Key (Optional - for Avatar Videos)

1. Go to https://fal.ai
2. Sign up or log in
3. Go to your dashboard
4. Find API keys section
5. Create a new key
6. Copy it

---

## Step 7: Download the Project

### Option A: Git Clone (Recommended)

If you have Git installed:

```bash
# Navigate to where you want the project
cd ~/Documents  # or wherever you want

# Clone the repository
git clone <repository-url> whatsapp-claude

# Enter the directory
cd whatsapp-claude
```

### Option B: Download ZIP

1. Go to the repository page
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file to your desired location
4. Open terminal/command prompt
5. Navigate to the extracted folder

---

## Step 8: Install Dependencies

### Install Node.js Dependencies

From the project root folder:

```bash
# Install main project dependencies
npm install
```

**What this does**:
- Reads `package.json` to see what's needed
- Downloads all required packages to `node_modules/` folder
- This might take 1-2 minutes

**Expected output**: Lots of text, ending with something like:
```
added 150 packages in 30s
```

### Install Remotion Dependencies

```bash
# Enter Remotion folder
cd remotion-videos

# Install Remotion dependencies
npm install

# Return to root
cd ..
```

### Install Python Dependencies

```bash
pip install -r video-pipeline/requirements.txt
# or on some systems:
pip3 install -r video-pipeline/requirements.txt
```

---

## Step 9: Configure Environment

### Create the .env File

```bash
# Copy the template (if it exists)
cp .env.example .env

# Or create it manually
```

### Edit .env with Your API Keys

Open `.env` in a text editor and add your keys:

```bash
# Required - for voice generation
OPENAI_API_KEY=sk-your-openai-key-here

# Optional - for avatar videos
FAL_KEY=your-fal-key-here

# Optional - usually leave empty
WORKSPACE=
```

**IMPORTANT**:
- Don't share this file with anyone
- Don't commit it to Git
- Replace `sk-your-openai-key-here` with your actual key

---

## Step 10: First Run and QR Code

### Start the Bot

```bash
npm start
```

### Scan the QR Code

1. A QR code will appear in your terminal
2. Open WhatsApp on your phone
3. Go to: Settings → Linked Devices → Link a Device
4. Point your camera at the QR code
5. Wait for connection

**Expected terminal output**:
```
🚀 Starting WhatsApp-Claude Bridge...

📱 Scan this QR code with WhatsApp:

[QR CODE HERE]

Open WhatsApp > Settings > Linked Devices > Link a Device

🔐 Authentication successful
✅ WhatsApp bot is ready!
📁 Workspace: /path/to/whatsapp-claude
📝 Send "/claude <task>" to yourself to execute commands
```

### Important Notes

- The QR code expires after a minute - if it does, press Ctrl+C and run `npm start` again
- After first scan, you won't need to scan again (credentials are saved)
- To re-authenticate, delete the `.wwebjs_auth` folder and restart

---

## Step 11: Verify Installation

### Test 1: Simple Message

Send this to yourself on WhatsApp:
```
/claude hello
```

**Expected**: A response from Claude

### Test 2: Create a File

```
/claude create a file called test.txt in the output folder with "Hello World"
```

**Expected**: File created at `output/test.txt`

### Test 3: Generate Voice (if OpenAI key is set)

```
/claude generate voice saying "Installation complete" to output/test.mp3
```

**Expected**: Audio file at `output/test.mp3`

### Test 4: Preview Remotion (separate terminal)

```bash
cd remotion-videos
npx remotion studio
```

**Expected**: Browser opens at http://localhost:3000

---

## Troubleshooting Installation Issues

### "node: command not found"

**Cause**: Node.js not in PATH

**Fix**:
- Close and reopen terminal
- Restart computer
- Reinstall Node.js with "Add to PATH" option checked

### "npm: command not found"

**Fix**: Same as above - npm comes with Node.js

### "python: command not found"

**Fix**:
- Try `python3` instead
- Reinstall Python with "Add to PATH" checked
- On Windows, try the Microsoft Store Python

### "claude: command not found"

**Fix**:
```bash
npm install -g @anthropic-ai/claude-code
```

### "ffmpeg: command not found"

**Fix**: Reinstall FFmpeg and ensure it's in PATH

### QR Code Won't Scan

**Fixes**:
- Make terminal window larger
- Increase font size temporarily
- Try a different terminal application
- Make sure you're scanning with WhatsApp, not regular camera

### "Error: OPENAI_API_KEY not set"

**Fix**: Make sure your `.env` file:
- Is in the project root folder
- Contains `OPENAI_API_KEY=sk-...` with your actual key
- Has no spaces around the `=`

### npm install Fails

**Fixes**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and retry
rm -rf node_modules
npm install
```

### Python Package Install Fails

**Fixes**:
```bash
# Upgrade pip
pip install --upgrade pip

# Try with pip3
pip3 install -r video-pipeline/requirements.txt

# On Windows, might need:
py -m pip install -r video-pipeline/requirements.txt
```

### WhatsApp Connection Lost

**Fixes**:
1. Stop the bot (Ctrl+C)
2. Delete auth folder: `rm -rf .wwebjs_auth`
3. Restart: `npm start`
4. Scan QR code again

---

## Next Steps

Installation complete! Now:

1. **Quick Start**: [QUICK_START.md](QUICK_START.md) - Try 10 simple commands
2. **User Guide**: [USER_GUIDE.md](USER_GUIDE.md) - Learn all features
3. **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - If things go wrong

---

## Keeping Things Updated

### Update Node.js Packages

```bash
npm update
cd remotion-videos && npm update && cd ..
```

### Update Python Packages

```bash
pip install --upgrade -r video-pipeline/requirements.txt
```

### Update Claude Code

```bash
npm update -g @anthropic-ai/claude-code
```
