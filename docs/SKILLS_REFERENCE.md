# Skills Reference

> **Purpose**: Complete documentation for all available skills.

## Table of Contents

1. [What Are Skills?](#what-are-skills)
2. [Social Media Skills](#social-media-skills)
3. [Video Production Skills](#video-production-skills)
4. [Audio Skills](#audio-skills)
5. [Communication Skills](#communication-skills)
6. [Automation Skills](#automation-skills)

---

## What Are Skills?

Skills are instruction sets that tell Claude how to perform specific tasks. Each skill:

- Has a specific purpose
- Defines which tools it can use
- Provides step-by-step instructions

### How to Use Skills

Simply ask Claude to do something related to the skill:

```
/claude research AI news on Twitter
```

Claude automatically selects the appropriate skill (x-research in this case).

### Skill Location

Skills are stored in `.claude/skills/<skill-name>/SKILL.md`

---

## Social Media Skills

### x-navigation

**Purpose**: Navigate and browse X (Twitter)

**Best For**:
- Searching for topics on Twitter
- Viewing user profiles
- Browsing tweet timelines

**Example Commands**:
```
/claude go to Twitter and search for "artificial intelligence"
/claude check @elonmusk profile on X
/claude browse the trending topics on Twitter
```

**What It Does**:
1. Opens X.com in Chrome
2. Uses the search bar to find content
3. Scrolls to load more posts
4. Extracts tweet content and engagement data

**Requirements**:
- Chrome browser with Claude-in-Chrome extension
- Must be logged into X.com

---

### x-research

**Purpose**: Research topics by gathering multiple posts from X

**Best For**:
- Understanding public sentiment
- Gathering opinions on a topic
- Finding trending discussions

**Example Commands**:
```
/claude research what people are saying about ChatGPT on Twitter
/claude find the top 5 posts about AI agents on X and summarize them
/claude what's the sentiment about Apple stock on Twitter today?
```

**What It Does**:
1. Searches X for the topic
2. Collects 5-10 relevant posts
3. Extracts: author, content, engagement, timestamp
4. Synthesizes findings into a report

**Output Format**:
```markdown
# Research: [Topic]

## Summary
[Overview of findings]

## Key Insights
- Insight 1
- Insight 2

## Notable Posts
1. @user: "quote" (X likes)
2. @user: "quote" (X likes)

## Sentiment
[Positive/Negative/Mixed]
```

**Requirements**:
- Chrome browser with Claude-in-Chrome extension
- Logged into X.com

---

### x-posting

**Purpose**: Compose and post tweets to X

**Best For**:
- Posting updates
- Sharing content
- Creating threads

**Example Commands**:
```
/claude post a tweet saying "Just discovered this amazing AI tool!"
/claude create a Twitter thread about 5 productivity tips
```

**What It Does**:
1. Validates tweet length (280 chars max)
2. Opens compose dialog
3. Enters tweet text
4. Posts (with your confirmation)

**Important**:
- Always confirms content before posting
- Won't post without your approval
- Handles threading for long content

**Requirements**:
- Chrome browser with Claude-in-Chrome extension
- Logged into X.com

---

## Video Production Skills

### video-understanding

**Purpose**: Download videos and transcribe their content

**Best For**:
- Understanding video content
- Creating transcripts
- Summarizing YouTube videos

**Example Commands**:
```
/claude download and transcribe this video: [URL]
/claude summarize the content of this YouTube video: [URL]
/claude extract the key points from this video
```

**What It Does**:
1. Downloads video using yt-dlp
2. Extracts audio track
3. Transcribes with Whisper
4. Provides summary

**Output**:
- Downloaded video in `assets/downloads/`
- Transcript in `output/`
- Summary of key points

**Requirements**:
- yt-dlp installed
- FFmpeg installed
- Whisper installed (for transcription)

---

### video-research

**Purpose**: Research topics for video content creation

**Best For**:
- Planning video content
- Gathering facts and statistics
- Finding angles and hooks

**Example Commands**:
```
/claude research the topic "remote work benefits" for a YouTube video
/claude find interesting facts about AI for a video I'm making
/claude gather statistics about climate change for a video
```

**What It Does**:
1. Searches web and social media
2. Gathers facts, statistics, quotes
3. Identifies trending angles
4. Compiles research document

**Output Format**:
```markdown
# Video Research: [Topic]

## Key Facts
- Fact 1 (source)
- Fact 2 (source)

## Statistics
- Stat 1
- Stat 2

## Visual Ideas
- Suggested visuals

## Sources
- URL 1
- URL 2
```

---

### video-script

**Purpose**: Write video scripts with hooks and structure

**Best For**:
- YouTube scripts
- TikTok/Reels scripts
- Educational content

**Example Commands**:
```
/claude write a 60-second video script about productivity tips
/claude create a YouTube video script about AI tools
/claude write a TikTok script about morning routines
```

**What It Does**:
1. Creates attention-grabbing hook
2. Structures main content
3. Adds call to action
4. Estimates timing

**Script Structure**:
```markdown
# [Title]

## Hook (0:00-0:10)
[Attention-grabbing opening]

## Introduction (0:10-0:30)
[Set up the topic]

## Main Content (0:30-X:XX)
[Core message]

## Call to Action
[What viewer should do]
```

**Timing Guide**:
- ~150 words per minute
- 60 seconds ≈ 150 words
- 5 minutes ≈ 750 words

---

### video-render

**Purpose**: Render videos using Remotion compositions

**Best For**:
- Creating intro videos
- Generating data visualizations
- Making social media content

**Example Commands**:
```
/claude render a countdown timer video
/claude create a data dashboard showing revenue of 50000
/claude render an intro video with title "My Channel"
```

**Available Compositions**:

| Composition | Duration | Description |
|-------------|----------|-------------|
| ClaudeCodeIntro | 7s | Branded opener |
| DataDashboard | 12s | Animated charts |
| KineticTypography | 14s | Quote animation |
| ProductShowcase | 15s | Feature list |
| CountdownTimer | 7s | 3-2-1-GO! |
| CodeWalkthrough | 16s | Code display |
| CodeExplainer | 30s | Code tutorial |
| GitHubRecap | 30s | GitHub stats |
| ThreadToVideo | varies | Tweet threads |
| Audiogram | varies | Audio visualization |
| VerticalShort | 15s | TikTok format |
| NewsVideo | 60s | News style |

**Output**: MP4 file in `output/` folder

**Requirements**:
- Remotion installed
- FFmpeg installed

---

## Audio Skills

### tts

**Purpose**: Generate voice-over audio using OpenAI TTS

**Best For**:
- Video narration
- Podcast creation
- Audio content

**Example Commands**:
```
/claude generate voice saying "Welcome to my channel" as output/welcome.mp3
/claude create a voiceover with nova voice for this script: [text]
/claude make an audio file saying "Hello world" using the onyx voice
```

**Available Voices**:

| Voice | Character | Best For |
|-------|-----------|----------|
| nova | Clear, friendly | Tutorials |
| onyx | Deep, authoritative | News, professional |
| echo | Warm, conversational | Podcasts |
| fable | Expressive | Storytelling |
| shimmer | Soft, gentle | Meditation |
| alloy | Neutral | General use |

**Output**: MP3 file

**Requirements**:
- OpenAI API key in .env

**Cost**: ~$0.015 per 1000 characters

---

### avatar-video

**Purpose**: Generate lip-synced avatar videos using OmniHuman

**Best For**:
- Talking head videos
- Avatar presentations
- Faceless content creation

**Example Commands**:
```
/claude create an avatar video with this script: "Hello, welcome to my channel!"
/claude generate a talking head video using assets/avatar.png
```

**Pipeline**:
1. Generate voice with TTS
2. Upload audio and image to CDN
3. Generate video with OmniHuman
4. Add background music (optional)

**Avatar Image Guidelines**:
- Portrait orientation
- Clear, well-lit face
- Front-facing
- Minimum 512x512 pixels

**Output**: MP4 file in `output/`

**Requirements**:
- OpenAI API key (for TTS)
- fal.ai API key (for OmniHuman)
- Avatar image

---

## Communication Skills

### gmail

**Purpose**: Send and read emails via Gmail

**Best For**:
- Sending updates
- Checking inbox
- Email management

**Example Commands**:
```
/claude check my Gmail inbox
/claude send email to john@example.com about the meeting
/claude search my email for messages from Amazon
```

**What It Can Do**:
- Read inbox
- Read specific emails
- Send emails (with confirmation)
- Search emails

**Important**:
- Always confirms before sending
- Won't send without approval
- Shows email content before sending

**Requirements**:
- Chrome with Claude-in-Chrome extension
- Logged into Gmail

---

### youtube-upload

**Purpose**: Upload videos to YouTube

**Best For**:
- Publishing content
- Managing uploads
- Setting video metadata

**Example Commands**:
```
/claude upload output/video.mp4 to YouTube with title "My Video"
/claude publish the video at output/intro.mp4 to my YouTube channel
```

**What It Does**:
1. Opens YouTube Studio
2. Starts upload
3. Sets title and description
4. Configures visibility
5. Publishes (with confirmation)

**Required Fields**:
- Title (max 100 characters)
- Description (optional)
- Visibility (Public/Unlisted/Private)

**Requirements**:
- Chrome with Claude-in-Chrome extension
- Logged into YouTube

---

## Automation Skills

### schedule-job

**Purpose**: Schedule recurring tasks using cron

**Best For**:
- Daily routines
- Automated research
- Periodic content creation

**Example Commands**:
```
/claude schedule a task at 9am daily to check Hacker News
/claude create a weekly job every Monday to create GitHub summary
/claude schedule every hour from 9-5 to check my email
```

**Time Format Examples**:

| Description | Schedule |
|-------------|----------|
| Every day at 9am | 0 9 * * * |
| Every Monday at 8am | 0 8 * * 1 |
| Every hour | 0 * * * * |
| Every 2 hours 9am-9pm | 0 */2 9-21 * * * |
| First of month at 9am | 0 9 1 * * |

**Managing Jobs**:
```
/claude list all scheduled tasks
/claude remove the Hacker News scheduled task
```

**Requirements**:
- cron available on system (Linux/macOS)
- On Windows, uses Task Scheduler

**Logs**: Tasks log to `/var/log/agent.log`

---

## Quick Reference

### Which Skill for What?

| I want to... | Use this skill |
|--------------|----------------|
| Browse Twitter | x-navigation |
| Research Twitter opinions | x-research |
| Post a tweet | x-posting |
| Understand a video | video-understanding |
| Research for video content | video-research |
| Write a video script | video-script |
| Create a video | video-render |
| Generate voice-over | tts |
| Create avatar video | avatar-video |
| Send/read email | gmail |
| Upload to YouTube | youtube-upload |
| Automate tasks | schedule-job |

### Command Patterns

```
# Research
/claude research [topic] on Twitter
/claude find information about [topic] for a video

# Create content
/claude write a script about [topic]
/claude generate voice saying "[text]" to [path]
/claude render [composition] video to [path]

# Communicate
/claude send email to [address] about [topic]
/claude post tweet saying "[content]"

# Automate
/claude schedule at [time] to [task]
```
