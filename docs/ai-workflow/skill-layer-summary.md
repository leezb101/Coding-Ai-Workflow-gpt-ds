# Skill Layer Summary

## Completed Setup

The first Skill Layer setup round is complete.

Completed items:

- Added project-level Skill Selection rules to `AGENTS.md`.
- Created the `docs/ai-workflow/skills/` directory.
- Added skill documents for change control, context selection, CodeGraph usage, testing/verification, and refactor safety.
- Added `docs/ai-workflow/skills/README.md` as the skill directory guide.
- Added `docs/ai-workflow/skills/codegraph-findings-template.md` to standardize compact graph findings.
- Updated workflow scratch templates to record selected skills, context findings, CodeGraph findings, safe change boundaries, impact analysis, skill usage, and boundary deviations.
- Updated `scripts/ai/reset-ai-workflow.mjs` so reset templates include Skill Layer sections.
- Updated workflow guide and prompt handbook to tell Codex to select and record relevant skills.

## Current Skills File List

- `docs/ai-workflow/skills/README.md`
- `docs/ai-workflow/skills/change-control.md`
- `docs/ai-workflow/skills/context-selection.md`
- `docs/ai-workflow/skills/codegraph.md`
- `docs/ai-workflow/skills/codegraph-findings-template.md`
- `docs/ai-workflow/skills/testing-verification.md`
- `docs/ai-workflow/skills/refactor-safety.md`

## Skill Purposes

### change-control.md

Keeps changes small, scoped, reversible, and explainable. Use it for any task that may modify files.

### context-selection.md

Helps select the smallest useful project context before planning or implementation. Use it for complex bugs, unclear relevant files, cross-file changes, architecture questions, and multi-component UI issues.

### codegraph.md

Guides use of CodeGraph or similar call/dependency graph tools. Use it when callers, callees, dependency paths, shared components, or state/data flows matter.

### codegraph-findings-template.md

Standardizes compact CodeGraph findings. It helps turn graph output into task-relevant summaries for `context.md` and `implementation-plan.md`.

### testing-verification.md

Defines the smallest relevant verification checks after implementation. Use it for every implementation task.

### refactor-safety.md

Supports staged planning for large refactors, migrations, architecture changes, routing/state/data layer changes, and broad rewrites.

## AGENTS.md Integration

`AGENTS.md` contains the project policy source of truth and includes a `Skill Selection` section.

Current integration rules:

- Select relevant skills before preparing context, planning implementation, or modifying files.
- Use `change-control.md` for any task that may modify files.
- Use `testing-verification.md` for every implementation task.
- Use `context-selection.md` for complex bugs, state synchronization issues, architecture questions, unclear relevant files, or cross-file changes.
- Use `codegraph.md` when dependency/call graph analysis can clarify callers, callees, shared components, or state/data flow.
- Use `refactor-safety.md` for large refactors, migrations, architecture changes, routing/state/data changes, or broad rewrites.
- Record selected skills in workflow files.
- If a selected skill cannot be used, record why and describe the fallback.

## Workflow Recording

### intake.md

Records:

- `Selected Skills`
- `Skill Rationale`

Purpose:

- Capture why skills are needed or not needed at task intake.
- Prevent accidental overuse or underuse of planning tools.

### context.md

Records:

- `Selected Skills`
- `Context Selection Notes`
- `CodeGraph Findings`
- entry points, relevant callers, relevant callees, dependency/data flow, selected files, excluded files, and confidence level.

Purpose:

- Explain how relevant files were selected.
- Keep context focused and defensible.
- Preserve a compact graph-backed investigation trail when CodeGraph is used.

### implementation-plan.md

Records:

- `Selected Skills`
- `Safe Change Boundary`
- files allowed to change
- files not allowed to change
- behavior that must be preserved
- rollback strategy
- `Impact Analysis`
- affected callers, callees, shared components, and risky dependencies.

Purpose:

- Turn context findings into an implementation boundary.
- Reduce accidental broad edits.
- Make cross-file impact explicit before modifying business code.

### execution-report.md

Records:

