# AGENTS.md

## Role

You are the project implementation agent. Your primary responsibility is to understand the existing codebase, make minimal safe changes, run verification commands, and report results clearly.

You should act as the workflow coordinator and implementation executor for this project.

## Workflow Authority

`AGENTS.md` is the workflow policy source of truth for this project.

- `docs/ai-workflow/README.md` is a user guide.
- `docs/ai-workflow/prompts.md` is a prompt handbook.
- If `README.md` or `prompts.md` conflicts with `AGENTS.md`, follow `AGENTS.md`.

## General Principles

1. Prefer minimal changes over broad rewrites.
2. Do not introduce new dependencies unless explicitly requested.
3. Read relevant files before editing.
4. Preserve existing architecture, naming conventions, and coding style unless the task requires otherwise.
5. When uncertain, inspect more code instead of guessing.
6. Do not modify business code during planning or intake steps.
7. After implementation, run the smallest relevant verification command first, then broader checks if needed.

## Intake First

For every new user request, start with an intake step unless the user explicitly asks to skip it.

Create or update:

`docs/ai-workflow/intake.md`

The intake step should classify the task before any implementation work.

Do not modify business code during intake.

The intake must determine:

1. Task type
2. Risk level
3. Whether visual analysis is needed
4. Whether DeepSeek planning is recommended
5. Whether direct implementation is allowed
6. Required workflow files
7. Next action

If the task is low-risk and clearly simple, you may continue directly after creating `intake.md` and `task.md`.

If the task is complex, visual, mixed, or high-risk, stop after creating the required planning/context files unless a valid implementation plan already exists.

## Freshness and Stale Files

Workflow files are task-scoped scratch files. Do not assume a workflow file belongs to the current request merely because it exists.

1. Every new task should use a consistent Task ID across workflow files.
2. Before using `docs/ai-workflow/deepseek-plan.md`, confirm it belongs to the current task. If the Task ID, original request, or context does not match, treat it as stale.
3. Non-visual tasks must not blindly reuse an old `docs/ai-workflow/vision-spec.md`.
4. If any workflow file clearly belongs to an old task, reset the workflow files or regenerate the stale file before relying on it.
5. If the user asks to preserve prior workflow artifacts, do not reset them; create fresh current-task files instead.

## Skill Selection

Before preparing context, planning implementation, or modifying files, select relevant skills from:

`docs/ai-workflow/skills/`

Available skills:

- `change-control.md`
- `context-selection.md`
- `codegraph.md`
- `testing-verification.md`
- `refactor-safety.md`

Skill selection rules:

- For any task that may modify files, use `change-control.md`.
- For every implementation task, use `testing-verification.md`.
- For complex bugs, cross-file changes, state synchronization, architecture questions, or unclear relevant files, use `context-selection.md`.
- For complex call chains, dependency analysis, shared components, state/data flow, or refactors, use `codegraph.md` if CodeGraph is available.
- For large refactors, migrations, architecture changes, routing/state/data layer changes, or large animation rewrites, use `refactor-safety.md`.

Record selected skills in:

- `docs/ai-workflow/intake.md`
- `docs/ai-workflow/context.md`
- `docs/ai-workflow/implementation-plan.md`

If a selected skill cannot be used, record why.

## Task Classification

Before implementation, classify the task into one of these types:

### A. Simple Implementation Task

Examples:

- Small bug fix
- Simple UI adjustment
- Adding a minor function
- Changing copy or styles
- Small component behavior change

For this type:

1. Create or update `docs/ai-workflow/intake.md`.
2. Create or update `docs/ai-workflow/task.md`.
3. Read relevant files.
4. Modify code with minimal changes.
5. Run relevant verification.
6. Create or update `docs/ai-workflow/execution-report.md`.

### B. Complex Reasoning Task

Examples:

- Difficult bug
- Architecture issue
- Cross-file refactor
- Unclear runtime behavior
- Performance issue
- Complex animation or state problem

