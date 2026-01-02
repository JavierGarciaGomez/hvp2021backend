# Planning Mode Rules - HVP2021 Backend

## Overview

These rules govern how plans are created, organized, tracked, and executed in this project. All plans MUST follow these conventions to ensure consistency, traceability, and successful implementation.

---

## 1. Plan File Naming Convention

**Format:** `YYYYMMDD-GH<number>-<descriptive-name>.md`

### Rules:
- **Date prefix:** Always start with today's date in `YYYYMMDD` format (e.g., `20260102`)
- **Issue number:** Include GitHub issue number with `GH` prefix (e.g., `GH231`)
- **Descriptive name:** Short, kebab-case description (3-5 words max)
- **Language:** English only
- **Extension:** Always `.md`

### Examples:
```
✅ CORRECT:
20260102-GH15-payroll-tax-calculation-refactor.md
20260103-GH23-add-overtime-validation.md
20260104-GH231-timezone-fix-aguinaldo.md

❌ INCORRECT:
plan.md                                    (no date, no issue)
2026-01-02-payroll-fix.md                 (wrong date format)
20260102-payroll-calculation.md           (no issue number)
20260102-15-payroll-fix.md                (missing 'GH' prefix)
20260102-gh-15-payroll-fix.md             (lowercase 'gh')
20260102-GH15-PayrollFix.md               (not kebab-case)
```

---

## 2. Plan Storage Location

### Directory Structure:
```
.claude/
├── plans/
│   ├── active/                       # Currently being worked on
│   │   ├── 20260102-GH15-main-plan.md
│   │   └── 20260102-GH15-SP1-subplan.md
│   ├── completed/                    # Successfully implemented
│   │   └── 2025/
│   │       ├── 20251215-GH10-auth-fix.md
│   │       └── 20251220-GH12-api-logger.md
│   └── archived/                     # Abandoned or superseded
│       └── 20251201-GH8-old-approach.md
└── templates/                        # Plan templates
    ├── plan-master.md
    └── plan-subplan.md
```

### Storage Rules:
1. **New plans:** Always create in `.claude/plans/active/`
2. **Completed plans:** Move to `.claude/plans/completed/{YEAR}/` when done
3. **Abandoned plans:** Move to `.claude/plans/archived/` if cancelled/superseded
4. **Templates:** Located in `.claude/templates/` directory
5. **Subplans:** Store in `.claude/plans/active/` alongside master plan

### Automation:
```bash
# When plan is completed
mv .claude/plans/active/20260102-GH15-plan.md .claude/plans/completed/2026/

# When plan is abandoned
mv .claude/plans/active/20260102-GH15-plan.md .claude/plans/archived/
```

---

## 3. Subplan Management

### What is a Subplan?
A subplan is a detailed implementation plan for a specific component/layer/concern of a larger master plan.

### When to Create a Subplan:

Create a subplan if ANY of these conditions are met:

1. **Complexity:** The task requires >5 distinct implementation steps
2. **Domain separation:** Different architectural layers (e.g., domain vs infrastructure)
3. **Team distribution:** Different team members will work on different parts
4. **Risk isolation:** High-risk component needs separate analysis
5. **External dependencies:** Requires third-party integration or external API
6. **Technical spike:** Needs research/proof-of-concept before implementation
7. **Size threshold:** Estimated >3 hours of implementation time

### Subplan Naming Convention:

**Format:** `YYYYMMDD-GH<number>-SP<N>-<specific-focus>.md`

- Use `SP1`, `SP2`, `SP3` suffix for subplan numbering (uppercase)
- Date should match the master plan's date
- Issue number must match master plan
- Subplans stored in `.claude/plans/active/` alongside master plan

### Examples:
```
Master Plan:
20260102-GH15-payroll-tax-refactor.md

Subplans (in same directory):
20260102-GH15-SP1-domain-layer-entities.md
20260102-GH15-SP2-tax-calculation-service.md
20260102-GH15-SP3-api-endpoints.md
20260102-GH15-SP4-integration-tests.md
```

### Linking Master Plan to Subplans:

**IMPORTANT:** Subplans should be **integrated into the Implementation Steps** section, NOT in a separate section. This maintains the natural flow of the plan.