- `Skill Usage`
- selected skills
- skill compliance notes
- `Change Boundary Result`
- planned files
- actual files changed
- deviations.

Purpose:

- Confirm whether the implementation followed the selected skills.
- Document whether the actual change stayed inside the planned boundary.

## CodeGraph Findings Template

`docs/ai-workflow/skills/codegraph-findings-template.md` standardizes how graph results are summarized.

It is used when CodeGraph or a similar dependency/call graph tool helps with:

- entry point selection
- caller/callee inspection
- dependency path summaries
- state/data flow summaries
- safe change boundary hints
- impact analysis

The template should produce compact findings for:

- `docs/ai-workflow/context.md`
- `docs/ai-workflow/implementation-plan.md`

It should not be used to paste full raw graph output into workflow files.

## How CodeGraph Reduces Token Waste

CodeGraph reduces token waste by:

- identifying likely entry points before reading files
- showing direct callers and callees for shared symbols
- narrowing dependency paths to the parts relevant to the task
- avoiding broad searches across unrelated pages, services, or generated files
- helping select files to include and files to exclude
- turning large codebase structure into a short graph-backed summary

The intended pattern is:

`request clue -> likely symbol or route -> CodeGraph query -> compact findings -> focused file reads`

## CodeGraph Usage Notes

Use CodeGraph to narrow context, not expand it blindly.

Important rules:

- Do not paste full project graphs into workflow files.
- Record only task-relevant callers, callees, and dependency paths.
- Confirm graph findings against actual source before implementation.
- Inspect callers before changing shared components.
- Use graph findings to define a safe change boundary.
- If CodeGraph is unavailable, record the fallback as manual context selection.
- Avoid using CodeGraph for obvious one-file documentation or copy changes.

## When To Use Skill Layer

Use Skill Layer for:

- any task that may modify files
- every implementation task
- complex bugs
- state synchronization issues
- architecture questions
- unclear relevant files
- cross-file behavior
- shared component changes
- routing/state/data layer changes
- refactors and migrations
- visual/UI tasks that may involve multiple components or shared UI infrastructure

## When Not To Overuse Skill Layer

Do not overuse Skill Layer for:

- simple one-file documentation updates
- obvious copy changes
- low-risk style edits where the file is already known
- read-only status checks
- tasks where the user explicitly restricts allowed files and the change does not require broader context

Even in simple cases, keep change-control and verification expectations proportional to the task.

## Current Remaining Issues

- Skill selection is documented and templated, but still depends on Codex consistently applying it during real tasks.
- CodeGraph availability depends on the current environment and project indexing state.
- The current workflow files are scratch files and can become stale between tasks; Task ID and freshness checks remain important.
- The workspace has previously shown an unrelated Android Gradle wrapper modification. It is outside Skill Layer setup and should be handled separately if still present.
- No automated validator currently checks that every workflow file has all required Skill Layer sections after manual edits.

## Migration Checklist For Other Projects

Copy these files:

- `AGENTS.md` Skill Selection section
- `docs/ai-workflow/skills/README.md`
- `docs/ai-workflow/skills/change-control.md`
- `docs/ai-workflow/skills/context-selection.md`
- `docs/ai-workflow/skills/codegraph.md`
- `docs/ai-workflow/skills/codegraph-findings-template.md`
- `docs/ai-workflow/skills/testing-verification.md`
- `docs/ai-workflow/skills/refactor-safety.md`
- Skill Layer sections from:
  - `docs/ai-workflow/intake.md`
  - `docs/ai-workflow/context.md`
  - `docs/ai-workflow/implementation-plan.md`
  - `docs/ai-workflow/execution-report.md`
- reset template updates from `scripts/ai/reset-ai-workflow.mjs`
- Skill Layer usage guidance from:
  - `docs/ai-workflow/README.md`
  - `docs/ai-workflow/prompts.md`

After migration:

- Confirm `AGENTS.md` remains the policy source of truth.
- Confirm reset templates include Task Metadata and Skill Layer sections.
- Confirm prompts tell Codex to select relevant skills and record them.
- Confirm CodeGraph is available or document the manual fallback.
