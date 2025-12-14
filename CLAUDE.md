# HVP2021 Backend - Project Context

## Project Overview
TypeScript/Node.js backend for Hospital Veterinario Peninsular (HVP) management system. Handles payroll, HR, attendance, inventory, and billing operations.

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

**Required Headers:**
```
x-token: <jwt-token>
Authorization: Bearer <jwt-token>
```

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
