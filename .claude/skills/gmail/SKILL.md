---
name: gmail
description: Send and read emails via Gmail browser automation. Use when asked to send email or check inbox.
disable-model-invocation: true
allowed-tools:
  - mcp__claude-in-chrome__*
---

# Gmail Skill

Send and read emails using Gmail browser automation.

## Prerequisites

- Claude-in-Chrome extension must be connected
- Browser must be logged into Gmail account

## Send Email

### 1. Navigate to Gmail

```
Use mcp__claude-in-chrome__navigate to go to https://mail.google.com
Wait for inbox to load
```

### 2. Open Compose

```
Use mcp__claude-in-chrome__find to locate "Compose" button
Click Compose
Wait for compose modal to appear
```

### 3. Fill Email Fields

```
To:
  - Find "To" input field
  - Use form_input to enter recipient email

Subject:
  - Find "Subject" input field
  - Enter subject line

Body:
  - Find message body textarea
  - Enter email content
```

### 4. Add Attachments (Optional)

```
Find the attachment (paperclip) icon
Click to open file picker
Use upload to attach files
Wait for upload to complete
```

### 5. Send Email

```
Find "Send" button
Click to send
Verify email was sent (compose modal closes)
```

## Read Emails

### 1. Navigate to Inbox

```
Use mcp__claude-in-chrome__navigate to go to https://mail.google.com
Wait for inbox to load
```

### 2. List Inbox

```
Use mcp__claude-in-chrome__read_page to extract inbox items
Each email shows: sender, subject, snippet, time
```

### 3. Read Specific Email

```
Use find to locate the email by subject or sender
Click on the email to open it
Use get_page_text to extract full email content
```

### 4. Search Emails

```
Find the search bar at top
Enter search query:
  - from:sender@email.com
  - subject:keyword
  - has:attachment
  - after:2024/01/01
Press Enter to search
```

## Navigate Folders

```
Primary: Main inbox
Social: Social notifications
Promotions: Marketing emails
Sent: Sent emails
Drafts: Unsent drafts
Starred: Starred emails
```

## Reply to Email

```
1. Open the email
2. Find "Reply" button
3. Click Reply
4. Enter response in compose area
5. Click Send
```

## Tips

- Use Cc/Bcc for additional recipients
- Check "Scheduled send" for delayed sending
- Use keyboard shortcuts: c (compose), r (reply)
- Always verify recipient before sending
- Check spam folder for missing emails

## Safety Notes

- Confirm email content before sending
- Double-check recipient addresses
- Be cautious with attachments
- Never auto-reply without user confirmation
