---
name: x-research
description: Research topics on X by gathering and analyzing multiple posts. Use when asked to research something on Twitter/X.
allowed-tools:
  - mcp__claude-in-chrome__*
  - Read
  - Write
---

# X Research Skill

Conduct thorough research on X (Twitter) by gathering and synthesizing multiple posts.

## Research Process

### 1. Define Research Scope

- Identify the topic or question to research
- Determine relevant keywords, hashtags, and accounts
- Set a target number of posts to analyze (5-10 minimum)

### 2. Gather Posts

Use x-navigation patterns to:

1. Navigate to X.com
2. Search for the topic using relevant keywords
3. For each search result page:
   - Use `read_page` to extract tweet content
   - Note: author, date, engagement, content
   - Scroll to load more posts
4. Visit key accounts discussing the topic
5. Check trending hashtags related to topic

### 3. Extract Key Information

For each relevant post, capture:

- **Author**: Username, verified status, follower count
- **Content**: Full text of the tweet
- **Engagement**: Likes, retweets, replies, quotes
- **Timestamp**: When it was posted
- **Media**: Any images, videos, or links
- **Thread**: If part of a thread, gather all parts

### 4. Synthesize Findings

Create a structured research report:

```markdown
# Research: [Topic]

## Summary
[2-3 sentence overview of findings]

## Key Insights
- [Insight 1]
- [Insight 2]
- [Insight 3]

## Notable Posts
1. @user1: "[quote]" (X likes, Y retweets)
2. @user2: "[quote]" (X likes, Y retweets)

## Sentiment Analysis
[Overall tone: positive/negative/mixed]

## Trends
[Emerging patterns or recurring themes]
```

### 5. Save Research

Save the research report to:
```
output/research/[topic]-[date].md
```

## Tips

- Cross-reference claims with multiple sources
- Note disagreements or controversies
- Identify influential voices on the topic
- Look for primary sources when possible
