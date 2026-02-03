---
name: x-posting
description: Compose and post tweets to X with character validation. Use when asked to post or tweet something.
disable-model-invocation: true
allowed-tools:
  - mcp__claude-in-chrome__*
---

# X Posting Skill

Compose and post tweets to X (Twitter).

## Prerequisites

- Claude-in-Chrome extension must be connected
- Browser must be logged into X.com
- User must confirm the tweet content before posting

## Character Limits

- Standard tweet: 280 characters
- Twitter Blue: 25,000 characters
- Always validate length before posting

## Posting Workflow

### 1. Validate Tweet Content

```javascript
const tweet = "Your tweet content here";
if (tweet.length > 280) {
  // Either truncate or split into thread
  console.log("Tweet exceeds 280 characters");
}
```

### 2. Navigate to X

```
Use mcp__claude-in-chrome__navigate to go to https://x.com
Wait for page to fully load
```

### 3. Open Compose Modal

```
Use mcp__claude-in-chrome__find to locate "Post" or compose button
Click the compose button
Wait for modal to appear
```

### 4. Enter Tweet Text

```
Use mcp__claude-in-chrome__find to locate the tweet input area
Use mcp__claude-in-chrome__form_input to enter the tweet text
```

### 5. Add Media (Optional)

If including images or video:
```
Use mcp__claude-in-chrome__find to locate media upload button
Use mcp__claude-in-chrome__upload_image to add media
Wait for upload to complete
```

### 6. Post the Tweet

```
Use mcp__claude-in-chrome__find to locate "Post" button
Click to post
Wait for confirmation
```

### 7. Verify Success

```
Check for success notification or the tweet appearing in timeline
Return the tweet URL if available
```

## Threading

For content longer than 280 characters:

1. Split into logical chunks under 280 chars each
2. Number them: (1/3), (2/3), (3/3)
3. Post first tweet
4. Reply to first tweet with second part
5. Continue replying to create thread

## Safety Notes

- Always confirm tweet content with user before posting
- Double-check @mentions to avoid tagging wrong accounts
- Be cautious with sensitive or controversial content
- Consider timing for optimal engagement
