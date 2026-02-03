# Complete User Guide

> **Audience**: End users who want to use the WhatsApp-Claude system without needing to modify the code.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Basic Commands](#basic-commands)
4. [Browser Automation](#browser-automation)
5. [Video Creation](#video-creation)
6. [Voice Generation](#voice-generation)
7. [Avatar Videos](#avatar-videos)
8. [Email Automation](#email-automation)
9. [Task Scheduling](#task-scheduling)
10. [Tips and Best Practices](#tips-and-best-practices)

---

## Introduction

### What is WhatsApp-Claude?

WhatsApp-Claude is a system that lets you control your computer using WhatsApp messages. Think of it as having a personal assistant that can:

- Browse websites for you
- Create professional videos
- Generate voice recordings
- Send emails
- Run scheduled tasks

All you need to do is send a message to yourself on WhatsApp!

### How Does It Work?

```
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│  Your Phone     │  ──────▶ │  Your Computer  │  ──────▶ │   The Task      │
│  (WhatsApp)     │          │  (Bot Running)  │          │   Gets Done     │
└─────────────────┘          └─────────────────┘          └─────────────────┘
    You type                    Bot receives                Claude executes
    /claude ...                 your message                your request
```

### Prerequisites

Before using this guide, ensure:
1. The system is installed (see [Installation Guide](INSTALLATION.md))
2. The bot is running on your computer
3. Your phone is linked to the bot

---

## Getting Started

### Starting the System

On your computer, open a terminal and run:

```bash
cd /path/to/whatsapp-claude
npm start
```

You'll see:
```
🚀 Starting WhatsApp-Claude Bridge...
✅ WhatsApp bot is ready!
📁 Workspace: /path/to/whatsapp-claude
📝 Send "/claude <task>" to yourself to execute commands
```

### Sending Your First Command

1. Open WhatsApp on your phone
2. Find your own contact (or "Message yourself" chat)
3. Type: `/claude hello`
4. Press send
5. Wait for the response (usually 5-30 seconds)

### Understanding Responses

Responses come back as WhatsApp messages. Long responses are split into multiple messages labeled "Part 1/3", "Part 2/3", etc.

---

## Basic Commands

### Asking Questions

```
/claude what time is it?
/claude what day is today?
/claude how many files are in the output folder?
```

### Creating Files

```
/claude create a file called notes.txt with the content "Remember to buy milk"
/claude create a markdown file called ideas.md with a list of 5 business ideas
```

### Reading Files

```
/claude read the file output/notes.txt
/claude show me the contents of CLAUDE.md
```

### Listing Files

```
/claude list all files in the output folder
/claude show me all .mp4 files
/claude how many videos are in output/?
```

### Deleting Files

```
/claude delete the file output/old-video.mp4
/claude remove all .tmp files from output/
```

---

## Browser Automation

### Prerequisites for Browser Features

Browser automation requires:
1. Chrome browser installed
2. Claude-in-Chrome extension installed
3. Logged into the websites you want to use (Twitter, YouTube, Gmail)

### Browsing Twitter/X

**Search for topics:**
```
/claude go to Twitter and search for "artificial intelligence news"
```

**Research a topic:**
```
/claude research what people on Twitter are saying about ChatGPT and summarize the top 5 posts
```

**View a profile:**
```
/claude go to Twitter and check @elonmusk's latest tweets
```

### Using YouTube

**Search YouTube:**
```
/claude search YouTube for "how to make coffee" and list the top 5 videos
```

**Upload a video:**
```
/claude upload the video output/my-video.mp4 to YouTube with title "My First Video" and description "Testing the upload feature"
```

### Gmail

**Read emails:**
```
/claude check my Gmail inbox and summarize the 5 most recent emails
```

**Send an email:**
```
/claude send an email to friend@email.com with subject "Hello!" and message "Just testing my new bot!"
```

> **Security Note**: Always verify email content before sending. The bot will ask for confirmation before sending emails.

---

## Video Creation

### Understanding Video Compositions

Videos are created using "compositions" - pre-made templates that you can customize. Think of them like PowerPoint templates but for videos.

### Available Compositions

| Name | Duration | Best For |
|------|----------|----------|
| ClaudeCodeIntro | 7 sec | Video intros, brand openings |
| DataDashboard | 12 sec | Presenting statistics |
| KineticTypography | 14 sec | Quotes, inspirational text |
| ProductShowcase | 15 sec | Feature lists, products |
| CountdownTimer | 7 sec | Countdowns, transitions |
| CodeWalkthrough | 16 sec | Code tutorials |
| CodeExplainer | 30 sec | Explaining code with highlights |
| GitHubRecap | 30 sec | Developer activity summaries |
| ThreadToVideo | varies | Converting Twitter threads |
| Audiogram | varies | Podcast clips with waveforms |
| VerticalShort | 15 sec | TikTok, Reels, Shorts |
| NewsVideo | 60 sec | News-style presentations |

### Previewing Videos

Before rendering (which takes time), preview your video:

```
/claude start Remotion preview server
```

Then open http://localhost:3000 in your browser to see all compositions.

### Rendering Videos

**Basic render:**
```
/claude render the ClaudeCodeIntro video to output/intro.mp4
```

**With custom text:**
```
/claude render ClaudeCodeIntro video with title "My Channel" and subtitle "Subscribe for more!" to output/my-intro.mp4
```

**Render with custom data (DataDashboard):**
```
/claude render DataDashboard with stats showing Users: 5000, Revenue: 25000, Growth: 150 to output/dashboard.mp4
```

### Video Rendering Tips

1. **Rendering takes time**: A 10-second video might take 30 seconds to 2 minutes
2. **Check composition names**: Use exact names like "ClaudeCodeIntro" not "claude code intro"
3. **Vertical videos**: Use "VerticalShort" for TikTok/Reels format

---

## Voice Generation

### What is Text-to-Speech (TTS)?

TTS converts written text into spoken audio. You can create voice-overs for videos, podcasts, or any audio content.

### Available Voices

| Voice | Character | Best For |
|-------|-----------|----------|
| nova | Clear, friendly | Tutorials, explainers |
| onyx | Deep, authoritative | Professional content, news |
| echo | Warm, conversational | Podcasts, casual content |
| fable | Expressive, animated | Storytelling |
| shimmer | Soft, gentle | Meditation, calm content |
| alloy | Neutral, balanced | General purpose |

### Generating Voice

**Basic voice generation:**
```
/claude generate voice saying "Hello and welcome to my channel" to output/welcome.mp3
```

**With specific voice:**
```
/claude generate voice saying "Today's top story in technology" using onyx voice to output/news.mp3
```

### Voice Generation Tips

1. **Use punctuation**: Periods create pauses, commas create brief pauses
2. **Spell out abbreviations**: Write "API" as "A P I" for proper pronunciation
3. **Keep it short**: For long scripts, break into paragraphs
4. **Test different voices**: Each voice has a different feel

### Voice + Video Workflow

A common workflow:

1. Write your script
2. Generate the voice-over
3. Create a video composition
4. Combine them using video editing software

```
/claude write a 30-second script about productivity tips
/claude generate voice of that script using nova voice to output/productivity.mp3
/claude render KineticTypography with quote "Work smarter, not harder" to output/productivity.mp4
```

---

## Avatar Videos

### What are Avatar Videos?

Avatar videos create a talking-head video where an AI-generated person speaks your script. The avatar's lips sync with the audio.

### Prerequisites

- fal.ai API key (set in .env file)
- An avatar image (portrait photo)

### Creating an Avatar Video

**Step 1: Prepare your avatar image**

Place a portrait image in the assets folder:
```
/claude check if there's an avatar image in the assets folder
```

**Step 2: Generate the avatar video**

```
/claude create an avatar video with script "Hello everyone! Welcome to my channel. Today I'm going to show you something amazing." using the avatar image at assets/avatar.png
```

**Step 3: Add background music (optional)**

```
/claude add background music from assets/music/background.mp3 to output/avatar.mp4 at 15% volume
```

### Avatar Image Guidelines

For best results, your avatar image should be:
- Portrait orientation (taller than wide)
- Clear, well-lit face
- Front-facing (looking at camera)
- Neutral expression
- Minimum 512x512 pixels

---

## Email Automation

### Reading Emails

```
/claude check my Gmail and tell me if I have any unread emails
/claude list my last 5 emails with subjects and senders
/claude search my email for messages from "amazon.com"
```

### Sending Emails

```
/claude send email to john@example.com with subject "Meeting Tomorrow" and message "Hi John, just confirming our meeting tomorrow at 2pm. See you then!"
```

### Email Safety

The system will always:
1. Show you the email content before sending
2. Ask for confirmation
3. Wait for your approval

Never auto-send emails without review!

---

## Task Scheduling

### What is Task Scheduling?

Scheduling lets you run commands automatically at specific times. Like setting an alarm, but for tasks.

### Understanding Cron Format

Tasks are scheduled using "cron" format:
```
Minute Hour Day Month Weekday
```

**Examples:**
- `0 9 * * *` = Every day at 9:00 AM
- `0 9 * * 1` = Every Monday at 9:00 AM
- `30 18 * * *` = Every day at 6:30 PM
- `0 */2 * * *` = Every 2 hours

### Scheduling via Natural Language

```
/claude schedule a task at 9am every day to check Hacker News
/claude schedule a weekly task every Monday at 8am to create a GitHub summary
/claude schedule every hour from 9am to 5pm to check my email
```

### Viewing Scheduled Tasks

```
/claude list all scheduled tasks
/claude show me my cron jobs
```

### Removing Scheduled Tasks

```
/claude remove the scheduled task for Hacker News
/claude delete all scheduled tasks
```

### Scheduling Tips

1. **Start simple**: Schedule one task and verify it works
2. **Check logs**: Scheduled tasks log to `/var/log/agent.log`
3. **Be careful**: Scheduled tasks run automatically - make sure they're correct
4. **Time zones**: Tasks use your computer's time zone

---

## Tips and Best Practices

### Command Writing Tips

**Be Specific**
```
❌ "make a video"
✅ "render the ClaudeCodeIntro video with title 'My Channel' to output/intro.mp4"
```

**Use Exact Names**
```
❌ "render the dashboard video"
✅ "render the DataDashboard video"
```

**Include Save Locations**
```
❌ "generate voice saying hello"
✅ "generate voice saying 'hello' to output/hello.mp3"
```

### Workflow Tips

**Check before long operations:**
```
/claude what compositions are available?
```

**Verify files exist:**
```
/claude does the file output/video.mp4 exist?
```

**Get help:**
```
/claude how do I create a vertical video for TikTok?
```

### Troubleshooting Common Issues

**Command not working?**
1. Make sure it starts with `/claude ` (with space)
2. Check the bot is still running
3. Try a simpler command first

**Browser automation failing?**
1. Ensure Chrome extension is connected
2. Make sure you're logged into the website
3. Try the command while at your computer

**Video not rendering?**
1. Check composition name is exact
2. Verify Remotion is installed (`cd remotion-videos && npm install`)
3. Try previewing first with `npx remotion studio`

---

## Command Reference

### File Operations
| Command | Example |
|---------|---------|
| Create file | `/claude create file X with content Y` |
| Read file | `/claude read file X` |
| Delete file | `/claude delete file X` |
| List files | `/claude list files in folder X` |

### Video Operations
| Command | Example |
|---------|---------|
| Preview | `/claude start Remotion preview` |
| Render | `/claude render CompositionName to output/file.mp4` |
| List compositions | `/claude list available video compositions` |

### Voice Operations
| Command | Example |
|---------|---------|
| Generate voice | `/claude generate voice saying "X" to output/file.mp3` |
| Use specific voice | `/claude generate voice using nova saying "X"` |
| List voices | `/claude what TTS voices are available?` |

### Browser Operations
| Command | Example |
|---------|---------|
| Navigate | `/claude go to website X` |
| Search | `/claude search Twitter for X` |
| Click | `/claude click the login button` |

### Email Operations
| Command | Example |
|---------|---------|
| Read inbox | `/claude check my Gmail` |
| Send email | `/claude send email to X with subject Y and message Z` |
| Search | `/claude search email for X` |

### Scheduling Operations
| Command | Example |
|---------|---------|
| Schedule | `/claude schedule at 9am daily to X` |
| List tasks | `/claude list scheduled tasks` |
| Remove | `/claude remove scheduled task X` |

---

## Getting Help

1. **Quick Start Guide**: [QUICK_START.md](QUICK_START.md)
2. **Skills Reference**: [SKILLS_REFERENCE.md](SKILLS_REFERENCE.md)
3. **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
4. **Glossary**: [GLOSSARY.md](GLOSSARY.md) - Technical terms explained

---

## Safety and Privacy

### Best Practices

1. **Never share API keys**: Keep your `.env` file private
2. **Review before sending**: Always check email content before sending
3. **Be careful with browser automation**: It controls your actual accounts
4. **Monitor scheduled tasks**: Check logs regularly

### What the Bot Can Access

- Files in the project folder
- Websites through your Chrome browser
- Your logged-in accounts (Gmail, Twitter, YouTube)

### What You Control

- What commands get executed
- What emails get sent (requires your approval)
- What gets posted on social media
