---
name: youtube-upload
description: Upload videos to YouTube via browser automation. Use when asked to publish or upload a video to YouTube.
disable-model-invocation: true
allowed-tools:
  - mcp__claude-in-chrome__*
  - Read
---

# YouTube Upload Skill

Upload videos to YouTube using browser automation.

## Prerequisites

- Claude-in-Chrome extension must be connected
- Browser must be logged into YouTube account
- Video file must exist locally

## Upload Workflow

### 1. Navigate to YouTube Studio

```
Use mcp__claude-in-chrome__navigate to go to https://studio.youtube.com
Wait for page to load completely
```

### 2. Open Upload Dialog

```
Use mcp__claude-in-chrome__find to locate "Create" button (top right)
Click the Create button
Find and click "Upload video" in the dropdown
Wait for upload modal to appear
```

### 3. Upload Video File

```
Use mcp__claude-in-chrome__find to locate the file drop zone or "SELECT FILES" button
Use mcp__claude-in-chrome__upload_image with the video file path
Wait for upload to begin (progress indicator appears)
```

### 4. Wait for Upload

```
Monitor upload progress
Use mcp__claude-in-chrome__read_page to check upload percentage
Wait until processing begins (upload completes)
```

### 5. Fill Video Details

```
Title:
  - Use find to locate title input field
  - Use form_input to enter title (max 100 chars)

Description:
  - Find description textarea
  - Enter description (max 5000 chars)

Thumbnail (optional):
  - Find "Upload thumbnail" button
  - Use upload_image to add custom thumbnail
```

### 6. Configure Settings

```
Audience:
  - Find "No, it's not made for kids" radio button
  - Click to select

Age restriction (if needed):
  - Find "Age restriction" section
  - Configure as appropriate
```

### 7. Navigate Through Steps

```
Click "Next" to go through:
1. Details (title, description)
2. Video elements (cards, end screen) - can skip
3. Checks (copyright) - wait for processing
4. Visibility
```

### 8. Set Visibility

```
Find visibility options:
- "Public" - immediately visible
- "Unlisted" - only with link
- "Private" - only you
- "Schedule" - set publish time

Click desired visibility option
```

### 9. Publish

```
Find and click "Publish" or "Save" button
Wait for confirmation
```

### 10. Get Video URL

```
After publishing, find the video URL in the confirmation dialog
Format: https://youtu.be/VIDEO_ID or https://youtube.com/watch?v=VIDEO_ID
Return the URL to the user
```

## Error Handling

- If upload fails, check file format (MP4, MOV, AVI supported)
- If processing takes too long, wait and check back
- If copyright claim appears, note it but proceed
- Maximum file size: 256GB or 12 hours

## Tips

- Use clear, searchable titles
- Add timestamps in description for long videos
- Include relevant tags (in advanced settings)
- Consider scheduling for optimal publish time
- Save video URL for confirmation