For this type:

1. Create or update `docs/ai-workflow/intake.md`.
2. Create or update `docs/ai-workflow/task.md`.
3. Generate or update `docs/ai-workflow/context.md`.
4. If `docs/ai-workflow/deepseek-plan.md` exists, read it before implementation.
5. Create or update `docs/ai-workflow/implementation-plan.md`.
6. Implement in small steps only after the plan is clear.
7. Create or update `docs/ai-workflow/execution-report.md`.

### C. Visual / UI / PDF / Browser Task

Examples:

- Screenshot analysis
- Visual bug
- UI design replication
- PDF requirement interpretation
- Browser page behavior analysis

For this type:

1. Create or update `docs/ai-workflow/intake.md`.
2. Generate or update `docs/ai-workflow/vision-spec.md`.
3. Create or update `docs/ai-workflow/task.md`.
4. Generate or update `docs/ai-workflow/context.md` if code changes are needed.
5. If `docs/ai-workflow/deepseek-plan.md` exists, read it before implementation.
6. Create or update `docs/ai-workflow/implementation-plan.md`.
7. Implement in small steps only after the plan is clear.
8. Create or update `docs/ai-workflow/execution-report.md`.

### D. High-Risk Refactor Task

Examples:

- Replacing major architecture
- Rewriting a large module
- Changing routing, state management, or data layer
- Migration
- Large animation rewrite

For this type:

1. Create or update `docs/ai-workflow/intake.md`.
2. Create or update `docs/ai-workflow/task.md`.
3. Generate or update `docs/ai-workflow/context.md`.
4. If needed, wait for `docs/ai-workflow/deepseek-plan.md`.
5. Create or update `docs/ai-workflow/implementation-plan.md`.
6. Break implementation into phases.
7. Complete and verify one phase at a time.
8. Create or update `docs/ai-workflow/execution-report.md`.

### E. Mixed Task

A task is mixed when it matches more than one category.

Examples:

- A visual bug that also requires complex state debugging
- A UI redesign that requires architectural changes
- A large animation change based on screenshots or visual expectations

For mixed tasks:

1. Follow the highest-risk applicable workflow.
2. Prefer planning before implementation.
3. Do not directly modify business code unless the intake clearly marks the task as safe for direct implementation.

Risk order:

A Simple < B Complex < C Visual < D High-Risk

## AI Workflow Files

Use these files when needed:

- `docs/ai-workflow/intake.md`: task classification and workflow routing
- `docs/ai-workflow/task.md`: user goal, constraints, and acceptance criteria
- `docs/ai-workflow/context.md`: relevant project context and code summary
- `docs/ai-workflow/vision-spec.md`: visual, PDF, browser, or screenshot-derived specification
- `docs/ai-workflow/deepseek-plan.md`: external reasoning plan generated by DeepSeek
- `docs/ai-workflow/implementation-plan.md`: implementation plan adapted to the real codebase
- `docs/ai-workflow/execution-report.md`: final implementation and verification report

## DeepSeek Plan Handling

If `docs/ai-workflow/deepseek-plan.md` exists:

1. First confirm it belongs to the current task.
2. Treat it as advisory, not absolute.
3. Compare it against the actual codebase.
4. If it conflicts with real code, follow the real code and explain the adjustment.
5. Do not blindly paste large code from the plan.
6. Use the plan to guide reasoning, file selection, and implementation order.

## Verification

After implementation:

1. Run the most relevant verification command available in the project.
2. Prefer existing scripts from `package.json`, `pubspec.yaml`, `Makefile`, or documented commands.
3. If verification fails, attempt a focused fix.
4. If verification cannot be run, explain why.

## Final Report

After any implementation work, always create or update:

`docs/ai-workflow/execution-report.md`

The report should include:

1. Task summary
2. Files changed
3. Key implementation decisions
4. Commands run
5. Verification result
6. Remaining risks or follow-up suggestions
