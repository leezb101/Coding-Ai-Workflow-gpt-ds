# AI Workflow Skills

This directory contains engineering skills used by the AI workflow.

Skills are not standalone policies. They are execution aids selected according to `AGENTS.md`.

If any skill conflicts with `AGENTS.md`, follow `AGENTS.md`.

## Available Skills

### change-control.md

Use this skill to keep file changes small, scoped, reversible, and explainable.

Use it for every task that may modify files.

### context-selection.md

Use this skill to select the smallest useful code context before planning or implementation.

Use it for complex bugs, cross-file changes, unclear relevant files, architecture questions, and visual/UI tasks that may involve multiple components.

### codegraph.md

Use this skill when CodeGraph or a similar dependency/call graph tool can help identify relevant callers, callees, dependency paths, or state/data flows.

Use it to narrow context, not to dump the whole graph into workflow files.

### testing-verification.md

Use this skill to define and run the smallest relevant verification checks after implementation.

Use it for every implementation task.

### refactor-safety.md

Use this skill to stage large refactors, migrations, architecture changes, routing/state/data layer changes, or large rewrites.

Use it whenever the task could affect broad behavior or shared structure.

## Default Skill Selection by Task Type

### A. Simple Implementation Task

Default skills:

- change-control.md
- testing-verification.md

Usually not needed:

- codegraph.md
- refactor-safety.md

Use context-selection.md only if the relevant file is not obvious.

### B. Complex Reasoning Task

Default skills:

- context-selection.md
- testing-verification.md

Use conditionally:

- change-control.md, if code may be modified
- codegraph.md, if call/dependency/state flow matters
- refactor-safety.md, if the solution may become a refactor

### C. Visual / UI / PDF / Browser Task

Default skills:

- context-selection.md
- testing-verification.md

Use conditionally:

- change-control.md, if code may be modified
- codegraph.md, if the issue crosses multiple components, overlays, routes, state layers, or shared UI infrastructure
- refactor-safety.md, if a large UI or animation restructure is needed

### D. High-Risk Refactor Task

Default skills:

- change-control.md
- context-selection.md
- codegraph.md
- testing-verification.md
- refactor-safety.md

### E. Mixed Task

Select all skills required by the highest-risk applicable task type.

If unsure, prefer planning skills before implementation skills.

## CodeGraph Usage Pattern

Use CodeGraph during context preparation when the relevant code area is unclear or cross-file.

Recommended flow:

1. Identify likely entry points from the user request, route, component, error, or stack trace.
2. Use CodeGraph to inspect direct dependencies.
3. Use CodeGraph to inspect callers before changing shared code.
4. Use CodeGraph to summarize state/data flow if the task involves synchronization or persistence.
5. Record only concise findings in `docs/ai-workflow/context.md`.
6. Use the findings to define a safe change boundary in `docs/ai-workflow/implementation-plan.md`.

Use `docs/ai-workflow/skills/codegraph-findings-template.md` to standardize graph findings.

Record concise findings, not full graph dumps.

Use findings to reduce token usage and define safe change boundaries.

Do not paste a full project graph into workflow files.

## Required Recording Locations

When skills are selected, record them in:

- `docs/ai-workflow/intake.md`
- `docs/ai-workflow/context.md`
- `docs/ai-workflow/implementation-plan.md`

After implementation, record skill compliance in:

- `docs/ai-workflow/execution-report.md`

## If a Skill Cannot Be Used

If a selected skill cannot be used, record:

- which skill was unavailable
- why it was unavailable
- what fallback approach was used

Examples:

- CodeGraph unavailable; used manual context selection.
- No project test command found; used static file checks and manual verification steps.
- UI simulator unavailable; used user-provided screenshot and route description.
