---
title: "SP[N]: [Brief description of this subplan's focus]"
issue: "https://github.com/JavierGarciaGomez/hvp2021backend/issues/N"
created: "YYYY-MM-DD"
status: "active"  # active | completed | archived
type: "subplan"
parent: "YYYYMMDD-GH<N>-master-plan.md"
assignee: "[Person responsible for this subplan]"
priority: "medium"  # high | medium | low
estimated_hours: 0
tags: ["tag1", "tag2"]
---

# SP[N]: [Subplan Title]

> **GitHub Issue:** [GH<N> - Parent Issue Title](issue-url)
> **Master Plan:** [YYYYMMDD-GH<N>-master-plan.md](./YYYYMMDD-GH<N>-master-plan.md)
> **Created:** YYYY-MM-DD
> **Status:** Active
> **Type:** Subplan

---

## Master Plan Reference

🔗 **Parent Plan:** [YYYYMMDD-GH<N>-master-plan.md](./YYYYMMDD-GH<N>-master-plan.md)
🔗 **GitHub Issue:** [GH<N> - Issue Title](issue-url)

**Integration Point:** This subplan implements Step [N] of the master plan.

---

## Dependencies

### Blocks
- [What can't proceed until this subplan is complete?]
- Step [N] of master plan: [Description]
- Subplan SP[N]: [Description] (if applicable)

### Blocked By
- [What must be completed before this subplan can start?]
- Step [N] of master plan: [Description]
- Subplan SP[N]: [Description] (if applicable)

[If none, write: "None - can start immediately"]

### Related Work
- [Related subplans or tasks that aren't strict dependencies]

---

## Objective

**What:** [One paragraph describing what THIS subplan specifically accomplishes]

**Why:** [Why this piece is important to the overall solution]

**Scope:** [What architectural layer, component, or concern this addresses]

---

## Scope

### In Scope
- [Specific files/components this subplan handles]
- [Specific functionality to implement]
- [Specific tests to write]

### Out of Scope
- [What other subplans or steps will handle]
- [What's deferred to future work]

---

## Current State Analysis

### Existing Code
[Describe the current state of the code THIS subplan will modify]

**Code References:**
- `path/to/file.ts:123` - [Current behavior]
- `path/to/another/file.ts:456` - [Current behavior]

### Problems in This Area
[What's wrong specifically in this subplan's scope?]
- Problem 1: [Description]
- Problem 2: [Description]

### Why This Needs to Change
[Specific reason this subplan is needed]

---

## Proposed Solution

### Approach
[Detailed technical approach for THIS subplan only]

**Key points:**
- [Main strategy point 1]
- [Main strategy point 2]
- [Main strategy point 3]

### Key Design Decisions

**Decision 1: [Title]**
- **Choice:** [What was decided]
- **Rationale:** [Why]
- **Impact on other subplans:** [How this affects other subplans/steps]

**Decision 2: [Title]**
- **Choice:** [...]
- **Rationale:** [...]
- **Impact on other subplans:** [...]

### Interfaces with Other Subplans/Steps

[Define how this subplan's output connects with other subplans/steps]

**Outputs (what this subplan produces):**
- [Interface/API/data structure that other code depends on]
- [Contract that other subplans/steps depend on]

**Inputs (what this subplan needs):**
- [What this subplan needs from previous steps]
- [Expected format/interface from other subplans]

---

## Implementation Steps

[Detailed, ordered list of steps ONLY for this subplan]

### Step 1: [Action]
**File:** `path/to/file.ts`

**What to do:**
```typescript
// [Pseudocode or description of changes]
// Example:
export class TaxSplit {
  constructor(
    public readonly taxableAmount: Money,
    public readonly exemptAmount: Money
  ) {}
}
```

**Why:** [Justification for this specific change]

**Verification:** [How to verify this step is complete]

---

### Step 2: [Action]
**File:** `path/to/file.ts`

**What to do:**
[Description or code example]

**Why:** [Justification]

**Verification:** [How to verify]

---

### Step 3: [Action]
**File:** `path/to/file.ts`

**What to do:**
[Description]

**Why:** [Justification]

**Verification:** [How to verify]

---

[Continue with all implementation steps...]

---

## Files to Modify

### Create New
- `path/to/new/file1.ts` - [Purpose]
  - [What it contains]
- `path/to/new/file1.test.ts` - [Purpose]
  - [Test scenarios]

### Modify Existing
- `path/to/existing/file.ts` - [Specific changes]
  - **Add:** [What to add]
  - **Change:** [What to change]
  - **Remove:** [What to remove (if any)]

### Impact on Other Files
- `path/to/file-in-another-subplan.ts` - [How this subplan affects it]
  - [Description of impact]

---

## Testing Strategy

### Unit Tests

**New Tests:**

**Test File:** `path/to/test.test.ts`

1. **Test: [Test name]**
   - **Given:** [Setup/preconditions]
   - **When:** [Action performed]
   - **Then:** [Expected result]

2. **Test: [Test name]**
   - **Given:** [Setup]
   - **When:** [Action]
   - **Then:** [Expected]

3. **Test: [Test name]**
   - **Given:** [Setup]
   - **When:** [Action]
   - **Then:** [Expected]

### Edge Cases

- [ ] Edge case 1: [Description and expected behavior]
- [ ] Edge case 2: [Description and expected behavior]
- [ ] Edge case 3: [Description and expected behavior]

### Integration with Other Subplans/Steps

**Testing integration points:**
- **With Step [N]:** [How to verify these work together]
  - Test scenario: [Description]
  - Expected outcome: [What should happen]

- **With Subplan SP[N]:** [Integration test]
  - Test scenario: [Description]
  - Expected outcome: [What should happen]

---

## Risks and Mitigation

### Risks Specific to This Subplan

| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk description] | High/Med/Low | [How to handle] |
| [Risk description] | High/Med/Low | [How to handle] |

### Risks to Other Subplans/Steps

| Risk | Affected Component | Impact | Mitigation |
|------|-------------------|--------|------------|
| [Risk] | Step [N] / SP[N] | High/Med/Low | [How to handle] |

---

## Success Criteria

### Functional Requirements
- [ ] [Specific outcome for this subplan]
- [ ] [Specific outcome for this subplan]
- [ ] [Specific outcome for this subplan]

### Quality Gates
- [ ] All unit tests pass
- [ ] No linter/type errors
- [ ] Code follows project architecture (Clean Architecture for HVP2021)
- [ ] Interfaces defined for other subplans/steps
- [ ] Code review approved

### Verification
- [ ] Changes tested in isolation
- [ ] Integration with dependent subplans/steps verified
- [ ] Master plan updated with completion status

---

## Implementation Checklist

[Managed by Claude using TodoWrite during implementation]

### Subplan TODOs:
- [ ] Step 1: [Detailed task]
- [ ] Step 2: [Detailed task]
- [ ] Step 3: [Detailed task]
- [ ] [Additional tasks...]
- [ ] Write all unit tests
- [ ] Run tests (all passing)
- [ ] Integration testing
- [ ] Code review
- [ ] Update master plan with completion
- [ ] Mark subplan as completed

---

## Communication with Master Plan

### Status Updates to Provide

[When this subplan is complete, update the master plan with:]

**Completed Work:**
- [What was implemented]
- [Key decisions made]
- [Tests added]

**Interfaces/APIs Created:**
[List exported types, functions, classes, or modules that other subplans/steps can use]

Example:
```typescript
// Exported from src/domain/value-objects/TaxSplit.ts
export class TaxSplit {
  constructor(
    public readonly taxableAmount: Money,
    public readonly exemptAmount: Money
  ) {}

  get total(): Money { ... }
}
```

**Blockers Resolved:**
- [What blockers were removed for other subplans/steps]

**New Issues Discovered:**
- [Any problems found that affect other subplans or the master plan]
- [Recommendations for adjustments to master plan]

---

## Notes and Discoveries

[Document important findings during implementation of this subplan]

### Decisions Made During Implementation
- [Date] - [Decision and rationale]
- [Date] - [Adjustment to original plan and why]

### Issues Found
- [Date] - [Issue description and how it was handled]

### Recommendations for Other Subplans
- [Suggestion for other subplans based on learnings here]
- [Warning about potential issues]

---

## References

### Related Code
- [Link to related file or function in codebase]
- [Link to similar implementation for reference]

### Documentation
- [Link to relevant project docs]
- [Link to architecture decision records]

### External Resources
- [Link to library documentation]
- [Link to article or tutorial]
- [Link to Mexican tax law documentation (if payroll-related)]

---

**Subplan Status:** Active
**Last Updated:** YYYY-MM-DD
**Completion Target:** [Date if applicable]
**Master Plan Step:** Step [N]
