# HVP2021 Backend - Project Context

## Project Overview
TypeScript/Node.js backend for Hospital Veterinario Peninsular (HVP) management system. Handles payroll, HR, attendance, inventory, and billing operations.

_Last updated: 2025-12-15_

## Tech Stack
- **Runtime:** Node.js 20+
- **Language:** TypeScript
- **Framework:** Express
- **Database:** MongoDB
- **Architecture:** Clean Architecture (Domain, Application, Infrastructure layers)

---

## API Configuration

### Environment URLs

**Local Development:**
- Base URL: `http://localhost:4000/api`
- Database: `mongodb://mongo-user:123456@localhost:27017/hvp-test`

**Production:**
- Base URL: `https://your-production-url.com/api`
- Database: MongoDB Atlas

### Authentication

All protected endpoints require authentication via JWT tokens.

**IMPORTANT: The token MUST be sent TWICE in every request:**
```bash
curl "http://localhost:4000/api/endpoint" \
  -H "x-token: <jwt-token>" \
  -H "Authorization: Bearer <jwt-token>"
```

Both headers are required:
1. `x-token: <token>` - Custom application header
2. `Authorization: Bearer <token>` - Standard HTTP auth header

**Getting a Token:**
```bash
curl -X POST http://localhost:4000/api/auth/collaborator/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "javieron.garcia@gmail.com",
    "password": "secret"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Token Expiration:**
- Tokens expire after 7 days
- Decode token to check expiration: `exp` field in JWT payload
- Refresh by logging in again

---

## Key API Endpoints

### Payroll & HR

**Employments:**
```bash
GET /api/employments?sort_by=employmentStartDate&direction=desc&isActive=true
```

**Payroll Estimates:**
```bash
GET /api/payrolls/estimates?periodStartDate=2024-12-01&periodEndDate=2024-12-15
```

**Payrolls:**
```bash
GET /api/payrolls?periodStartDate=2024-01-01&periodEndDate=2024-12-31
POST /api/payrolls
```

**Salary Data:**
```bash
GET /api/salary-data?year=2024
```

**Collaborators:**
```bash
GET /api/collaborators
GET /api/collaborators/:id
```

**Jobs:**
```bash
GET /api/jobs
```

### Attendance & Time Off

**Attendance Records:**
```bash
GET /api/attendance-records
POST /api/attendance-records
```

**Time Off Requests:**
```bash
GET /api/time-off-requests
POST /api/time-off-requests
```

### Other Resources

**Branches:** `GET /api/branches`
**Products:** `GET /api/products`
**Suppliers:** `GET /api/suppliers`
**Commissions:** `GET /api/commission-allocations`

---

## Development Scripts

### Database
```bash
yarn db:copy-prod          # Copy production DB to local development
```

### Build & Run
```bash
yarn dev                   # Start development server with hot reload
yarn build                 # Build TypeScript to dist/
yarn start                 # Run production build
```

### Testing
```bash
yarn test                  # Run tests
yarn test:watch            # Run tests in watch mode
yarn test:coverage         # Run tests with coverage
```

### Docker
```bash
yarn docker:dev            # Start development MongoDB
yarn docker:test           # Start test MongoDB
```

---

## Language Policy

**All generated content MUST be in English:**
- Code (variables, functions, comments)
- Commit messages
- Documentation files
- Branch names
- PR descriptions

**Exception:** Chat interactions with the user can be in Spanish if the user prefers.

---

## Git Workflow

### Branch Rules

**NEVER commit directly to `main`.**

```bash
# Always create a new branch for work
git checkout -b feature/descriptive-name

# After finishing, push to the branch
git push origin feature/descriptive-name

# Create PR to merge into main
```

### Branch Naming Convention

```
feature/sp2-cfdi-fields      # New functionality
fix/payroll-calculation      # Bug fix
refactor/cleanup-entities    # Refactor
docs/update-readme           # Documentation
```

### Commit Flow

```
1. Create branch from main
2. Make commits on the branch
3. Push to origin
4. Create PR
5. Review (if applicable)
6. Merge to main
7. Deploy to staging
8. Verify
9. Deploy to production
```

---

## Development Logging

HVP2021 includes two logging systems to help with debugging and development:

### API Logger

Captures all HTTP requests/responses to `logs/api/` for debugging and analysis.

**Enable**: Set `API_LOGGER_ENABLED=true` in `.env`

**What it captures**:
- Request: method, URL, headers, body, query params
- Response: status code, headers, body
- Timing: duration in milliseconds
- Security: Automatically redacts sensitive headers (`x-token`, `authorization`, `password` fields)

**Log location**: `logs/api/{timestamp}-{METHOD}-{endpoint}.json`

**Query logs**: Use `/logs` slash command for common queries:
```bash
# Show recent API requests
/logs

# Or query directly:
find logs/api -type f -name "*.json" | sort -r | head -10

# Find specific endpoint
find logs/api -type f -name "*api-employments*.json"