**Example - Integration in Implementation Steps:**
```markdown
## Implementation Steps

### Step 1: Setup Configuration
- Update environment variables
- Configure UMA values for 2024
- Setup test fixtures

[No subplan needed - straightforward]

### Step 2: Implement Domain Layer → **SEE SUBPLAN SP1**

📋 **Subplan:** [SP1-domain-layer](./20260102-GH15-SP1-domain-layer.md)

**Why subplan needed:** Complex entity relationships with multiple value objects and domain services require separate detailed analysis

**Subplan scope:**
- Create `TaxSplit` value object
- Update `Payroll` entity
- Implement `PayrollCalculation` domain service
- Unit tests for all domain logic

**Continue here after SP1 is completed:**
Verify domain layer tests pass before proceeding to application layer.

### Step 3: Update Application Services
- Modify `PayrollCalculationService` to use new domain logic
- Update DTOs to include taxable/exempt split
- Add service layer tests

[No subplan needed - follows from domain implementation]

### Step 4: Update API Controllers
- Modify response format
- Update API documentation
- Add integration tests

[No subplan needed - standard controller updates]

### Step 5: Comprehensive Integration Testing → **SEE SUBPLAN SP2**

📋 **Subplan:** [SP2-integration-tests](./20260102-GH15-SP2-integration-tests.md)

**Why subplan needed:** Multiple integration scenarios with edge cases require detailed test planning and data fixtures

**Subplan scope:**
- E2E test scenarios (below limit, at limit, above limit)
- Data fixtures for various employee types
- Mock configurations for external services
- Performance testing

**Continue here after SP2 is completed:**
Deploy to staging and run validation suite.

### Step 6: Deployment
- Deploy to staging
- Run validation queries
- Deploy to production
- Monitor for errors
```

**In Each Subplan:**
Subplans must reference their parent plan:

```markdown
## Master Plan Reference

🔗 **Parent Plan:** [20260102-GH15-payroll-tax-refactor.md](./20260102-GH15-payroll-tax-refactor.md)
🔗 **GitHub Issue:** [GH15 - Refactor Payroll Tax Calculation](https://github.com/user/repo/issues/15)

**Integration Point:** This subplan implements Step 2 of the master plan.

**Dependencies:**
- **Blocks:** Step 3 (Application Services) cannot proceed until this is complete
- **Blocked by:** Step 1 (Setup Configuration) must be completed first
- **Related:** None
```

### Subplan Summary Table (Optional):

If you have many subplans, you can add a summary table at the top of the plan (after Objective):

```markdown
## Subplan Overview

| Step | Subplan | Status | Dependencies |
|------|---------|--------|--------------|
| Step 2 | [SP1-domain-layer](./20260102-GH15-SP1-domain-layer.md) | Active | Step 1 |
| Step 5 | [SP2-integration-tests](./20260102-GH15-SP2-integration-tests.md) | Pending | SP1, Step 4 |
```

---

## 4. TODO Tracking - CRITICAL

### Master Rule:
**EVERY plan and subplan MUST use the TodoWrite tool to track implementation progress.**

### TODO Management Requirements:

1. **At Plan Creation:**
   - Create TODO list with ALL implementation steps
   - Each step must be actionable and specific
   - Use imperative form: "Create X", "Implement Y", "Test Z"

2. **During Implementation:**
   - Mark tasks as `in_progress` BEFORE starting work
   - Mark as `completed` IMMEDIATELY after finishing
   - Add new TODOs if discovered during implementation
   - NEVER batch completions - update in real-time

3. **Subplan TODOs:**
   - Each subplan has its OWN TODO list
   - Master plan tracks subplan completion, not individual tasks
   - Reference subplan status in master plan TODOs

### Example Master Plan TODOs:
```markdown
## Implementation Checklist

- [ ] Complete SP1: Domain Layer Entities
- [ ] Complete SP2: Tax Calculation Service
- [ ] Complete SP3: API Endpoints
- [ ] Complete SP4: Integration Tests
- [ ] Update documentation
- [ ] Review with team
- [ ] Deploy to staging
- [ ] Verify in production
```

