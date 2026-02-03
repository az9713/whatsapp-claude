---
name: x-navigation
description: Navigate X (Twitter) to search users, posts, and gather context. Use when researching topics on X or browsing Twitter.
allowed-tools:
  - mcp__claude-in-chrome__*
  - Read
  - Write
---

# X Navigation Skill

Navigate X (Twitter) to search for content, users, and topics.

## Prerequisites

- Claude-in-Chrome extension must be connected
- Browser must be logged into X.com

## Navigation Workflow

### 1. Open X

```
Use mcp__claude-in-chrome__navigate to go to https://x.com
```

### 2. Search for Content

```
1. Use mcp__claude-in-chrome__find to locate the search bar
2. Use mcp__claude-in-chrome__form_input to enter search query
3. Press Enter to search
```

### 3. Browse Results

```
1. Use mcp__claude-in-chrome__read_page to extract visible tweets
2. Use mcp__claude-in-chrome__computer with scroll action to load more
3. Repeat to gather more posts
```

### 4. Navigate to User Profile

```
1. Search for @username or click on a user mention
2. Use read_page to extract profile info and pinned tweet
3. Scroll to view recent posts
```

## Tips

- Use search filters: `from:user`, `to:user`, `since:2024-01-01`
- Look for engagement metrics (likes, retweets, replies)
- Check verified status and follower counts for credibility
- Save interesting posts to assets/downloads/ for later analysis
