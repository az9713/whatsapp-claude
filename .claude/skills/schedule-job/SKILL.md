---
name: schedule-job
description: Schedule tasks using natural language time expressions. Use when asked to schedule a recurring or timed task.
disable-model-invocation: true
allowed-tools:
  - Bash
  - Write
---

# Schedule Job Skill

Schedule tasks using cron with natural language time parsing.

## Cron Format

```
* * * * * command
│ │ │ │ │
│ │ │ │ └─ day of week (0-7, 0 and 7 are Sunday)
│ │ │ └─── month (1-12)
│ │ └───── day of month (1-31)
│ └─────── hour (0-23)
└───────── minute (0-59)
```

## Natural Language to Cron

| Natural Language | Cron Expression |
|-----------------|-----------------|
| at 15:46 | 46 15 * * * |
| every morning at 9am | 0 9 * * * |
| every monday at 8am | 0 8 * * 1 |
| every night at midnight | 0 0 * * * |
| every hour | 0 * * * * |
| every 30 minutes | */30 * * * * |
| every weekday at 6pm | 0 18 * * 1-5 |
| every sunday at noon | 0 12 * * 0 |
| first of every month at 9am | 0 9 1 * * |
| every 2 hours from 9am-9pm | 0 9-21/2 * * * |

## Create Cron Entry

### Basic Job

```bash
(crontab -l 2>/dev/null; echo "46 15 * * * cd $WORKSPACE && claude -p \"your task here\" --dangerously-skip-permissions >> /var/log/agent.log 2>&1") | crontab -
```

### With Full Path

```bash
WORKSPACE="/path/to/whatsapp-claude"
(crontab -l 2>/dev/null; echo "0 9 * * * cd $WORKSPACE && claude -p \"check hacker news\" --dangerously-skip-permissions >> /var/log/agent.log 2>&1") | crontab -
```

## List Current Jobs

```bash
crontab -l
```

## Remove a Job

```bash
# Edit crontab interactively
crontab -e

# Or remove all jobs
crontab -r
```

## Remove Specific Job

```bash
# Remove job containing specific text
crontab -l | grep -v "specific text" | crontab -
```

## Example Scheduled Tasks

### Daily AI News Video (8am)

```bash
(crontab -l 2>/dev/null; echo "0 8 * * * cd /path/to/whatsapp-claude && claude -p \"research trending AI on X, create video, upload to YouTube\" --dangerously-skip-permissions >> /var/log/agent.log 2>&1") | crontab -
```

### Weekly GitHub Recap (Sunday 6pm)

```bash
(crontab -l 2>/dev/null; echo "0 18 * * 0 cd /path/to/whatsapp-claude && claude -p \"create github recap video for this week\" --dangerously-skip-permissions >> /var/log/agent.log 2>&1") | crontab -
```

### Hourly X Engagement (9am-9pm)

```bash
(crontab -l 2>/dev/null; echo "0 */2 9-21 * * cd /path/to/whatsapp-claude && claude -p \"check X mentions, reply to interesting ones\" --dangerously-skip-permissions >> /var/log/agent.log 2>&1") | crontab -
```

## Log Rotation

Create `/etc/logrotate.d/agent`:

```
/var/log/agent.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
}
```

## Tips

- Always use absolute paths in cron
- Redirect output to log file for debugging
- Use `2>&1` to capture both stdout and stderr
- Test commands manually before scheduling
- Check cron daemon is running: `service cron status`
- View cron logs: `grep CRON /var/log/syslog`

## Windows Alternative (Task Scheduler)

On Windows, use Task Scheduler instead:

```powershell
# Create scheduled task
schtasks /create /tn "ClaudeTask" /tr "cd C:\path\to\whatsapp-claude && claude -p 'task'" /sc daily /st 09:00
```