### Example Subplan TODOs:
```markdown
## SP1 Implementation Checklist

- [ ] Create Payroll entity
- [ ] Create TaxCalculation value object
- [ ] Add ISR calculation logic
- [ ] Add IMSS calculation logic
- [ ] Add aguinaldo tax split logic
- [ ] Write unit tests for entities
- [ ] Update domain interfaces
```

### Enforcement:
- Claude MUST use `TodoWrite` tool when executing plans
- Exit plan mode only when ALL TODOs are completed or explicitly deferred
- Document any incomplete TODOs in plan notes

---

## 5. Plan Language and Style

### Language:
- **English only** for all plans
- Technical terms may use Spanish when referring to Mexican legal concepts (e.g., "aguinaldo", "prima vacacional", "ISR", "IMSS")
- Comments and documentation within code can be in Spanish

### Writing Style:
- **Clear and concise:** No unnecessary verbosity
- **Actionable:** Every section should lead to concrete actions
- **Structured:** Use consistent headings and formatting
- **Technical:** Include code examples, file paths, and specific APIs

### Tone:
- Professional and objective
- No marketing language or hype
- Focus on facts, risks, and trade-offs

---

## 6. GitHub Issue Integration

### Required:
- **Every plan MUST be linked to a GitHub issue**
- Include issue number in filename: `YYYYMMDD-GH<number>-name.md`
- Reference issue URL in plan frontmatter

### If No Issue Exists:
**Claude MUST recommend creating one before proceeding:**

```markdown
⚠️ **No GitHub Issue Found**

This plan is not yet linked to a GitHub issue. I recommend:

1. Create issue: `gh issue create --title "Refactor payroll tax calculation" --body "..."`
2. Get issue number (e.g., #15)
3. Rename plan file to include issue: `20260102-GH15-payroll-tax-refactor.md`
4. Update plan frontmatter with issue URL
```

### Issue Requirements:
- Title should match plan objective
- Body should reference plan file location
- Add appropriate labels (e.g., `enhancement`, `bug`, `refactor`)
- Assign to responsible developer
- Link to project board if applicable

### Commands:
```bash
# Create issue from plan
gh issue create \
  --title "Refactor payroll tax calculation" \
  --body "See implementation plan: .claude/plans/active/20260102-GH15-payroll-tax-refactor.md" \
  --label "enhancement" \
  --assignee @me

# Link plan to existing issue
gh issue comment 15 --body "Implementation plan: .claude/plans/active/20260102-GH15-payroll-tax-refactor.md"
```

---

## 7. Plan Frontmatter (Metadata)

Every plan MUST include YAML frontmatter:

```yaml
---
title: "Refactor Payroll Tax Calculation"
issue: "https://github.com/JavierGarciaGomez/hvp2021backend/issues/15"
created: "2026-01-02"
status: "active"  # active | completed | archived
type: "plan"      # plan | subplan
subplans: ["SP1", "SP2", "SP3"]  # Only if this plan has subplans (use uppercase)
parent: "20260102-GH15-main.md"  # Only for subplans
assignee: "Backend Team"
priority: "high"  # high | medium | low
estimated_hours: 8
tags: ["payroll", "tax", "refactor", "domain"]
---
```

### Required Fields:
- `title`: Clear objective statement
- `issue`: Full GitHub issue URL
- `created`: Plan creation date (YYYY-MM-DD)
- `status`: Current state
- `type`: "plan" or "subplan"
- `assignee`: Who is responsible

### Optional Fields:
- `subplans`: Array of subplan identifiers (only if plan has subplans)
- `parent`: Parent plan filename (only for subplans)
- `priority`: Urgency level
- `estimated_hours`: Implementation estimate
- `tags`: Searchable keywords

---

## 8. Plan Structure (Required Sections)

Every plan MUST include these sections:

### 1. Objective
**What:** One-paragraph description of what this plan achieves.

**Why:** Business/technical justification.

```markdown
## Objective

Refactor the payroll tax calculation logic to properly split taxable and exempt amounts for aguinaldo, prima vacacional, and overtime pay according to Mexican tax law. This ensures CFDI compliance and accurate tax withholding.

**Why:** Current implementation calculates total amounts but doesn't track tax-exempt portions separately, leading to incorrect ISR calculations and potential legal issues.
```

