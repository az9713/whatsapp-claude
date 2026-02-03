# Quick Start Guide

> **Goal**: Get you up and running with your first 10 successful commands in under 30 minutes.

## Before You Begin

Make sure you have completed the [Installation Guide](INSTALLATION.md). You should have:
- ✅ The WhatsApp bot running (`npm start`)
- ✅ Your phone linked via QR code scan
- ✅ API keys configured in `.env`

---

## Testing Your Setup

Before diving into use cases, let's make sure everything is working.

### Step 1: Start the Bot

Open a terminal and navigate to the project folder:

```bash
# Navigate to project directory
cd whatsapp-claude

# Install dependencies (first time only)
npm install

# Start the bot
npm start
```

You should see:
```
🚀 Starting WhatsApp-Claude Bridge...

📱 Scan this QR code with WhatsApp:
[QR CODE]

🔐 Authentication successful
✅ WhatsApp bot is ready!
```

### Step 2: Link Your Phone

1. Open WhatsApp on your phone
2. Go to **Settings** → **Linked Devices** → **Link a Device**
3. Scan the QR code shown in your terminal
4. Wait for "Authentication successful" message

### Step 3: Quick Verification Test

Send this message **to yourself** on WhatsApp:
```
/claude hello
```

**Expected**: You receive a response from Claude within a few seconds.

### Step 4: Test Remotion (Video System)

Open a **second terminal** (keep the bot running):

```bash
# Navigate to project
cd whatsapp-claude

# Go to Remotion folder
cd remotion-videos

# Install dependencies (first time only)
npm install

# Start preview server
npx remotion studio
```

**Expected**: Browser opens at http://localhost:3000 showing video compositions.

### Step 5: Test Video Rendering

In the Remotion terminal:

```bash
npx remotion render CountdownTimer ../output/test-countdown.mp4
```

**Expected**: A video file is created at `output/test-countdown.mp4`

---

## Quick Test Checklist

| Test | How to Test | Expected Result |
|------|-------------|-----------------|
| Bot running | Check terminal | Shows "WhatsApp bot is ready!" |
| Bot responds | Send `/claude hello` | Receive a response |
| Create file | Send `/claude create file output/test.txt with "hello"` | File appears in output/ |
| Remotion preview | Run `npx remotion studio` | Browser opens at localhost:3000 |
| Video render | Run `npx remotion render CountdownTimer out.mp4` | MP4 file created |

**All working?** Continue to the use cases below!

**Something not working?** See [Troubleshooting Guide](TROUBLESHOOTING.md)

---

## How to Send Commands

1. Open WhatsApp on your phone
2. Go to your own chat (send a message to yourself)
3. Type `/claude ` followed by your command
4. Wait for the response

**Example:**
```
/claude hello, what can you do?
```

### Conversation Memory

The bot remembers your conversation! After your first message:

```
You:    /claude create a video about cats
Claude: "What style do you want? 1) Funny 2) Educational 3) Cute"

You:    /claude option 3
Claude: [Remembers you're talking about cats, continues with cute style]
```

**To start fresh:** `/claude --new <new topic>`

**Want to understand the magic?** See [How It Works](HOW_IT_WORKS.md) for a detailed explanation of how your iPhone controls your laptop.

---

## 10 Quick Win Use Cases

### Use Case 1: Say Hello (The Simplest Test)

**What it does**: Confirms the system is working

**Send this:**
```
/claude hello! please introduce yourself and tell me what you can help me with
```

**Expected result**: Claude responds with a greeting and lists its capabilities

**Why this is useful**: This confirms your WhatsApp-Claude connection is working. If you get a response, everything is set up correctly!

---

### Use Case 2: Get Current Time and Date

**What it does**: Shows Claude can execute system commands

**Send this:**
```
/claude what is the current date and time?
```

**Expected result**: Returns the current date and time

**Why this is useful**: Proves Claude can execute commands on your computer and return results.

---

### Use Case 3: Create a Simple Text File

**What it does**: Creates a file in your project folder

**Send this:**
```
/claude create a file called "my-first-file.txt" in the output folder with the content "Hello from WhatsApp!"
```

**Expected result**:
- File created at `output/my-first-file.txt`
- Confirmation message sent back

**Why this is useful**: Demonstrates Claude can create and manage files for you remotely.

**Verify it worked**: Check the `output/` folder on your computer.

---

### Use Case 4: List Files in a Directory

**What it does**: Shows what files exist in a folder

**Send this:**
```
/claude list all files in the output folder
```

**Expected result**: A list of files including `my-first-file.txt` from Use Case 3

**Why this is useful**: You can remotely check what files exist without being at your computer.

---

### Use Case 5: Generate a Voice Recording

**What it does**: Creates an audio file with spoken words

**Send this:**
```
/claude generate a voice recording saying "Welcome to my channel! Today we're going to learn something amazing." Save it to output/welcome.mp3 using the nova voice
```

**Expected result**:
- Audio file created at `output/welcome.mp3`
- You can play this file and hear the spoken words

