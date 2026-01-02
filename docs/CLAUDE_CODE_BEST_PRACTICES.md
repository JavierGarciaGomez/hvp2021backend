# Claude Code Best Practices Guide

A comprehensive guide for structuring information and tools for optimal Claude Code integration.

---

## Table of Contents

1. [Quick Decision Matrix](#quick-decision-matrix)
2. [CLAUDE.md - Project Memory](#claudemd---project-memory)
3. [Rules - Modular Context](#rules---modular-context)
4. [Slash Commands](#slash-commands)
5. [Agents (Subagents)](#agents-subagents)
6. [Skills](#skills)
7. [MCP Servers](#mcp-servers)
8. [Scripts & Automation](#scripts--automation)
9. [Documentation](#documentation)
10. [Real-World Examples](#real-world-examples)
11. [Common Patterns](#common-patterns)

---

## Quick Decision Matrix

Use this table to quickly decide which mechanism to use:

| What You Need | Use | Why |
|---------------|-----|-----|
| Claude should always know project structure | **CLAUDE.md** | Loaded automatically at session start |
| Claude should always know API endpoints | **CLAUDE.md** | Always available reference |
| Claude should always know coding standards | **CLAUDE.md** | Passive reference, team-shared |
| Context only for specific files/folders | **Rules** | Loaded conditionally via glob patterns |
| Domain-specific guidelines (payroll, auth) | **Rules** | Modular, organized, conditional loading |
| Keep CLAUDE.md from getting too large | **Rules** | Split into focused, maintainable files |
| Quick way to test endpoints manually | **Slash Command** | Explicit invocation, can run bash |
| Validate implementations with curl | **Slash Command** | Manual trigger when needed |
| Run a specific workflow on demand | **Slash Command** | Simple, single-file, manual |
| Complex task requiring expertise | **Agent** | Dedicated AI with specialized context |
| Code review after implementation | **Agent** | Fresh perspective, specialized role |
| Auto-discovered capability | **Skill** | Claude finds it when relevant |
| Team workflow that should be standardized | **Skill** | Directory-based, rich resources |
| Integrate external API (GitHub, Slack) | **MCP Server** | External service connection |
| Query database during development | **MCP Server** | Real-time data access |
| Reusable logic without AI | **Script** | Pure automation, faster execution |
| Cache and manage auth tokens | **Script** | Efficiency, no AI needed |

---

## CLAUDE.md - Project Memory

### What It Is
Long-form project context that Claude automatically loads at every session start. Think of it as Claude's "memory" of your project.

### When to Use
Use CLAUDE.md for information that Claude should **always** know:
- ✅ Project architecture and structure
- ✅ Tech stack and dependencies
- ✅ API endpoints and authentication
- ✅ Development workflows (build, test, deploy)
- ✅ Business context and domain knowledge
- ✅ Common commands and scripts
- ✅ Database schema overview
- ✅ Environment configuration

### When NOT to Use
- ❌ Step-by-step procedures (use Slash Commands)
- ❌ Temporary information that changes frequently
- ❌ Sensitive credentials (use environment variables)
- ❌ Large code samples (use file references with `@`)

### Structure Example

```markdown
# Project Name - Project Context

## Overview
Brief description of what the project does.

## Tech Stack
- Language: TypeScript/Node.js
- Framework: Express
- Database: MongoDB
- Architecture: Clean Architecture

## Development Environment

### Setup
\`\`\`bash
npm install
npm run dev
\`\`\`

### Key Scripts
- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm test\` - Run tests

## API Configuration

### Authentication
All endpoints require JWT token in headers:
\`\`\`
x-token: <jwt-token>
Authorization: Bearer <jwt-token>
\`\`\`

### Key Endpoints
- \`GET /api/users\` - Get all users
- \`POST /api/users\` - Create user
- \`GET /api/users/:id\` - Get user by ID

## Project Structure
\`\`\`
src/
├── domain/       # Business entities
├── application/  # Use cases
├── infrastructure/ # External concerns
└── presentation/ # HTTP layer
\`\`\`

## Business Context
Important domain knowledge here...

## Common Workflows
Step-by-step procedures for common tasks...
```

### Best Practices
1. **Keep it current** - Update when architecture changes
2. **Use sections** - Organize with clear headers
3. **Link to files** - Use `@path/to/file` for code references
4. **Be concise** - Summarize, don't duplicate docs
5. **Version control** - Commit to git, share with team

---

## Rules - Modular Context

### What They Are
Rules are modular markdown files that extend CLAUDE.md with conditional, context-specific instructions. They live in `.claude/rules/` and can be loaded always or only when working with specific files.

Think of them as "plugins" for your project context - they keep CLAUDE.md focused while providing deep expertise when needed.

### When to Use
Use Rules for:
- ✅ Domain-specific guidelines (payroll calculations, tax rules)
- ✅ File-type specific conventions (API routes, database models)
- ✅ Complex workflows that apply to specific areas
- ✅ Keeping CLAUDE.md from becoming too large
- ✅ Team standards that only apply in certain contexts
- ✅ Compliance requirements for specific modules

### When NOT to Use
- ❌ Information needed in every conversation (use CLAUDE.md)
- ❌ Quick procedures (use Slash Commands)
- ❌ One-time instructions (just tell Claude directly)
- ❌ Sensitive credentials (use environment variables)

### Structure

**Location:** `.claude/rules/<rule-name>.md`

**Directory Structure:**
```
.claude/
├── CLAUDE.md              # Main project context (always loaded)
└── rules/
    ├── planning.md        # Planning mode rules (always loaded)
    ├── api-guidelines.md  # API-specific rules (conditional)
    ├── payroll-rules.md   # Payroll domain rules (conditional)
    └── testing.md         # Testing standards (conditional)
```

### Loading Modes

#### 1. Always Loaded (No Frontmatter)
Rules without frontmatter are loaded in every conversation:

```markdown
# Planning Rules

These rules apply to all planning activities...
```

#### 2. Conditionally Loaded (With Glob Patterns)
Rules with `globs` frontmatter only load when working with matching files:

```yaml
---
globs: ["src/presentation/routes/**/*", "src/presentation/controllers/**/*"]
---

# API Development Rules

When working on API routes and controllers, follow these guidelines...
```

#### 3. Description-Based Discovery
Add descriptions to help Claude understand when to apply the rule:

```yaml
---
globs: ["src/domain/**/*", "src/application/services/**/*"]
description: "Rules for payroll calculations and Mexican tax compliance"
---

# Payroll Domain Rules

## Tax Calculation Requirements
- Always use Mexico timezone for date operations
- Apply UMA-based exemptions correctly
...
```

### Frontmatter Options

```yaml
---
# Glob patterns - rule loads when working with matching files
globs: ["src/api/**/*", "*.routes.ts"]

# Description - helps Claude understand when to apply
description: "Guidelines for API endpoint development"

# Optional: Restrict to specific operations
applies_to: ["create", "modify"]  # Only when creating/modifying files
---
```

### Glob Pattern Examples

| Pattern | Matches |
|---------|---------|
| `src/api/**/*` | All files under src/api/ |
| `*.test.ts` | All TypeScript test files |
| `src/**/*.routes.ts` | All route files in src/ |
| `["*.ts", "*.tsx"]` | All TypeScript files |
| `src/domain/entities/**/*` | All entity files |

### Examples

#### Example 1: API Guidelines
**File:** `.claude/rules/api-guidelines.md`
```yaml
---
globs: ["src/presentation/**/*"]
description: "API development standards and patterns"
---

# API Development Guidelines

## Authentication
All endpoints require dual-header authentication:
- `x-token: <jwt-token>`
- `Authorization: Bearer <jwt-token>`

## Response Format
Always return consistent JSON structure:
\`\`\`json
{
  "ok": true,
  "data": { ... }
}
\`\`\`

## Error Handling
Use HTTP status codes correctly:
- 400: Validation errors
- 401: Authentication required
- 403: Forbidden
- 404: Resource not found
- 500: Server errors
```

#### Example 2: Domain-Specific Rules
**File:** `.claude/rules/payroll-rules.md`
```yaml
---
globs: ["src/domain/**/payroll*", "src/application/services/**/payroll*"]
description: "Mexican payroll and tax calculation rules"
---

# Payroll Domain Rules

## Critical Compliance

### Timezone Handling
ALWAYS use Mexico timezone for date operations:
\`\`\`typescript
// ✅ Correct
import moment from 'moment-timezone';
const year = moment.tz(date, 'America/Mexico_City').year();

// ❌ Incorrect - uses UTC
const year = new Date(date).getFullYear();
\`\`\`

### Tax-Exempt Limits (Mexican Law)
- Aguinaldo: First 30 UMA days exempt
- Prima Vacacional: First 15 UMA days exempt
- Overtime: First 5 UMA per period exempt

### Current UMA Value (2024)
- Daily: $108.57 MXN
```

#### Example 3: Testing Standards
**File:** `.claude/rules/testing.md`
```yaml
---
globs: ["**/*.test.ts", "**/*.spec.ts", "src/__tests__/**/*"]
description: "Testing standards and conventions"
---

# Testing Standards

## File Naming
- Unit tests: `<name>.test.ts`
- Integration tests: `<name>.integration.test.ts`
- E2E tests: `<name>.e2e.test.ts`

## Test Structure
Use AAA pattern (Arrange, Act, Assert):
\`\`\`typescript
describe('PayrollService', () => {
  it('should calculate aguinaldo correctly', () => {
    // Arrange
    const salary = 10000;
    const startDate = new Date('2024-01-15');

    // Act
    const result = service.calculateAguinaldo(salary, startDate);

    // Assert
    expect(result.totalAmount).toBe(expectedAmount);
  });
});
\`\`\`

## Coverage Requirements
- Minimum 80% coverage for new code
- 100% coverage for payroll calculations
```

#### Example 4: Planning Rules (Always Loaded)
**File:** `.claude/rules/planning.md`
```markdown
# Planning Mode Rules

These rules govern how implementation plans are created and tracked.

## Plan File Naming
Format: `YYYYMMDD-GH<number>-<descriptive-name>.md`

## Required Sections
Every plan must include:
1. Objective
2. Scope
3. Current State Analysis
4. Proposed Solution
5. Implementation Steps
6. Files to Modify
7. Testing Strategy
8. Risks and Mitigation
...
```

### Best Practices

1. **Keep rules focused** - One domain/concern per rule file
2. **Use specific globs** - Avoid overly broad patterns
3. **Add descriptions** - Help Claude discover when to apply
4. **Don't duplicate** - Reference CLAUDE.md instead of repeating
5. **Version control** - Commit rules to git with the project
6. **Review periodically** - Update rules as the project evolves

### Rules vs CLAUDE.md

| Aspect | CLAUDE.md | Rules |
|--------|-----------|-------|
| Loading | Always | Conditional or always |
| Scope | Project-wide | Specific domains/files |
| Size | Keep concise | Can be detailed |
| Location | Project root or `.claude/` | `.claude/rules/` |
| Use case | Core context | Specialized guidelines |

### Common Patterns

#### Pattern 1: CLAUDE.md + Specialized Rules
```
CLAUDE.md           → Project overview, tech stack, key commands
rules/api.md        → API-specific patterns (loaded for routes/controllers)
rules/domain.md     → Domain rules (loaded for entities/services)
rules/testing.md    → Test conventions (loaded for test files)
```

#### Pattern 2: Domain-Driven Rules
```
rules/payroll.md    → Payroll calculations, tax rules
rules/inventory.md  → Inventory management rules
rules/billing.md    → Billing and invoicing rules
```

#### Pattern 3: Layer-Based Rules
```
rules/presentation.md  → HTTP layer conventions
rules/application.md   → Service layer patterns
rules/infrastructure.md → Database, external APIs
rules/domain.md        → Business logic rules
```

---

## Slash Commands

### What They Are
Reusable prompts stored as Markdown files that execute when you type `/<command-name>`. Like keyboard shortcuts for common tasks.

### When to Use
Perfect for:
- ✅ Manual, explicit workflows
- ✅ Testing and validation procedures
- ✅ Quick reference guides
- ✅ Running bash commands with context
- ✅ Frequently-repeated instructions

### When NOT to Use
- ❌ Complex multi-file workflows (use Skills or Agents)
- ❌ Automatic discovery (use Skills)
- ❌ Long-term reference (use CLAUDE.md)
- ❌ External service integration (use MCP)

### Structure

**Location:** `.claude/commands/<command-name>.md`

**Format:**
```markdown
---
description: Brief description shown in command palette
allowed-tools: [Bash, Read, Write] # Optional: restrict tools
---

# Command Title

Instructions for Claude on what to do when this command runs.

## Steps
1. Do this
2. Then this
3. Finally this

## Example
\`\`\`bash
# Commands to run
curl http://localhost:3000/api/endpoint
\`\`\`
```

### Examples

#### Example 1: API Testing
**File:** `.claude/commands/test-api.md`
```markdown
---
description: Test API endpoints with authentication
allowed-tools: [Bash]
---

Test the API endpoint being developed:

1. Get auth token:
\`\`\`bash
TOKEN=$(./scripts/get-token.sh)
\`\`\`

2. Test the endpoint:
\`\`\`bash
curl -X GET http://localhost:3000/api/ENDPOINT \
  -H "Authorization: Bearer $TOKEN"
\`\`\`

3. Validate the response matches expectations
```

#### Example 2: Code Review
**File:** `.claude/commands/review.md`
```markdown
---
description: Review recent changes for quality and best practices
allowed-tools: [Bash, Read]
---

Review the code changes:

1. Show recent changes:
\`\`\`bash
git diff HEAD~1
\`\`\`

2. Check for:
   - Code quality issues
   - Security vulnerabilities
   - Best practice violations
   - Missing tests
   - Documentation needs

3. Provide specific suggestions for improvements
```

### Best Practices
1. **Single purpose** - One command, one task
2. **Clear instructions** - Tell Claude exactly what to do
3. **Include examples** - Show command patterns
4. **Restrict tools** - Use `allowed-tools` for security
5. **Support arguments** - Use `$1`, `$2`, `$ARGUMENTS`

---

## Agents (Subagents)

### What They Are
Specialized AI assistants with their own context window, system prompt, and tool access. Like hiring an expert consultant for a specific task.

### When to Use
Use agents for:
- ✅ Complex, multi-step tasks requiring expertise
- ✅ Tasks needing fresh perspective (e.g., code review)
- ✅ Workflows requiring specialized knowledge
- ✅ Long-running tasks that can be resumed
- ✅ When you want to restrict tool access for security

### When NOT to Use
- ❌ Simple, single-file tasks (use Slash Commands)
- ❌ Always-available reference (use CLAUDE.md)
- ❌ Quick manual workflows (use Slash Commands)
- ❌ When main conversation context is needed

### Structure

**Location:** `.claude/agents/<agent-name>.md`

**Format:**
```markdown
---
description: Brief description of agent's purpose
model: opus # or sonnet, haiku
allowed-tools: [Read, Bash, Edit] # Optional: restrict tools
---

# System Prompt for Agent

You are a specialized agent for [purpose].

## Your Role
Define the agent's expertise and responsibilities.

## Guidelines
Specific instructions for how to approach tasks.

## Process
1. Step 1
2. Step 2
3. Step 3
```

### Examples

#### Example 1: Code Reviewer
**File:** `.claude/agents/code-reviewer.md`
```markdown
---
description: Reviews code for quality, security, and best practices
model: opus
allowed-tools: [Read, Bash]
---

You are a senior code reviewer specializing in TypeScript and Node.js.

## Your Role
Review code changes for:
- Code quality and maintainability
- Security vulnerabilities
- Performance issues
- Best practice violations
- Test coverage

## Guidelines
1. Read the changed files
2. Analyze for issues
3. Provide specific, actionable feedback
4. Suggest concrete improvements
5. Highlight both positives and concerns

## Output Format
Provide a structured review:
- **Summary**: Brief overview
- **Issues Found**: List of problems
- **Recommendations**: Specific suggestions
- **Security Concerns**: Any vulnerabilities
- **Testing**: Coverage assessment
```

#### Example 2: Documentation Generator
**File:** `.claude/agents/doc-writer.md`
```markdown
---
description: Generates comprehensive documentation from code
model: sonnet
allowed-tools: [Read, Write, Glob]
---

You are a technical writer specializing in API documentation.

## Your Role
Generate clear, comprehensive documentation from code.

## Process
1. Read the source files
2. Extract public APIs, interfaces, types
3. Generate markdown documentation
4. Include usage examples
5. Document edge cases and errors

## Style Guide
- Use active voice
- Include code examples
- Document parameters and return types
- Add usage examples
- Note any gotchas or limitations
```

### Best Practices
1. **Specific role** - Define clear expertise
2. **Fresh context** - Use when main context is too large
3. **Resumable** - Design for potential resumption
4. **Restrict tools** - Only allow necessary tools
5. **Clear output** - Specify expected format

---

## Skills

### What They Are
Modular, discoverable capabilities packaged as directories. Claude automatically finds and uses them when relevant. Like giving Claude a toolbox where it picks the right tool.

### When to Use
Use skills for:
- ✅ Complex capabilities requiring multiple files
- ✅ Team workflows that should be standardized
- ✅ Capabilities that should be auto-discovered
- ✅ Rich knowledge with supporting resources
- ✅ Composable workflows

### When NOT to Use
- ❌ Simple single-file tasks (use Slash Commands)
- ❌ Explicit manual workflows (use Slash Commands)
- ❌ Always-loaded reference (use CLAUDE.md)
- ❌ When you want explicit control

### Structure

**Location:** `.claude/skills/<skill-name>/`

```
.claude/skills/deploy/
├── SKILL.md              # Main skill definition
├── checklist.md          # Pre-deployment checklist
├── rollback-plan.md      # Rollback procedures
└── scripts/
    └── deploy.sh         # Deployment script
```

**SKILL.md Format:**
```markdown
---
description: Brief description that helps Claude discover this skill
allowed-tools: [Bash, Read, Write]
---

# Skill Name

## Purpose
What this skill does.

## When to Use
Situations where this skill applies.

## Resources
- @checklist.md - Pre-deployment checklist
- @rollback-plan.md - Rollback procedures
- @scripts/deploy.sh - Deployment script

## Process
1. Step 1
2. Step 2
3. Step 3
```

### Example: Deployment Skill

**`.claude/skills/deploy/SKILL.md`:**
```markdown
---
description: Deploy application to production with safety checks
allowed-tools: [Bash, Read]
---

# Production Deployment

## Purpose
Safely deploy the application to production with proper validation.

## When to Use
When the user asks to deploy to production or mentions deployment.

## Resources
- @checklist.md - Pre-deployment validation
- @rollback-plan.md - Emergency rollback
- @scripts/deploy.sh - Deployment script

## Process
1. Run pre-deployment checklist
2. Validate tests pass
3. Build production bundle
4. Deploy to staging first
5. Run smoke tests
6. Deploy to production
7. Monitor for errors
```

### Best Practices
1. **Good description** - Clear, discoverable purpose
2. **Modular resources** - Break into focused files
3. **Progressive disclosure** - Load files as needed
4. **Team standards** - Share common workflows
5. **Document triggers** - Explain when to use

---

## MCP Servers

### What They Are
External tools and integrations connected via Model Context Protocol. Gives Claude access to external services, databases, and APIs.

### When to Use
Use MCP servers for:
- ✅ External service integration (GitHub, Slack, Notion)
- ✅ Database queries during development
- ✅ Real-time data lookups
- ✅ Cloud service access (AWS, GCP)
- ✅ Specialized tools (monitoring, analytics)

### When NOT to Use
- ❌ Local file operations (use built-in tools)
- ❌ Simple bash commands (use Bash tool)
- ❌ Static reference info (use CLAUDE.md)
- ❌ One-time scripts (use Scripts)

### Types

#### 1. Remote HTTP/SSE Servers
Cloud-based services accessed via HTTP.

**Examples:**
- GitHub API integration
- Sentry error tracking
- Slack notifications
- Weather APIs

#### 2. Local Stdio Servers
Custom scripts running on your machine.

**Examples:**
- Database query tools
- Custom CLIs
- Local file indexers

### Configuration

**Add MCP Server:**
```bash
# Remote server
claude mcp add https://api.example.com/mcp

# Local server
claude mcp add stdio -- node path/to/server.js

# With authentication
claude mcp add https://api.github.com/mcp --oauth
```

**Configuration File:** `.mcp.json` (project) or `~/.claude.json` (user)

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "<your-token>"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

### Best Practices
1. **Security first** - Review servers before adding
2. **Use project scope** - Keep project-specific servers in project
3. **Environment variables** - Don't hardcode credentials
4. **Document usage** - Explain available tools in CLAUDE.md
5. **Test thoroughly** - Verify integrations work

---

## Scripts & Automation

### What They Are
Regular bash/node/python scripts for automation. Pure logic without AI involvement.

### When to Use
Use scripts for:
- ✅ Repetitive tasks (no decision-making needed)
- ✅ Performance-critical operations
- ✅ Token caching and management
- ✅ Database operations
- ✅ Build and deployment automation
- ✅ Data transformations

### When NOT to Use
- ❌ Tasks requiring AI reasoning (use Agents/Commands)
- ❌ Complex decision-making (use Claude)
- ❌ One-off explorations (use Claude directly)

### Structure

**Location:** `scripts/` directory

**Example: Token Manager**
```bash
#!/bin/bash
# scripts/get-api-token.sh
# Caches and manages authentication tokens

TOKEN_FILE=".api-token"

# Check if token is still valid
if [ -f "$TOKEN_FILE" ]; then
    # Validate token expiration
    # Return cached token if valid
fi

# Get fresh token if needed
curl -X POST http://localhost:3000/auth/login \
    -d '{"email":"user@example.com","password":"secret"}' \
    | jq -r '.token' > "$TOKEN_FILE"

cat "$TOKEN_FILE"
```

### Best Practices
1. **Make executable** - `chmod +x scripts/*.sh`
2. **Document in CLAUDE.md** - List available scripts
3. **Add to package.json** - Create npm scripts
4. **Error handling** - Exit codes and messages
5. **Idempotent** - Safe to run multiple times

---

## Documentation

### Types of Documentation

#### 1. CLAUDE.md
**Purpose:** Project context Claude always knows
**Audience:** Claude (and developers)
**Update:** When architecture/APIs change

#### 2. README.md
**Purpose:** Human-focused project introduction
**Audience:** Developers joining project
**Update:** With major changes

#### 3. API Documentation
**Purpose:** Endpoint specifications
**Audience:** Frontend developers, API consumers
**Update:** With every API change

#### 4. Architecture Docs
**Purpose:** System design decisions
**Audience:** Senior developers, architects
**Update:** Major architectural changes

### Organization

```
docs/
├── architecture/
│   ├── decisions/          # ADRs
│   └── diagrams/
├── api/
│   ├── authentication.md
│   └── endpoints/
├── guides/
│   ├── getting-started.md
│   └── deployment.md
└── CLAUDE_CODE_BEST_PRACTICES.md
```

---

## Real-World Examples

### Example 1: API Development Workflow

**Setup:**
1. **CLAUDE.md** - Documents API structure, auth, endpoints
2. **Slash Command `/api`** - Quick endpoint testing
3. **Script `get-api-token.sh`** - Token caching
4. **Agent `api-validator`** - Comprehensive endpoint validation

**Usage:**
```bash
# Developer works on new endpoint
# Claude knows from CLAUDE.md:
# - API structure
# - Authentication requirements
# - Existing patterns

# Quick test during development
/api

# Comprehensive validation before PR
# Invoke agent automatically when done
```

### Example 2: Database Operations

**Setup:**
1. **CLAUDE.md** - Database schema, connection info
2. **MCP Server** - PostgreSQL connection
3. **Slash Command `/db-migrate`** - Run migrations
4. **Script `copy-prod-to-dev.sh`** - DB refresh

**Usage:**
```bash
# Developer needs to query data
# Claude uses MCP to query directly

# Run migration
/db-migrate

# Refresh dev database
yarn db:copy-prod  # Documented in CLAUDE.md
```

### Example 3: Code Quality Workflow

**Setup:**
1. **CLAUDE.md** - Coding standards, test requirements
2. **Agent `code-reviewer`** - Reviews code
3. **Slash Command `/lint`** - Quick linting
4. **Skill `testing`** - Auto-discovered test generation

**Usage:**
```bash
# Developer implements feature
# Claude knows standards from CLAUDE.md

# Quick lint check
/lint

# Code review after implementation
# Agent invoked automatically or manually

# Tests auto-generated via skill
```

---

## Common Patterns

### Pattern 1: Reference + Action
- **CLAUDE.md** for context (what)
- **Slash Command** for execution (how)

Example: API endpoints in CLAUDE.md, `/api` command to test them

### Pattern 2: Cache + Smart Refresh
- **Script** for caching logic
- **Slash Command/Agent** uses cached data

Example: `get-api-token.sh` caches tokens, commands use them

### Pattern 3: Overview + Details
- **CLAUDE.md** for high-level overview
- **Modular rules** for specific contexts

Example: Main architecture in CLAUDE.md, detailed patterns in rules/

### Pattern 4: Discovery + Execution
- **Skill** for auto-discovery
- **Resources** for detailed execution

Example: Deployment skill with scripts and checklists

### Pattern 5: External + Local
- **MCP Server** for external data
- **CLAUDE.md** for local context

Example: GitHub MCP for issues, CLAUDE.md for project specifics

---

## Decision Flowchart

```
Need to give Claude information?
│
├─ Always available? ──────────────────────────► CLAUDE.md
│
├─ Manual trigger needed? ─────────────────────► Slash Command
│
├─ Complex task needing expertise? ────────────► Agent
│
├─ Should be auto-discovered? ─────────────────► Skill
│
├─ External service/database? ─────────────────► MCP Server
│
└─ Pure automation (no AI)? ───────────────────► Script
```

---

## Anti-Patterns to Avoid

### ❌ Don't Use CLAUDE.md for Procedures
**Bad:**
```markdown
## How to Deploy
1. Run `npm run build`
2. Run `npm run deploy`
3. Check logs
```

**Good:** Use Slash Command `/deploy` instead

### ❌ Don't Use Slash Commands for Reference
**Bad:** `/show-api-docs` that just displays info

**Good:** Put API docs in CLAUDE.md

### ❌ Don't Create Agent for Simple Tasks
**Bad:** Agent for running a single command

**Good:** Use Slash Command or Script

### ❌ Don't Put Secrets in CLAUDE.md
**Bad:**
```markdown
API_KEY=abc123secret
```

**Good:** Use environment variables, reference in CLAUDE.md

### ❌ Don't Duplicate Information
**Bad:** Same info in CLAUDE.md, README, and Slash Command

**Good:** Single source of truth, cross-reference

---

## Quick Start Checklist

Starting a new project with Claude Code?

1. ☐ Create `CLAUDE.md` with project overview
2. ☐ Document API endpoints and auth
3. ☐ Add development scripts to `package.json`
4. ☐ Create `/test` slash command for quick validation
5. ☐ Add `.gitignore` entries for cached data
6. ☐ Document common workflows
7. ☐ Consider MCP servers for external services
8. ☐ Create agents only when truly needed
9. ☐ Commit Claude configuration to git
10. ☐ Share this guide with your team

---

## Resources

- [Claude Code Official Docs](https://docs.anthropic.com/claude-code)
- [MCP Specification](https://modelcontextprotocol.io)
- [Example Projects](https://github.com/anthropics/claude-code-examples)

---

## Conclusion

The key to effective Claude Code integration is choosing the right mechanism for each need:

- **CLAUDE.md** for what Claude should always know
- **Slash Commands** for manual workflows
- **Agents** for complex specialized tasks
- **Skills** for auto-discovered capabilities
- **MCP Servers** for external integrations
- **Scripts** for pure automation

Start simple, iterate based on needs, and always prioritize clarity and maintainability.