### 2. Scope
**In Scope:** What will be changed.

**Out of Scope:** What won't be addressed.

```markdown
## Scope

### In Scope
- Modify domain entities to track taxable/exempt splits
- Update tax calculation services
- Refactor API response format
- Update existing tests

### Out of Scope
- CFDI integration (separate issue #23)
- Historical data migration (manual process)
- UI changes (frontend team)
```

### 3. Current State Analysis
**Existing Implementation:** How it currently works.

**Problems:** What's broken or insufficient.

**Root Cause:** Why the problem exists.

```markdown
## Current State Analysis

### Existing Implementation
`PayrollCalculationService.calculateAguinaldo()` returns a single `totalAmount` field without distinguishing taxable vs exempt portions.

**Code Reference:** `src/application/services/PayrollCalculationService.ts:145`

### Problems
- Tax withholding is incorrect (applies ISR to full amount)
- CFDI requirements not met (need separate line items)
- Overpayment of taxes (~15% error rate)

### Root Cause
Original implementation didn't account for UMA-based tax exemptions introduced in Mexican tax reform.
```

### 4. Proposed Solution
**Approach:** High-level strategy.

**Alternatives Considered:** Other options and why rejected.

**Design Decisions:** Key technical choices.

```markdown
## Proposed Solution

### Approach
Add `TaxSplit` value object to domain layer with `taxableAmount` and `exemptAmount` fields. Update all payroll calculations to return `TaxSplit` instead of single amount.

### Alternatives Considered
1. **Calculate split at presentation layer** - Rejected: violates domain purity
2. **Store as separate database fields** - Deferred: do calculation first, optimize storage later
3. **Use third-party tax library** - Rejected: Mexican tax law is too specific

### Design Decisions
- Use Money value object for all amounts (avoid floating-point errors)
- Immutable TaxSplit to prevent inconsistent state
- Calculate at domain layer, cache at application layer
```

### 5. Implementation Steps
**Detailed, ordered list of implementation tasks.**

```markdown
## Implementation Steps

### Phase 1: Domain Layer (SP1)
1. Create `TaxSplit` value object in `src/domain/value-objects/TaxSplit.ts`
2. Update `Payroll` entity to use `TaxSplit` for aguinaldo field
3. Add `calculateTaxSplit()` method to `PayrollCalculation` domain service
4. Write unit tests for `TaxSplit` and calculation logic

### Phase 2: Application Layer (SP2)
1. Update `PayrollCalculationService.calculateAguinaldo()` to return `TaxSplit`
2. Modify DTOs to include `taxableAmount` and `exemptAmount` fields
3. Update service tests

### Phase 3: API Layer (SP3)
1. Update payroll response format in controllers
2. Add API documentation for new fields
3. Update integration tests
4. Test with Postman collection

### Phase 4: Deployment
1. Deploy to staging environment
2. Run validation queries on staging data
3. Update production environment
4. Monitor for errors
```

### 6. Files to Modify
**List ALL files that will be changed.**

```markdown
## Files to Modify

### Create New
- `src/domain/value-objects/TaxSplit.ts`
- `src/domain/value-objects/__tests__/TaxSplit.test.ts`

### Modify Existing
- `src/domain/entities/Payroll.ts`
- `src/domain/services/PayrollCalculation.ts`
- `src/application/services/PayrollCalculationService.ts`
- `src/application/dtos/PayrollDto.ts`
- `src/presentation/controllers/PayrollController.ts`
- `src/application/services/__tests__/PayrollCalculationService.test.ts`

### Documentation
- `README.md` (update tax calculation section)
- `docs/PAYROLL-CALCULATIONS.md`
```

### 7. Testing Strategy
**How to verify the implementation.**

