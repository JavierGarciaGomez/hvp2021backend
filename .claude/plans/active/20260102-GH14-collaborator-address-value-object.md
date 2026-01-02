---
title: "Refactor collaborator address to use Address value object"
issue: "https://github.com/JavierGarciaGomez/hvp2021backend/issues/14"
created: "2026-01-02"
status: "active"
type: "plan"
assignee: "Backend Team"
priority: "medium"
estimated_hours: 4
tags: ["refactor", "domain", "value-object", "collaborator"]
---

# Refactor Collaborator Address to Address Value Object

> **GitHub Issue:** [GH14 - Refactor collaborator address to use Address value object](https://github.com/JavierGarciaGomez/hvp2021backend/issues/14)
> **Created:** 2026-01-02
> **Status:** Active

---

## Objective

**What:** Migrate collaborator address fields from primitive types (street, city, state, zipCode, country) to a proper `Address` value object in the domain layer, following DDD principles and Clean Architecture patterns.

**Why:**
- **Better encapsulation:** Address validation and business rules centralized
- **Reusability:** Address can be used across other entities (Suppliers, Branches, etc.)
- **Domain purity:** Follows Clean Architecture - domain entities use value objects, not primitives
- **Maintainability:** Changes to address structure only affect one place

---

## Scope

### In Scope
- Create `Address` value object in domain layer (`src/domain/value-objects/`)
- Update `Collaborator` entity to use `Address` value object
- Update MongoDB model to handle Address properly
- Update DTOs to map Address correctly
- Update repositories and data sources
- Add unit tests for Address value object
- Update existing collaborator tests

### Out of Scope
- Migrating existing database records (can be done manually or in separate migration script)
- Adding address to other entities (Suppliers, Branches) - future enhancement
- Address validation with external APIs (e.g., Google Places)
- International address formats (focus on Mexican addresses first)

---

## Current State Analysis

### Existing Implementation

**Good news:** The `Address` value object class already exists and is well-implemented!

**Location:** `src/domain/value-objects/address.vo.ts`

**Current structure:**
- ✅ `Address` class (lines 41-237) - Full value object with:
  - Validation (Mexican + International formats)
  - Immutability (`Object.freeze`)
  - Methods: `getFullAddress()`, `getForCFDI()`, `equals()`, `toObject()`
  - CFDI compliance support

- ⚠️ `AddressVO` interface (line 266) - **Deprecated** legacy interface
  - Just an alias for `AddressProps`
  - Marked as `@deprecated`
  - Still used by `CollaboratorEntity`

**Current Collaborator usage:**
```typescript
// src/domain/entities/collaborator.entity.ts:27
export interface CollaboratorProps extends BaseEntityProps {
  // ...
  address?: AddressVO;  // ❌ Using deprecated interface
  // ...
}

// src/domain/entities/collaborator.entity.ts:98
export class CollaboratorEntity implements BaseEntity {
  address?: AddressVO;  // ❌ Using deprecated interface
  // ...
}
```

### Problems

1. **Using deprecated interface:** Collaborator uses `AddressVO` interface instead of `Address` class
2. **No validation:** Interface has no validation - accepts any data
3. **No value object benefits:** Missing immutability, methods (getFullAddress, getForCFDI, equals)
4. **Inconsistent with domain principles:** Value objects should be classes, not interfaces
5. **Technical debt:** Deprecated code still in use

### Root Cause

Address was recently refactored into a proper value object class, but Collaborator entity wasn't migrated yet. The old interface was kept for backward compatibility but marked as deprecated.

---

## Proposed Solution

### Approach

**Strategy:** Migrate Collaborator from `AddressVO` interface to `Address` value object class.

**What will change:**
1. **Domain layer:** Update `CollaboratorEntity` and `CollaboratorProps` to use `Address` class
2. **Application layer:** Update DTOs and factories to construct `Address` instances
3. **Infrastructure layer:** Ensure MongoDB model properly serializes/deserializes `Address`
4. **Remove deprecated code:** Delete `AddressVO` interface after migration complete

**Key points:**
- Use `Address.fromObject()` when constructing from raw data
- Use `address.toObject()` when serializing for DB/API
- Leverage `Address` methods: `getFullAddress()`, `getForCFDI()` where applicable

### Alternatives Considered

| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| **1. Migrate to Address class** | - Proper value object<br>- Validation included<br>- Reusable methods<br>- Immutable | - Need to update all usages<br>- Requires testing | ✅ **Selected** |
| **2. Keep AddressVO interface** | - No changes needed<br>- Works currently | - No validation<br>- No domain logic<br>- Technical debt<br>- Against DDD | ❌ Rejected |
| **3. Create new interface extending Address** | - Gradual migration | - More complexity<br>- Still tech debt | ❌ Rejected |

### Design Decisions

**Decision 1: Use Address class directly (not wrapped in interface)**
- **Context:** Need to decide if Collaborator should use `Address` class directly or wrap it in an interface
- **Choice:** Use `Address` class directly: `address?: Address`
- **Rationale:** Value objects should be used as classes to get validation and methods
- **Consequences:** Full access to Address methods like `getFullAddress()`, `getForCFDI()`

**Decision 2: Keep backward compatibility in MongoDB**
- **Context:** Existing collaborator documents in DB have address as plain object
- **Choice:** Use `Address.fromObject()` when reading, `address.toObject()` when writing
- **Rationale:** No database migration needed, seamless conversion
- **Consequences:** MongoDB schema stays the same, only application code changes

---

## Implementation Steps

### Step 1: Update Domain Layer - Collaborator Entity

Update `CollaboratorEntity` to use `Address` class instead of `AddressVO` interface.

**File:** `src/domain/entities/collaborator.entity.ts`

**Actions:**
1. Change `address?: AddressVO` to `address?: Address` in:
   - `CollaboratorProps` interface (line 27)
   - `CollaboratorEntity` class (line 98)
   - `CollaboratorDocument` interface (verify it's correctly typed)

2. Update `fromDocument()` method to construct Address from plain object:
   ```typescript
   address: document.address ? Address.fromObject(document.address) : undefined
   ```

3. Verify imports: `import { Address } from '../value-objects'`

**Verification:**
- TypeScript compiles without errors
- No references to `AddressVO` in collaborator.entity.ts

---

### Step 2: Update Infrastructure Layer - MongoDB Model

Ensure MongoDB model correctly serializes/deserializes Address.

**File:** `src/infrastructure/db/mongo/models/collaborator.model.ts`

**Actions:**
1. Verify address schema uses `AddressSchema` from value-objects
2. Ensure address field is optional and properly typed
3. Check that no custom getters/setters interfere with Address

**Verification:**
- MongoDB model compiles
- Address schema matches `AddressSchema` from value-objects

---

### Step 3: Update Infrastructure - Datasource Implementation

Update datasource to handle Address value object.

**File:** `src/infrastructure/datasources/collaborator.datasource.mongo-imp.ts`

**Actions:**
1. When creating/updating collaborator with address, serialize with `address.toObject()`
2. Verify Address is properly passed through to MongoDB
3. Handle cases where address is undefined

**Verification:**
- Can create collaborator with Address
- Can update collaborator address
- Address persists correctly to MongoDB

---

### Step 4: Update Application Layer - DTOs

Update DTOs to work with Address class.

**File:** `src/application/dtos/collaborator.dto.ts`

**Actions:**
1. Check if DTO needs Address or just plain object
2. If exporting to API, use `address?.toObject()` or `address?.getFullAddress()`
3. Update any address-related fields in DTO

**Verification:**
- DTO correctly exports address data
- API responses include proper address format

---

### Step 5: Update Application Layer - Factory

Update factory to construct Address from raw data.

**File:** `src/application/factories/collaborator.factory.ts`

**Actions:**
1. When building CollaboratorEntity from raw data, construct Address:
   ```typescript
   address: data.address ? Address.fromObject(data.address) : undefined
   ```
2. Handle validation errors from Address constructor
3. Update any other factories that create collaborators

**Verification:**
- Factory correctly creates CollaboratorEntity with Address
- Invalid addresses throw validation errors

---

### Step 6: Update Tests

Add/update tests for Address usage in Collaborator.

**Actions:**
1. Test creating CollaboratorEntity with valid Address
2. Test Address validation (invalid data should throw error)
3. Test serialization: `address.toObject()` for DB
4. Test methods: `address.getFullAddress()`, `address.getForCFDI()`
5. Update existing collaborator tests if needed

**Verification:**
- All tests pass
- Address validation is tested
- Edge cases covered (no address, invalid address, etc.)

---

### Step 7: Remove Deprecated Code

Remove the deprecated `AddressVO` interface.

**File:** `src/domain/value-objects/address.vo.ts`

**Actions:**
1. Verify no code references `AddressVO` (search codebase)
2. Remove lines 262-266 (deprecated interface)
3. Update exports in `src/domain/value-objects/index.ts` if needed

**Verification:**
- No references to `AddressVO` exist
- All tests still pass
- TypeScript compiles without errors

---

### Step 8: Manual Testing

Test with real data in development environment.

**Actions:**
1. Start dev server: `yarn dev`
2. Test GET collaborator with address - verify response
3. Test POST/PUT collaborator with address data
4. Test invalid address (should return validation error)
5. Verify address displays correctly in API responses

**Verification:**
- Can fetch collaborators with addresses
- Can create/update collaborators with valid addresses
- Invalid addresses are rejected with clear error messages
- Address data structure matches expectations

---

### Step 4: [Step Title]
[Description]

**Actions:**
- Action 1
- Action 2

**Verification:** [How to verify]

---

### Step 5: [Step Title] → **SEE SUBPLAN SP2**

📋 **Subplan:** [SP2-descriptive-name](./YYYYMMDD-GH<N>-SP2-descriptive-name.md)

**Why subplan needed:** [Explain complexity]

**Subplan scope:**
- [High-level task 1]
- [High-level task 2]

**Continue here after SP2 is completed:**
[Next steps after subplan]

---

### Step 6: [Final Steps]
[Description]

**Actions:**
- Deploy to staging
- Run validation
- Deploy to production
- Monitor

---

## Files to Modify

### Create New
- `path/to/new/file1.ts` - [Purpose]
- `path/to/new/file2.ts` - [Purpose]
- `path/to/new/file3.test.ts` - [Purpose]

### Modify Existing
- `path/to/existing/file1.ts` - [What changes]
- `path/to/existing/file2.ts` - [What changes]
- `path/to/existing/file3.ts` - [What changes]

### Delete (if applicable)
- `path/to/deprecated/file.ts` - [Why removing]

### Documentation
- `README.md` - [What section to update]
- `docs/SPECIFIC-DOC.md` - [What to add/change]

---

## Testing Strategy

### Unit Tests

**New Tests:**
- `path/to/test1.test.ts`
  - Test case: [Scenario to test]
  - Test case: [Scenario to test]

- `path/to/test2.test.ts`
  - Test case: [Scenario to test]

**Modified Tests:**
- `path/to/existing-test.test.ts`
  - Update: [What needs to change]

### Integration Tests

**Test Scenarios:**
1. **Scenario 1: [Name]**
   - Setup: [Initial conditions]
   - Action: [What to do]
   - Expected: [Expected outcome]

2. **Scenario 2: [Name]**
   - Setup: [Initial conditions]
   - Action: [What to do]
   - Expected: [Expected outcome]

### Manual Testing

**Test Cases:**
1. [Step-by-step manual test procedure]
2. [Step-by-step manual test procedure]

**Postman Collection:** [Link or name of collection to use]

### Edge Cases to Test

- [ ] Edge case 1: [Description]
- [ ] Edge case 2: [Description]
- [ ] Edge case 3: [Description]

### Validation Queries

```javascript
// [Description of what this validates]
db.collection.aggregate([
  // query
])
```

```bash
# [Description of what this validates]
curl -X GET "http://localhost:4000/api/endpoint" \
  -H "x-token: $TOKEN" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Risks and Mitigation

### Technical Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| [Risk description] | High/Medium/Low | High/Medium/Low | [How to prevent or handle] |
| [Risk description] | High/Medium/Low | High/Medium/Low | [How to prevent or handle] |

### Business Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| [Risk description] | High/Medium/Low | High/Medium/Low | [How to prevent or handle] |
| [Risk description] | High/Medium/Low | High/Medium/Low | [How to prevent or handle] |

### Security Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| [Risk description] | High/Medium/Low | High/Medium/Low | [How to prevent or handle] |

---

## Dependencies

### Blocked By
- [List any work that must be completed before this can start]
- [Issue GH<X>: Title]

[If none, write: "None - can start immediately"]

### Blocks
- [List work that cannot proceed until this is complete]
- [Issue GH<Y>: Title]

[If none, write: "No known blockers"]

### Related Work
- [List related issues or plans that aren't strict dependencies]
- [Issue GH<Z>: Title]

---

## Success Criteria

### Functional Requirements
- [ ] Requirement 1: [Specific, measurable outcome]
- [ ] Requirement 2: [Specific, measurable outcome]
- [ ] Requirement 3: [Specific, measurable outcome]

### Non-Functional Requirements
- [ ] Performance: [Specific metric, e.g., "< 100ms response time"]
- [ ] Security: [Specific requirement]
- [ ] Maintainability: [Specific requirement]

### Quality Gates
- [ ] All unit tests pass (coverage ≥ 80%)
- [ ] All integration tests pass
- [ ] Code review approved
- [ ] No linter/type errors
- [ ] Documentation updated

### Validation
- [ ] Tested in staging environment
- [ ] Manual testing completed with [N] scenarios
- [ ] Peer review completed
- [ ] Product owner approval (if needed)

---

## Implementation Checklist

[This section will be managed by Claude using the TodoWrite tool during implementation]

### Master Plan TODOs:
- [ ] Step 1: [High-level task]
- [ ] Step 2: Complete subplan SP1
- [ ] Step 3: [High-level task]
- [ ] Step 4: [High-level task]
- [ ] Step 5: Complete subplan SP2
- [ ] Step 6: [High-level task]
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Validated in staging
- [ ] Deployed to production
- [ ] Plan marked as completed and moved to `.claude/plans/completed/YYYY/`

---

## Notes and Learnings

[Document important discoveries, decisions made during implementation, or lessons learned]

### Discoveries During Implementation
- [Date] - [What was discovered]
- [Date] - [What changed from the original plan]

### Decisions Made
- [Date] - [Decision made and why]

### Lessons Learned
- [What went well]
- [What could be improved]
- [Recommendations for future similar work]

---

## Timeline (Optional)

[If there are external deadlines or milestones]

| Milestone | Target Date | Status | Notes |
|-----------|-------------|--------|-------|
| [Milestone 1] | YYYY-MM-DD | Pending | [Notes] |
| [Milestone 2] | YYYY-MM-DD | Pending | [Notes] |

---

## References

### Documentation
- [Link to relevant documentation]
- [Link to API docs]
- [Link to architectural decision records]

### Related Issues
- Issue GH<X>: [Title and URL]
- Issue GH<Y>: [Title and URL]

### External Resources
- [Link to third-party documentation]
- [Link to StackOverflow discussion]
- [Link to relevant article or paper]

---

**Plan Status:** Active
**Last Updated:** YYYY-MM-DD
**Next Review:** [Date when plan should be reviewed]
