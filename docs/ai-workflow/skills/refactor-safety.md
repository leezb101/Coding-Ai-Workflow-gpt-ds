# Refactor Safety Skill

## Purpose

Use this skill to keep refactors staged, reversible, and behavior-preserving unless behavior change is explicitly required.

## When to Use

Use this skill for:

- large refactors
- architecture changes
- state management changes
- routing changes
- data layer changes
- large component rewrites
- animation architecture changes
- migration tasks

## Refactor Strategy

Break refactors into phases:

1. Phase 1: Understand current behavior and boundaries.
2. Phase 2: Add or isolate new structure without removing old behavior.
3. Phase 3: Move logic in small steps.
4. Phase 4: Switch usage to the new structure.
5. Phase 5: Remove old code only after verification.
6. Phase 6: Run broader verification and document remaining risks.

## Required Outputs

When this skill is used, update `docs/ai-workflow/implementation-plan.md` with:

- refactor phases
- behavior-preservation strategy
- rollback plan
- verification per phase
- files that must not be changed in each phase

After implementation, update `docs/ai-workflow/execution-report.md` with:

- completed phases
- verification per phase
- deviations from the plan
- remaining risks

## Rules

1. Do not combine unrelated refactors.
2. Do not change behavior silently.
3. Do not delete old logic until replacement behavior is verified.
4. Prefer mechanical changes before semantic changes.
5. Stop after each phase if verification fails.
6. For high-risk refactors, do not implement without an implementation plan.