```markdown
## Testing Strategy

### Unit Tests
- `TaxSplit.test.ts`: Test value object creation, immutability, validation
- `PayrollCalculation.test.ts`: Test tax split calculations with edge cases

### Integration Tests
- Test full payroll calculation flow with various scenarios:
  - Aguinaldo below UMA limit (fully exempt)
  - Aguinaldo above UMA limit (split calculation)
  - Edge case: exactly 30 UMA days

### Manual Testing
- Use Postman collection: `tests/payroll/tax-split-scenarios.json`
- Verify responses match expected format
- Test with real employee data on staging

### Validation Queries
```sql
-- Verify tax splits sum correctly
db.payrolls.aggregate([
  { $project: {
    total: { $add: ["$aguinaldo.taxableAmount", "$aguinaldo.exemptAmount"] }
  }}
])
```
```

### 8. Risks and Mitigation
**Potential problems and how to handle them.**

```markdown
## Risks and Mitigation

### Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Breaking API contract | High | Medium | Add new fields, deprecate old field gradually |
| Floating-point precision errors | High | Low | Use Money value object with integer cents |
| Performance degradation | Medium | Low | Cache calculated splits at application layer |

### Business Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Historical data inconsistency | Medium | High | Document that old payrolls use old format |
| Tax law changes | High | Low | Externalize UMA values to configuration |
```

### 9. Dependencies
**What must be done first, and what this blocks.**

```markdown
## Dependencies

### Blocked By
- None (can start immediately)

### Blocks
- Issue #23: CFDI Integration (needs tax split data)
- Issue #31: Payroll Report Generation (needs updated format)

### Related Work
- Issue #12: API Logger (no dependency, but useful for testing)
```

### 10. Success Criteria
**How do we know when this is complete?**

```markdown
## Success Criteria

### Functional Requirements
- ✅ All payroll calculations return `TaxSplit` objects
- ✅ API responses include `taxableAmount` and `exemptAmount`
- ✅ Tax withholding calculations use only taxable portion
- ✅ All tests pass (unit + integration)

### Non-Functional Requirements
- ✅ No performance regression (< 50ms per payroll calculation)
- ✅ Backward compatible API (old clients still work)
- ✅ Documentation updated

### Validation
- ✅ Staging environment tests pass
- ✅ Manual verification with 10+ real employee scenarios
- ✅ Code review approved by senior developer
```

---

## 9. Plan Lifecycle States

### State Definitions:

| State | Description | Location | Next State |
|-------|-------------|----------|------------|
| **Draft** | Plan being written | `.claude/plans/active/` | Active |
| **Active** | Approved, implementation in progress | `.claude/plans/active/` | Completed / Archived |
| **Completed** | Successfully implemented | `.claude/plans/completed/{YEAR}/` | - |
| **Archived** | Abandoned or superseded | `.claude/plans/archived/` | - |

### State Transitions:

```markdown
Draft → Active:
  - All required sections complete
  - GitHub issue created and linked
  - Subplans defined (if needed)
  - Assigned to developer

Active → Completed:
  - All TODOs marked complete
  - Tests passing
  - Code merged to main
  - Deployed to production

Active → Archived:
  - Superseded by another plan
  - No longer relevant
  - Approach rejected after spike
```

### Updating State:

```bash
# Mark plan as completed
# 1. Update frontmatter status
sed -i 's/status: "active"/status: "completed"/' .claude/plans/active/20260102-GH15-plan.md

# 2. Move to completed directory
mv .claude/plans/active/20260102-GH15-plan.md .claude/plans/completed/2026/

# 3. Close GitHub issue
gh issue close 15 --comment "Implementation completed. See plan: .claude/plans/completed/2026/20260102-GH15-plan.md"
```

---

## 10. Plan Review and Approval

### Before Implementation:

Every plan MUST be reviewed for:

1. **Completeness:** All required sections present
2. **Clarity:** Objective and approach are clear
3. **Feasibility:** Implementation steps are realistic
4. **Alignment:** Matches project architecture and conventions
5. **Testing:** Adequate test coverage planned
6. **Risks:** Potential issues identified and mitigated

### Review Checklist:

