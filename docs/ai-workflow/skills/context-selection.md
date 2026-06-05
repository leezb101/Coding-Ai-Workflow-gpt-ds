# Context Selection Skill

## Purpose

Use this skill to reduce unnecessary context reading and avoid wasting tokens on unrelated files.

## When to Use

Use this skill for:

- complex bugs
- cross-file changes
- state synchronization issues
- architecture questions
- refactors
- visual/UI tasks that may involve multiple components
- tasks where the relevant files are not obvious

Do not overuse it for:

- documentation-only changes
- one-line copy changes
- isolated style changes with an obvious file

## Context Selection Strategy

Use a layered context strategy:

1. Start from the user's request, error message, route, component name, or stack trace.
2. Identify likely entry points.
3. Read only the smallest set of relevant files first.
4. Expand to direct dependencies only when needed.
5. Expand to callers or shared components only when needed.
6. Stop expanding once the likely change boundary is clear.
7. Record why files were selected or excluded.

## Required Outputs

When this skill is used, update `docs/ai-workflow/context.md` with:

- selected skills
- entry points
- files inspected
- files selected for reasoning
- files excluded and why
- suspected data flow or control flow
- confidence level

## Rules

1. Do not read the entire project unless the task truly requires it.
2. Do not paste large unrelated files into context.md.
3. Prefer summaries and focused snippets over full file dumps.
4. If more context is needed, explain why before expanding.
5. If the task will be sent to DeepSeek, keep context focused and compact.
