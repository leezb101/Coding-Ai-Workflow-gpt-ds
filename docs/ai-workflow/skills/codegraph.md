# CodeGraph Skill

## Purpose

Use CodeGraph or similar dependency/call graph tools to narrow context, identify relevant call paths, and reduce unnecessary token usage.

## When to Use

Use this skill when the task involves:

- complex bugs
- unclear entry points
- cross-file behavior
- state synchronization
- shared components
- refactoring
- API, repository, service, or cache interactions
- Flutter BLoC, Cubit, Provider, Riverpod, GetX, or similar state flows
- frontend component trees and event propagation

Do not use it for:

- simple copy changes
- obvious one-file style fixes
- documentation-only changes
- tasks where the relevant file is already certain

## How to Use

1. Identify likely entry points from the request, route, component, error, or stack trace.
2. Use CodeGraph to inspect direct dependencies.
3. Use CodeGraph to inspect callers when changing shared code.
4. Use CodeGraph to identify state/data flow where relevant.
5. Summarize only the task-relevant graph findings.
6. Use graph findings to define a safe change boundary.

## Required Outputs

When this skill is used, update `docs/ai-workflow/context.md` with:

- CodeGraph entry points
- relevant callers
- relevant callees
- relevant dependency path
- suspected state/data flow
- selected files
- excluded files
- confidence level

Before implementation, update `docs/ai-workflow/implementation-plan.md` with:

- affected callers
- affected callees
- shared components
- risky dependencies
- safe change boundary

## Findings Template

When CodeGraph is used, summarize results using:

`docs/ai-workflow/skills/codegraph-findings-template.md`

Use the template to produce compact findings for:

- `docs/ai-workflow/context.md`
- `docs/ai-workflow/implementation-plan.md`

Do not paste full graph output into workflow files.

## Rules

1. Use CodeGraph to narrow context, not expand it blindly.
2. Never paste the full graph into workflow files.
3. Prefer short call-chain summaries.
4. If CodeGraph results conflict with actual code, trust actual code.
5. If CodeGraph is unavailable, continue with manual context selection and state that CodeGraph was unavailable.
