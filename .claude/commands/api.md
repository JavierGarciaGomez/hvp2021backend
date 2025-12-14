---
description: Validate API endpoints with authenticated curl requests
allowed-tools: [Bash, Read, Write]
---

# API Testing & Validation

You are helping validate API endpoints for the HVP2021 backend.

## Quick Reference

**Base URL (Local):** `http://localhost:4000/api`

**Authentication Headers:**

```
x-token: <jwt-token>
Authorization: Bearer <jwt-token>
```

## Your Tasks

1. **Get Authentication Token** (automatically cached and reused):

```bash
TOKEN=$(./scripts/get-api-token.sh)
```

This script:
- Caches tokens in `.api-token` file (gitignored)
- Automatically checks if token is still valid (2-week expiration)
- Only requests a fresh token when current one expires
- Use `./scripts/get-api-token.sh --force` to force refresh
- Use `./scripts/get-api-token.sh --verbose` to see expiration info

2. **Test the Endpoint** being developed/debugged:

   - Use the token from step 1
   - Make the appropriate HTTP request (GET, POST, PUT, DELETE)
   - Include required headers: `x-token` and `Authorization: Bearer`
   - Pretty-print JSON response with `jq` if available

3. **Validate Response**:
   - Check HTTP status code
   - Verify response structure matches expected format
   - Check for required fields
   - Validate data types
   - Report any errors or inconsistencies

## Common Test Patterns

### GET Request

```bash
TOKEN="<jwt-token>"
curl -s http://localhost:4000/api/ENDPOINT \
  -H "x-token: $TOKEN" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'
```

### POST Request

```bash
TOKEN="<jwt-token>"
curl -s -X POST http://localhost:4000/api/ENDPOINT \
  -H "Content-Type: application/json" \
  -H "x-token: $TOKEN" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"key": "value"}' \
  | jq '.'
```

### With Query Parameters

```bash
TOKEN="<jwt-token>"
curl -s "http://localhost:4000/api/ENDPOINT?param1=value1&param2=value2" \
  -H "x-token: $TOKEN" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'
```

## Example Endpoints to Test

**Employments:**

```bash
curl -s "http://localhost:4000/api/employments?sort_by=employmentStartDate&direction=desc&isActive=true" \
  -H "x-token: $TOKEN" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

**Payroll Estimates:**

```bash
curl -s "http://localhost:4000/api/payrolls/estimates?periodStartDate=2024-12-01&periodEndDate=2024-12-15" \
  -H "x-token: $TOKEN" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

**Salary Data:**

```bash
curl -s "http://localhost:4000/api/salary-data?year=2024" \
  -H "x-token: $TOKEN" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

## Response Validation Checklist

- [ ] HTTP status code is 200/201/204 (or appropriate)
- [ ] Response has expected structure
- [ ] Required fields are present
- [ ] Data types match expectations
- [ ] Nested objects/arrays are correctly formatted
- [ ] Error responses have meaningful messages (if testing error cases)
- [ ] Authentication works correctly

## Notes

- Always use `jq` for pretty-printing JSON when available
- If jq is not available, use `| python -m json.tool` as fallback
- For debugging, add `-v` flag to curl to see full request/response
- Token expires after 7 days - get fresh one if requests fail with 401
