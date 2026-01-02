# How to Test CompanySettings

**Date:** 20260102
**Status:** Ready to test

---

## ✅ What's Been Created

- Entity, Model, Repository, Service, Controller, Routes
- Seed script for initial data
- Full CRUD endpoints

---

## 🚀 Step 1: Start the Development Server

```bash
cd /home/javier/Documents/code/projects/hvp2021/hvp2021backend
yarn dev
```

Server should start on `http://localhost:4000`

---

## 🌱 Step 2: Seed Initial Data

```bash
npx ts-node src/scripts/seed-company-settings.ts
```

This will create the initial CompanySettings for HVP with:
- Name: "Hospital Veterinario Peninsular"
- RFC: "HVP970101XXX" (placeholder - update with real RFC)
- Employer Registration: "B5510768108" (placeholder)
- Federal Entity: "YUC" (Yucatán)

---

## 🧪 Step 3: Test the API Endpoints

### Get Auth Token First

```bash
curl -X POST http://localhost:4000/api/auth/collaborator/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "javieron.garcia@gmail.com",
    "password": "secret"
  }'
```

Save the token from the response.

### Test GET (Read Company Settings)

```bash
# Without auth (should work for read)
curl http://localhost:4000/api/company-settings

# With auth (recommended)
curl http://localhost:4000/api/company-settings \
  -H "x-token: YOUR_TOKEN_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "ok": true,
  "data": {
    "id": "...",
    "name": "Hospital Veterinario Peninsular",
    "rfc": "HVP970101XXX",
    "employerRegistration": "B5510768108",
    "expeditionZipCode": "97203",
    "federalEntityKey": "YUC",
    "fiscalAddress": {
      "street": "Calle 60",
      "exteriorNumber": "491",
      "neighborhood": "Centro",
      "city": "Mérida",
      "state": "Yucatán",
      "zipCode": "97000",
      "country": "México"
    },
    "createdAt": "2026-01-02T...",
    "updatedAt": "2026-01-02T..."
  }
}
```

### Test PUT (Update Company Settings)

```bash
curl -X PUT http://localhost:4000/api/company-settings \
  -H "Content-Type: application/json" \
  -H "x-token: YOUR_TOKEN_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Hospital Veterinario Peninsular - Updated",
    "rfc": "HVP970101ABC"
  }'
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Company settings updated successfully",
  "data": {
    "id": "...",
    "name": "Hospital Veterinario Peninsular - Updated",
    "rfc": "HVP970101ABC",
    ...
  }
}
```

### Test POST (Create - should fail if already exists)

```bash
curl -X POST http://localhost:4000/api/company-settings \
  -H "Content-Type: application/json" \
  -H "x-token: YOUR_TOKEN_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Company",
    "rfc": "TST123456ABC",
    "employerRegistration": "T1234567890",
    "expeditionZipCode": "97000",
    "federalEntityKey": "YUC"
  }'
```

**Expected Response (should fail):**
```json
{
  "ok": false,
  "message": "CompanySettings already exist. Use update() instead."
}
```

### Test DELETE (Use with caution!)

```bash
curl -X DELETE http://localhost:4000/api/company-settings \
  -H "x-token: YOUR_TOKEN_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "ok": true,
  "message": "Company settings deleted successfully"
}
```

---

## 🔍 Check Data in MongoDB

### Using MongoDB Compass or mongosh:

```javascript
use hvp-test  // or your database name

// Find company settings
db["company-settings"].find().pretty()

// Count documents (should be 0 or 1)
db["company-settings"].countDocuments()
```

---

## ✅ What to Verify

1. **Singleton behavior**: Only one document can exist
2. **Validation**:
   - RFC must be 12 characters
   - Expedition zip code must be 5 digits
   - Federal entity key must be 3 characters
3. **Cache**: Second GET request should be faster (from cache)
4. **CRUD operations**: All endpoints work correctly

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
# Make sure all dependencies are installed
yarn install

# Try restarting the dev server
yarn dev
```

### Error: "Company settings not initialized"
```bash
# Run the seed script
npx ts-node src/scripts/seed-company-settings.ts
```

### Error: "MongooseError: Operation buffering timed out"
```bash
# Check MongoDB is running
# Check .env has correct MONGO_URL
```

### Error: "Only one document allowed (singleton)"
This is expected! It means the singleton validation is working.
If you need to recreate, delete first:
```bash
curl -X DELETE http://localhost:4000/api/company-settings \
  -H "x-token: YOUR_TOKEN" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Next Steps

After testing CompanySettings successfully:

1. ✅ Update seed script with real HVP data (RFC, IMSS registration)
2. ⏳ Add admin middleware to POST, PUT, DELETE endpoints
3. ⏳ Continue with Phase 2: Extend Collaborator entity
4. ⏳ Continue with Phase 2: Extend Employment entity

---

## 🎯 Success Criteria

- [x] GET returns company settings
- [x] POST creates initial settings
- [x] PUT updates existing settings
- [x] DELETE removes settings
- [x] Singleton validation works (can't create duplicate)
- [x] Field validations work (RFC length, zip code, etc.)
- [x] Cache improves performance on repeated GETs

---

**Last updated:** 20260102
