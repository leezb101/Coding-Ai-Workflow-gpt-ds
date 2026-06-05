# Testing and Verification Skill

## Purpose

Use this skill to make every implementation verifiable and to prevent untested changes from being treated as complete.

## When to Use

Use this skill for every implementation task.

## Verification Strategy

Choose the smallest relevant verification first, then escalate if needed.

For Node / frontend projects, prefer existing scripts such as:

- npm run lint
- npm run typecheck
- npm run test
- npm run build

For Flutter projects, prefer:

- flutter analyze
- flutter test
- flutter run on the relevant device or simulator when manual UI verification is required

For documentation or workflow-only changes, use:

- file existence checks
- search checks such as rg
- node --check for JavaScript scripts
- git diff or git status review

## Required Outputs

Before implementation, update `docs/ai-workflow/implementation-plan.md` with:

- verification commands
- manual checks if needed
- expected pass criteria

After implementation, update `docs/ai-workflow/execution-report.md` with:

- commands run
- command results
- manual checks performed
- failures and fixes
- verification limitations

## Rules

1. Prefer project-defined commands over invented commands.
2. If no verification command exists, say so clearly.
3. If verification fails, attempt a focused fix only if the cause is clear.
4. Do not hide failed verification.
5. Do not claim success if verification was not run.
6. For UI/browser/simulator tasks, include manual verification steps.