```markdown
## Plan Review Checklist

- [ ] Filename follows convention: `YYYYMMDD-GH<N>-name.md`
- [ ] Frontmatter complete with all required fields
- [ ] GitHub issue exists and is linked
- [ ] Objective is clear and measurable
- [ ] Scope is well-defined (in/out of scope)
- [ ] Current state analysis shows understanding of problem
- [ ] Proposed solution includes design decisions
- [ ] Implementation steps are detailed and ordered
- [ ] Subplans integrated in steps (not separate section) if needed
- [ ] All files to modify are listed
- [ ] Testing strategy is comprehensive
- [ ] Risks are identified with mitigation
- [ ] Dependencies are documented
- [ ] Success criteria are measurable
- [ ] TODOs are actionable and specific
```

### Approval Process:

1. **Self-review:** Claude checks against this checklist
2. **User review:** User reads plan and approves/requests changes
3. **Exit plan mode:** Use `ExitPlanMode` tool only after approval
4. **Begin implementation:** Mark plan as "active" and start work

---

## 11. Payroll-Specific Rules (HVP2021)

### Critical Compliance Checks:

When planning changes to payroll system, ALWAYS verify:

1. **Timezone:** Mexico timezone used for all date operations
2. **UMA Values:** Current values used (2024: $108.57 daily)
3. **Tax-Exempt Limits:** Correct limits applied per Mexican law
4. **Clean Architecture:** Domain layer purity maintained
5. **Authentication:** Dual-header JWT requirement not broken

### Code Examples to Include:

```typescript
// ✅ CORRECT: Mexico timezone
import moment from 'moment-timezone';
const year = moment.tz(periodEnd, 'America/Mexico_City').year();

// ❌ INCORRECT: UTC timezone
const year = new Date(periodEnd).getFullYear();
```

### High-Risk Areas:

Pay extra attention when planning changes to:
- `src/domain/services/PayrollCalculation.ts`
- `src/application/services/PayrollCalculationService.ts`
- Any file with "tax", "ISR", "IMSS", or "aguinaldo" in name
- Date/time handling functions

### Testing Requirements:

All payroll plans MUST include:
- Edge cases for UMA limits (exactly at limit, 1 peso above/below)
- Timezone tests (verify Mexico timezone used)
- Tax calculation tests with known correct values
- Integration tests with real employee data

---

## 12. Quick Reference

### Creating a New Plan:

```bash
# Use the /new-plan command (recommended)
/new-plan

# Or manually:
# 1. Create file with correct naming
touch .claude/plans/active/20260102-GH42-feature-name.md

# 2. Copy template
cp .claude/templates/plan.md .claude/plans/active/20260102-GH42-feature-name.md

# 3. Fill in all sections

# 4. Link to GitHub issue
gh issue create --title "Feature Name" --body "Plan: .claude/plans/active/20260102-GH42-feature-name.md"
```

### Common Commands:

```bash
# List active plans
ls -l .claude/plans/active/

# Find plans by tag
grep -r "tags:.*payroll" .claude/plans/

# Move completed plan
mv .claude/plans/active/20260102-GH15-plan.md .claude/plans/completed/2026/

# Archive abandoned plan
mv .claude/plans/active/20260102-GH99-old-plan.md .claude/plans/archived/
```

---

## 13. Enforcement

### Claude MUST:

1. **Always check** for GitHub issue before creating plan
2. **Always use** TodoWrite tool during implementation
3. **Always verify** naming convention is correct
4. **Always create** subplans when criteria are met
5. **Always include** all required sections in plan
6. **Always update** frontmatter status when state changes
7. **Always recommend** creating issue if one doesn't exist
8. **Always validate** payroll-specific rules for payroll changes

### Claude MUST NOT:

1. ❌ Create plans without GitHub issues (must recommend creating one first)
2. ❌ Skip TODO tracking (every step must be tracked)
3. ❌ Use Spanish for plan content (English only)
4. ❌ Proceed with incomplete plans (all sections required)
5. ❌ Create master plan when subplans needed (split complex plans)
6. ❌ Ignore payroll compliance rules (critical for this project)

---

## 14. Examples

### Example Plan:
See: `.claude/templates/plan.md`

### Example Subplan:
See: `.claude/templates/subplan.md`

---

## Questions or Issues?

If these rules are unclear or need adjustment, discuss with the team and update this document. This is a living document that should evolve with project needs.

**Last Updated:** 2026-01-02
