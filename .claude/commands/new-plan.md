---
description: Create a new implementation plan with proper naming and structure
allowed-tools: [AskUserQuestion, Bash, Read, Write]
---

# Create New Implementation Plan

Guides you through creating a new implementation plan following HVP2021 planning conventions.

## Plan Creation Process

When the user runs `/new-plan`, follow these steps:

### Step 1: Check for GitHub Issue

Ask the user if a GitHub issue exists for this plan:

```markdown
## GitHub Issue

Does a GitHub issue exist for this plan?

- If yes: What is the issue number?
- If no: I'll help you create one first
```

**If no issue exists:**
1. Ask for plan title
2. Ask for brief description
3. Suggest creating the issue:
   ```bash
   gh issue create \
     --title "[Plan Title]" \
     --body "[Description]" \
     --label "enhancement"
   ```
4. Get the issue number from the output

### Step 2: Determine Plan Type

Ask the user what type of plan:

```markdown
## Plan Type

Is this a:

1. **Plan** - Standard implementation plan (most common - may or may not have subplans)
2. **Subplan** - Detailed plan for a specific complex step of another plan

Which type? (Most cases are just "Plan")
```

### Step 3: Gather Plan Information

**For Plan:**
- Plan title/objective
- Brief description
- Estimated complexity (will it need subplans?)

**For Subplan:**
- Parent plan filename
- Which step of the parent plan this implements
- Subplan focus/scope

### Step 4: Generate Filename

**Format:** `YYYYMMDD-GH<number>-<descriptive-name>.md`

**Plan Example:**
```
20260102-GH42-payroll-tax-calculation-refactor.md
```

**Subplan Example:**
```
20260102-GH42-SP1-domain-layer-implementation.md
```

**Rules:**
- Use today's date in YYYYMMDD format
- Use GitHub issue number with GH prefix
- Use kebab-case for descriptive name
- For subplans, include SP1, SP2, etc.

### Step 5: Create Plan File

1. Copy the appropriate template:
   - Plan: `.claude/templates/plan.md`
   - Subplan: `.claude/templates/subplan.md`

2. Save to: `.claude/plans/active/[filename]`

3. Update frontmatter with provided information:
   - title
   - issue URL
   - created date (today)
   - type (plan/subplan)
   - assignee
   - tags

### Step 6: Open Plan for Editing

Inform the user:

```markdown
✅ Plan created: `.claude/plans/active/[filename]`

Next steps:
1. Fill in all required sections (see planning rules: `.claude/rules/planning.md`)
2. Required sections:
   - Objective
   - Scope
   - Current State Analysis
   - Proposed Solution
   - Implementation Steps (integrate subplans here if needed)
   - Files to Modify
   - Testing Strategy
   - Risks and Mitigation
   - Success Criteria

3. Use the TodoWrite tool to track implementation progress
4. Link plan in GitHub issue:
   ```
   gh issue comment [issue-number] --body "Implementation plan: .claude/plans/active/[filename]"
   ```
```

---

## Example Usage

**User:** `/new-plan`

**Claude:**
1. Does a GitHub issue exist? (if not, creates one)
2. Is this a master plan or subplan?
3. What's the plan title and description?
4. Generates filename: `20260102-GH42-feature-name.md`
5. Creates file in `.claude/plans/active/`
6. Provides next steps

---

## Planning Rules Reference

See `.claude/rules/planning.md` for complete planning conventions including:
- Naming conventions
- Required sections
- Subplan integration (in Implementation Steps, not separate section)
- TODO tracking requirements
- Success criteria

---

## Quick Tips

### Naming Conventions
- **Plan:** `YYYYMMDD-GH<N>-descriptive-name.md`
- **Subplan:** `YYYYMMDD-GH<N>-SP<N>-specific-focus.md`

### When to Create Subplan
Create a subplan if ANY apply:
- Task requires >5 distinct implementation steps
- Different architectural layers involved
- High-risk component needs separate analysis
- Estimated >3 hours of implementation time

### Subplan Integration
- Integrate subplans into Implementation Steps
- Do NOT create separate "Subplans" section
- Each step with subplan should show:
  - Why subplan needed
  - Subplan scope
  - What to do after subplan completes

---

## Templates

- **Plan:** `.claude/templates/plan.md`
- **Subplan:** `.claude/templates/subplan.md`

Both templates include:
- YAML frontmatter
- All required sections
- Examples and guidance
- HVP2021-specific considerations
