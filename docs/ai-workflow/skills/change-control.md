# Change Control Skill

## Purpose

Use this skill to keep implementation changes small, intentional, reviewable, and reversible.

## When to Use

Use this skill for every task that may modify files.

## Rules

1. Prefer minimal changes over broad rewrites.
2. Do not introduce new dependencies unless explicitly required.
3. Do not perform unrelated cleanup, formatting, or refactoring.
4. Do not rename files, functions, classes, or public APIs unless the task requires it.
5. Before implementation, identify the intended change boundary.
6. During implementation, modify only files needed for the task.
7. If a broader change appears necessary, stop and update the implementation plan first.
8. If generated or lock files change unexpectedly, explain why or revert them.
9. Keep behavior unchanged unless the task explicitly requires behavior change.
10. When uncertain, inspect more code rather than guessing.

## Required Outputs

When this skill is used, record the following in `docs/ai-workflow/implementation-plan.md`:

- intended files to change
- files that must not be changed
- safe change boundary
- rollback notes

After implementation, record in `docs/ai-workflow/execution-report.md`:

- actual files changed
- any deviation from the planned change boundary
- reason for each deviation
