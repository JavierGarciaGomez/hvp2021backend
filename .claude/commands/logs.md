---
description: Query and analyze API and debug logs
allowed-tools: [Bash, Read]
---

# Log Query and Analysis

Query development logs created by the API Logger and Debug Logger systems.

## Log Locations

- **API Logs**: `logs/api/` - HTTP request/response pairs
- **Debug Logs**: `logs/debug/` - Function inputs/outputs

## Common Commands

### View Recent API Logs

Show the 10 most recent API requests:

```bash
find logs/api -type f -name "*.json" 2>/dev/null | sort -r | head -10 | while read file; do
  echo "=== $(basename $file) ==="
  cat "$file" | jq -r '.request.method + " " + .request.url + " -> " + (.response.statusCode|tostring) + " (" + (.timing.durationMs|tostring) + "ms")'
  echo ""
done
```

### Find Specific API Endpoint

Find all calls to a specific endpoint (e.g., `/api/employments`):

```bash
find logs/api -type f -name "*api-employments*.json" 2>/dev/null | sort -r | head -5 | while read file; do
  echo "=== $(basename $file) ==="
  cat "$file" | jq '.'
  echo ""
done
```

### Find API Logs by HTTP Method

Find all POST requests:

```bash
find logs/api -type f -name "*-POST-*.json" 2>/dev/null | sort -r | head -10
```

Find all GET requests:

```bash
find logs/api -type f -name "*-GET-*.json" 2>/dev/null | sort -r | head -10
```

### View Full API Log Details

Read a specific log file with pretty-printed JSON:

```bash
cat logs/api/FILENAME.json | jq '.'
```

### Analyze API Performance

Show slowest API requests (> 100ms):

```bash
find logs/api -type f -name "*.json" 2>/dev/null | while read file; do
  duration=$(cat "$file" | jq -r '.timing.durationMs // 0')
  if [ "$duration" -gt 100 ]; then
    echo "$duration ms - $(basename $file)"
  fi
done | sort -rn | head -10
```

### View Recent Debug Logs

Show the 10 most recent debug logs:

```bash
find logs/debug -type f -name "*.json" 2>/dev/null | sort -r | head -10 | while read file; do
  echo "=== $(basename $file) ==="
  cat "$file" | jq -r '.functionName + " [" + .context + "]"'
  echo ""
done
```

### Find Debug Logs by Function Name

Find all debug logs for a specific function (e.g., `calculateAguinaldo`):

```bash
find logs/debug -type f -name "*calculateAguinaldo*.json" 2>/dev/null | sort -r | while read file; do
  echo "=== $(basename $file) ==="
  cat "$file" | jq '.'
  echo ""
done
```

### View Debug Log Details

Read a specific debug log:

```bash
cat logs/debug/FILENAME.json | jq '.'
```

### Search Logs by Content

Search for specific content in API logs (e.g., find logs with specific query params):

```bash
grep -r "isActive.*true" logs/api/ 2>/dev/null | cut -d: -f1 | sort -u | while read file; do
  echo "=== $(basename $file) ==="
  cat "$file" | jq '.request.query'
  echo ""
done
```

### Search for Errors

Find API responses with error status codes (4xx, 5xx):

```bash
find logs/api -type f -name "*.json" 2>/dev/null | while read file; do
  status=$(cat "$file" | jq -r '.response.statusCode // 0')
  if [ "$status" -ge 400 ]; then
    echo "=== $status - $(basename $file) ==="
    cat "$file" | jq '{method: .request.method, url: .request.url, status: .response.statusCode, error: .response.body.error}'
    echo ""
  fi
done
```

### Count Logs by Date

Count API logs per day:

```bash
find logs/api -type f -name "*.json" 2>/dev/null | while read file; do
  date=$(basename "$file" | cut -d'T' -f1)
  echo "$date"
done | sort | uniq -c
```

### Manual Cleanup

Delete logs older than 7 days (API logs):

```bash
find logs/api -type f -name "*.json" -mtime +7 -delete 2>/dev/null
```

Delete logs older than 7 days (Debug logs):

```bash
find logs/debug -type f -name "*.json" -mtime +7 -delete 2>/dev/null
```

## Log File Naming Convention

### API Logs
Format: `{timestamp}-{METHOD}-{sanitized-url}.json`

Example: `2025-12-14T10-30-45-123Z-GET-api-employments.json`

### Debug Logs
Format: `{timestamp}-{functionName}-{context}.json`

Example: `2025-12-14T10-30-50-789Z-calculateAguinaldo-input.json`

## Tips

1. **Use `jq` for JSON parsing**: All logs are in JSON format, use `jq` for filtering and formatting
2. **Combine with grep**: Use `grep -r "search-term" logs/api/` to find specific content
3. **Check file count**: Use `find logs/api -type f | wc -l` to see total number of logs
4. **Tail logs**: For real-time monitoring, use `watch` with find commands
5. **Check if logging is enabled**: Look at `.env` for `API_LOGGER_ENABLED` and `DEBUG_LOGGER_ENABLED`

## Troubleshooting

### No logs directory

If logs directory doesn't exist, logging might be disabled or server hasn't been started yet.

Check `.env` file:
```bash
grep -E "LOGGER_ENABLED|LOG_RETENTION" .env 2>/dev/null || echo "Logging variables not set in .env"
```

### Logs not being created

1. Check if logging is enabled in `.env`:
   - `API_LOGGER_ENABLED=true`
   - `DEBUG_LOGGER_ENABLED=true`
2. Verify server is running
3. Make API requests to generate logs
4. Check server console for errors

### Too many logs

Logs are automatically cleaned up after 7 days (configurable via `LOG_RETENTION_DAYS`).
To manually clean up, use the manual cleanup commands above.