# Pretty-print a log file
cat logs/api/FILENAME.json | jq '.'
```

**Example log**:
```json
{
  "timestamp": "2025-12-14T10:30:45.123Z",
  "request": {
    "method": "GET",
    "url": "/api/employments?isActive=true",
    "query": {"isActive": "true"},
    "params": {},
    "headers": {"x-token": "[REDACTED]"},
    "body": null
  },
  "response": {
    "statusCode": 200,
    "headers": {"content-type": "application/json"},
    "body": {"ok": true, "data": [...]}
  },
  "timing": {
    "startedAt": "2025-12-14T10:30:45.100Z",
    "completedAt": "2025-12-14T10:30:45.123Z",
    "durationMs": 23
  }
}
```

### Debug Logger

Instrument functions to capture inputs/outputs for detailed debugging.

**Enable**: Set `DEBUG_LOGGER_ENABLED=true` in `.env`

**Usage in code**:
```typescript
import { debugLog } from '@/shared/utils/debugLogger';

function calculateAguinaldo(salary: number, startDate: Date) {
  // Log input
  debugLog('calculateAguinaldo', { salary, startDate }, 'input');

  // ... calculation logic ...
  const taxableAmount = /* calculation */;
  const exemptAmount = /* calculation */;

  // Log intermediate state
  debugLog('calculateAguinaldo', { taxableAmount, exemptAmount }, 'calculation');

  const result = taxableAmount + exemptAmount;

  // Log output
  debugLog('calculateAguinaldo', { result }, 'output');

  return result;
}
```

**Log location**: `logs/debug/{timestamp}-{functionName}-{context}.json`

**Query logs**:
```bash
# Find debug logs for specific function
find logs/debug -type f -name "*calculateAguinaldo*.json"

# Show recent debug logs
find logs/debug -type f | sort -r | head -10
```

**Decorator support** (optional):
```typescript
import { DebugLog } from '@/shared/utils/debugLogger';

class PayrollService {
  @DebugLog('payroll')
  calculatePayroll(employeeId: string): PayrollResult {
    // Automatically logs inputs and outputs
    return /* ... */;
  }
}
```

### Log Management

**Retention**: Logs are automatically deleted after 7 days (configurable via `LOG_RETENTION_DAYS`)

**Storage location**: `/logs` (gitignored)

**Production safety**: Both loggers are disabled by default. Must explicitly enable in `.env`.

**Configuration (.env)**:
```bash
# Logging Configuration
API_LOGGER_ENABLED=true          # Enable API request/response logging
DEBUG_LOGGER_ENABLED=true        # Enable function debug logging
LOG_RETENTION_DAYS=7            # Auto-delete logs older than N days
```

---

## Project Structure

```
src/
├── application/           # Application services, DTOs, factories
│   ├── services/         # Business logic services
│   ├── dtos/            # Data transfer objects
│   └── factories/       # Service factories
├── domain/               # Domain entities, value objects, interfaces
│   ├── entities/        # Business entities
│   ├── value-objects/   # Value objects
│   ├── enums/          # Enumerations
│   └── repositories/    # Repository interfaces
├── infrastructure/       # External concerns (DB, APIs)
│   ├── datasources/     # Data source implementations
│   ├── repositories/    # Repository implementations
│   └── db/mongo/        # MongoDB models
├── presentation/         # HTTP layer
│   ├── controllers/     # Request handlers
│   ├── routes/         # Route definitions
│   └── middlewares/    # Express middlewares
└── shared/              # Shared utilities and constants
```

---

## Important Business Context

### Payroll System
- **Payment Periods:** Bi-weekly (quincenas)
- **Payment Types:** Salary (fixed) and Hourly
- **Tax Calculations:** Mexican ISR (income tax) and IMSS (social security)
- **UMA Values:** Updated annually for tax-exempt calculations
- **CFDI Integration:** Working on Facturama integration for tax compliance

### Tax Exempt Limits (Mexican Law)
- **Aguinaldo (End-year bonus):** First 30 UMA days exempt
- **Prima Vacacional (Vacation bonus):** First 15 UMA days exempt
- **Overtime:** First 5 UMA exempt per period
- **Sunday Bonus:** First 1 UMA per Sunday exempt
- **PTU (Profit sharing):** First 15 UMA days exempt

### Current UMA Value (2024)
- Daily: $108.57 MXN
- Monthly: $3,300.53 MXN
- Annual: $39,606.36 MXN

---

## Common Development Workflows

### Testing API Changes
1. Start local server: `yarn dev`
2. Get fresh auth token (see Authentication section)
3. Make requests using curl or Postman
4. Validate responses match expected format

### Database Operations
1. Copy prod data: `yarn db:copy-prod`
2. Run migrations if needed
3. Verify data integrity
4. Test with local server

### Adding New Features
1. Create branch: `git checkout -b feature/feature-name`
2. Implement in layers: Domain → Application → Infrastructure → Presentation
3. Write tests
4. Validate with API calls
5. Create PR to main

---

## GitHub Issues & Projects

**Repository:** https://github.com/JavierGarciaGomez/hvp2021backend

**Active Issues:**
- #1: Implement aguinaldo calculation with tax split logic
- #2: Refactor payroll format to include taxed/exempt split

**Current Branch:** `feature/endbonus-calculation`

---

## Notes

- Always use TypeScript strict mode
- Follow clean architecture principles
- All monetary amounts in MXN (Mexican Pesos)
- Dates in ISO 8601 format
- All payroll calculations must comply with Mexican labor law

_Last auto-deploy test: 2026-01-01_