**Why this is useful**: Create professional voice-overs for videos, podcasts, or presentations without recording yourself.

**Try different voices**: nova, echo, fable, onyx, alloy, shimmer

---

### Use Case 6: Write a Video Script

**What it does**: Creates a professional video script with hooks and structure

**Send this:**
```
/claude write a 60-second video script about "5 tips for better sleep". Include a hook, main content, and call to action. Save it to output/sleep-tips-script.md
```

**Expected result**: A well-structured script file with:
- Attention-grabbing hook
- 5 tips with explanations
- Call to action at the end

**Why this is useful**: Get AI-written scripts for your YouTube videos, TikToks, or presentations.

---

### Use Case 7: Research a Topic

**What it does**: Searches the web and summarizes findings

**Send this:**
```
/claude research the topic "benefits of meditation" and create a summary with 5 key points. Save to output/meditation-research.md
```

**Expected result**: A markdown file with:
- Overview of the topic
- 5 key benefits with explanations
- Sources mentioned

**Why this is useful**: Quick research on any topic without opening your browser.

---

### Use Case 8: Preview Video Compositions

**What it does**: Opens a browser preview of available video templates

**Send this:**
```
/claude start the Remotion preview server so I can see the video templates
```

**Expected result**:
- Browser opens at http://localhost:3000
- You can preview all 12 video compositions

**Why this is useful**: See what video types you can create before rendering.

**Note**: This requires you to be at your computer to see the browser.

---

### Use Case 9: Render a Countdown Video

**What it does**: Creates an actual video file

**Send this:**
```
/claude render the CountdownTimer video and save it to output/countdown.mp4
```

**Expected result**:
- A 7-second video file at `output/countdown.mp4`
- Shows 3-2-1-GO! countdown animation

**Why this is useful**: Create professional video intros, transitions, or standalone content.

**Time**: This may take 1-2 minutes depending on your computer.

---

### Use Case 10: Create a Complete Voice-Over Video

**What it does**: Combines multiple features to create a complete video with narration

**Send this:**
```
/claude do the following steps:
1. Generate voice saying "Welcome to today's quick tip. Did you know that drinking water first thing in the morning can boost your energy? Try it tomorrow and see the difference!" Save to output/tip-voice.mp3
2. Tell me when complete
```

**Expected result**:
- Voice-over audio created
- Confirmation message

**Why this is useful**: This shows how you can chain multiple commands together.

---

## Bonus Use Cases

### Use Case 11: Schedule a Daily Task

**What it does**: Sets up a command to run automatically every day

**Send this:**
```
/claude explain how I would schedule a task to run every morning at 8am that creates a motivational quote file
```

**Expected result**: Step-by-step instructions for setting up a cron job

**Why this is useful**: Automate repetitive tasks like daily reports, backups, or content generation.

---

### Use Case 12: Get Help with Any Command

**What it does**: Explains how to do something

**Send this:**
```
/claude explain all the voices available for text-to-speech and which one is best for professional tutorials
```

**Expected result**: Detailed explanation of each voice option with recommendations

**Why this is useful**: Learn how to use features without reading documentation.

---

## What's Next?

Now that you've completed these quick wins, you're ready to explore more:

1. **[User Guide](USER_GUIDE.md)** - Complete instructions for all features
2. **[Skills Reference](SKILLS_REFERENCE.md)** - Detailed documentation for each skill
3. **[Troubleshooting](TROUBLESHOOTING.md)** - If something doesn't work

---

## Quick Reference Card

| Task | Command Pattern |
|------|-----------------|
| Simple question | `/claude <your question>` |
| Create file | `/claude create a file called X with content Y` |
| Generate voice | `/claude generate voice saying "X" save to Y --voice Z` |
| Write script | `/claude write a video script about X` |
| Research topic | `/claude research X and summarize` |
| Render video | `/claude render the <CompositionName> video` |
| List files | `/claude list files in <folder>` |
| Get help | `/claude how do I <task>?` |

---

## Tips for Best Results

1. **Be specific**: Instead of "make a video", say "render the ClaudeCodeIntro video and save to output/intro.mp4"

2. **One task at a time**: Start simple, then combine commands once you're comfortable

3. **Check output folder**: Most generated content goes to the `output/` folder

4. **Use full paths**: If a file isn't found, try using the complete path

5. **Be patient**: Some tasks (like video rendering) take time - wait for the response

---

## Common First-Timer Issues

### "I sent a message but nothing happened"
- Make sure your message starts with `/claude ` (note the space after)
- Check if the bot is still running (look at your terminal)
- Make sure you're messaging yourself, not a group

### "I got an error about permissions"
- Some commands need the Chrome extension connected
- Run browser-related commands at your computer first

### "The video didn't render"
- First run `npx remotion studio` in the terminal to ensure Remotion is working
- Make sure the output folder exists

Need more help? See [Troubleshooting Guide](TROUBLESHOOTING.md)
