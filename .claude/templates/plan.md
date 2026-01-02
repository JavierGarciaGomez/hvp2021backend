---
title: "[Brief description of what this plan achieves]"
issue: "https://github.com/JavierGarciaGomez/hvp2021backend/issues/N"
created: "YYYY-MM-DD"
status: "active"  # active | completed | archived
type: "plan"
subplans: []  # ["SP1", "SP2"] if this plan has subplans (use uppercase), otherwise remove this field
assignee: "[Team or person responsible]"
priority: "medium"  # high | medium | low
estimated_hours: 0
tags: ["tag1", "tag2", "tag3"]
---

# [Plan Title]

> **GitHub Issue:** [GH<N> - Issue Title](issue-url)
> **Created:** YYYY-MM-DD
> **Status:** Active

---

## Objective

**What:** [One paragraph describing what this plan will accomplish]

**Why:** [Business or technical justification - why is this important?]

---

## Subplan Overview (Optional)

[If this plan has subplans, include a summary table. Otherwise, remove this section]

| Step | Subplan | Status | Dependencies |
|------|---------|--------|--------------|
| Step 2 | [SP1-name](./YYYYMMDD-GH<N>-SP1-name.md) | Pending | Step 1 |
| Step 5 | [SP2-name](./YYYYMMDD-GH<N>-SP2-name.md) | Pending | SP1, Step 4 |

---

## Scope

### In Scope
- [What will be changed/implemented]
- [Specific features or fixes included]
- [Components/layers affected]

### Out of Scope
- [What will NOT be addressed in this plan]
- [Related work that's deferred to future issues]
- [Explicitly excluded concerns]

---

## Current State Analysis

### Existing Implementation
[Describe how the system currently works. Include:]
- Current behavior
- Relevant code locations (use file paths and line numbers)
- Key components involved

**Code References:**
- `path/to/file.ts:123` - [Brief description]
- `path/to/another/file.ts:456` - [Brief description]

### Problems
[What's wrong or insufficient about the current implementation?]
- Problem 1: [Description]
- Problem 2: [Description]

### Root Cause
[Why do these problems exist? What's the fundamental issue?]

---

## Proposed Solution

### Approach
[High-level strategy for solving the problem. Explain:]
- What will change
- How it will work
- Key technical decisions

### Alternatives Considered

| Alternative | Pros | Cons | Decision |
|-------------|------|------|----------|
| Option 1: [Name] | - Pro 1<br>- Pro 2 | - Con 1<br>- Con 2 | ✅ Selected / ❌ Rejected |
| Option 2: [Name] | - Pro 1<br>- Pro 2 | - Con 1<br>- Con 2 | ✅ Selected / ❌ Rejected |

### Design Decisions

**Decision 1: [Title]**
- **Context:** [Why this decision is needed]
- **Choice:** [What was decided]
- **Rationale:** [Why this choice was made]
- **Consequences:** [Implications of this decision]

**Decision 2: [Title]**
- **Context:** [...]
- **Choice:** [...]
- **Rationale:** [...]
- **Consequences:** [...]

---

## Implementation Steps

[IMPORTANT: Integrate subplans directly into steps. Do NOT create a separate "Subplans" section.]

### Step 1: [Step Title]
[Description of what needs to be done]

**Actions:**
- Action 1: [Specific task]
- Action 2: [Specific task]
- Action 3: [Specific task]

**Verification:** [How to verify this step is complete]

[No subplan needed for this step]

---

### Step 2: [Step Title] → **SEE SUBPLAN SP1**

📋 **Subplan:** [SP1-descriptive-name](./YYYYMMDD-GH<N>-SP1-descriptive-name.md)

**Why subplan needed:** [Explain complexity - e.g., "Complex domain logic with multiple value objects and services requiring detailed analysis"]

**Subplan scope:**
- [High-level task 1]
- [High-level task 2]
- [High-level task 3]
- [High-level task 4]

**Continue here after SP1 is completed:**
[What to verify or do after the subplan is done]

---

### Step 3: [Step Title]
[Description]

**Actions:**
- Action 1
- Action 2

**Verification:** [How to verify]

[No subplan needed]

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
