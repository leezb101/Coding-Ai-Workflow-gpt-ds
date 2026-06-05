# AI Workflow Architecture Review Report

## Executive Summary

The current AI workflow mechanism is useful and mostly coherent, but it has grown into a multi-source process contract spread across `AGENTS.md`, `docs/ai-workflow/README.md`, `docs/ai-workflow/prompts.md`, generated workflow state files, and two scripts under `scripts/ai/`. The most important risk is stale workflow state: `deepseek-plan.mjs` always reads `vision-spec.md`, `AGENTS.md` says to read `deepseek-plan.md` if it exists, and reset behavior can overwrite report artifacts. These behaviors are workable in controlled simulations, but in real tasks they can cause Codex or DeepSeek to reason from previous-task context. The highest-value improvement is to make `AGENTS.md` the explicit policy source of truth, add freshness guards to workflow files and scripts, and clarify the staged handoff from intake to context preparation, DeepSeek planning, implementation planning, implementation, and reporting.

## Source of Truth Recommendation

Recommended source-of-truth hierarchy:

1. `AGENTS.md` should be the authoritative policy document.
   It already defines the project agent role, task taxonomy, workflow files, DeepSeek handling rules, and verification/reporting expectations. It should remain concise and normative.

2. `docs/ai-workflow/README.md` should be the human-facing guide.
   It should explain the workflow in user-friendly language and point back to `AGENTS.md` when policy details matter. It should not introduce rules that diverge from `AGENTS.md`.

3. `docs/ai-workflow/prompts.md` should be a prompt cookbook.
   It should contain copy-paste prompts that implement the policy and guide, not a separate policy layer.

4. `scripts/ai/*.mjs` should enforce the policy mechanically where possible.
   `deepseek-plan.mjs` should validate inputs before calling DeepSeek, and `reset-ai-workflow.mjs` should make destructive reset behavior explicit.

5. `docs/ai-workflow/*.md` state files should be task-scoped artifacts.
   They should not be treated as durable policy files. They need freshness markers or reset discipline so stale context cannot be mistaken for current context.

## Duplications

- Task classification and workflow sequencing are duplicated across `AGENTS.md`, `README.md`, and `prompts.md`.
  This is acceptable only if `README.md` and `prompts.md` explicitly mirror `AGENTS.md`. Today the duplication increases maintenance risk because each file describes DeepSeek and planning steps with different wording and emphasis.

- DeepSeek instructions are repeated in `AGENTS.md`, `README.md`, `prompts.md`, and the prompt embedded in `scripts/ai/deepseek-plan.mjs`.
  This is useful for discoverability, but any policy change must be updated in four places. The script prompt also encodes behavior that users may not see from the docs.

- Required workflow files are listed in several places.
  `AGENTS.md` lists required files by task type. `README.md` and `prompts.md` also list files for complex, visual, and DeepSeek-prep tasks. Minor differences in these lists can make Codex appear to violate one document while following another.

- Visual workflow guidance is duplicated in `AGENTS.md`, `README.md`, and `prompts.md`.
  `AGENTS.md` treats DeepSeek plans as conditional advisory inputs, while `README.md` often presents DeepSeek as the default next step for visual tasks. The user-facing guide should clarify that DeepSeek is recommended only when intake says it is useful.

- Templates are duplicated in `reset-ai-workflow.mjs` and the expected structures described by `AGENTS.md` and docs.
  This means changes to workflow file structure require updating both documentation and reset templates.

## Conflicts

- Complex task staging is not consistently expressed.
  `AGENTS.md` lists complex task steps through `implementation-plan.md`, implementation, and `execution-report.md`, while `README.md` splits the flow into context preparation, DeepSeek execution, then a later Codex implementation prompt. These are compatible, but the staged boundary is clearer in `README.md` than in `AGENTS.md`.

- Existing `deepseek-plan.md` handling is risky.
  `AGENTS.md` says to read `docs/ai-workflow/deepseek-plan.md` if it exists before implementation. It does not require checking whether that plan belongs to the current task. In this workspace, `deepseek-plan.md` may be a template or prior-task artifact, so "if exists" is not sufficient.

- `deepseek-plan.mjs` always includes `vision-spec.md`.
  The script reads `intake.md`, `task.md`, `context.md`, and `vision-spec.md` for every DeepSeek call. For non-visual tasks, `vision-spec.md` can contain stale visual content from an unrelated previous task. The current architecture review context correctly warns about this, but the script does not enforce it.

- Visual DeepSeek guidance differs between docs.
  `README.md` visual workflow says to run DeepSeek after creating `vision-spec.md`, while `AGENTS.md` frames DeepSeek as an advisory plan to read if present. `prompts.md` asks whether DeepSeek is recommended. The policy should consistently say visual tasks do not automatically require DeepSeek.

- Reset behavior conflicts with report semantics.
  `AGENTS.md` treats `execution-report.md` as the final implementation record. `reset-ai-workflow.mjs` overwrites `execution-report.md` with a template without archiving or warning beyond printing reset files. That is operationally useful but unsafe if reports are meant to be retained.

- `README.md` contains a smoke-test section.
  The appended `Workflow Smoke Test` section is not workflow policy. It is harmless as test evidence, but it weakens the guide as a canonical reference.

## Omissions

- No task freshness marker.
  The workflow files do not include a shared task id, timestamp, or original-request hash. There is no mechanical way to prove that `intake.md`, `task.md`, `context.md`, `vision-spec.md`, and `deepseek-plan.md` belong to the same task.

- No stale optional file policy.
  There is no rule for clearing or ignoring `vision-spec.md` when a non-visual task is prepared for DeepSeek.

- No stale DeepSeek plan policy.
  There is no explicit rule requiring Codex to verify that `deepseek-plan.md` matches current intake before using it.

- No preflight validator.
  `deepseek-plan.mjs` only warns when all four inputs look template-only. It does not warn when one optional input is stale, when required files have mismatched task metadata, or when `context.md` is under-specified.

- No retention policy for execution reports and plans.
  The docs do not say whether `deepseek-plan.md`, `implementation-plan.md`, and `execution-report.md` are disposable per-task scratch files or historical artifacts that should be archived.

- No dedicated process-review classification.
  `AGENTS.md` has Complex Reasoning and High-Risk Refactor, but architecture/process audits like this one do not fit cleanly. They are high-risk in governance terms, but not refactors until implementation is requested.

- No standardized context audience marker.
  `context.md` does not have a required field indicating whether it is for Codex-only planning, DeepSeek input, visual implementation, or final execution.

## Misuse Risks

- DeepSeek may receive unrelated visual context.
  Because `deepseek-plan.mjs` always includes `vision-spec.md`, a non-visual architecture review can accidentally include a stale dropdown visual spec.

- Codex may follow an old DeepSeek plan.
  If `deepseek-plan.md` exists from a previous task, `AGENTS.md` tells Codex to read it before implementation, but not to validate freshness.

- Users may treat all docs as equally authoritative.
  If `AGENTS.md`, `README.md`, and `prompts.md` diverge, users may paste prompts that conflict with the actual project policy.

- Reset can remove useful history.
  `reset-ai-workflow.mjs` overwrites plans and reports. A user starting a new task may unintentionally erase the only written record of the previous implementation.

- Simple tasks can inherit stale context.
  If users do not run reset, `context.md`, `vision-spec.md`, and `execution-report.md` can remain from earlier tasks and mislead later planning.

- Visual tasks may overuse DeepSeek.
  The guide can be read as "visual task means run DeepSeek." For many visual bugs, local screenshot/browser inspection plus code reading is enough.

- Complex tasks may skip implementation-plan adaptation.
  If users stop after generating `deepseek-plan.md`, they may ask Codex to implement directly without the required codebase reality check.

## Prioritized Improvement Suggestions

1. Add task identity metadata to workflow state files.
   Add a small header to `intake.md`, `task.md`, `context.md`, `vision-spec.md`, and `deepseek-plan.md`, such as `Task ID`, `Original Request`, and `Generated At`. Use the same id across related files.

2. Add DeepSeek preflight validation.
   Update `deepseek-plan.mjs` to warn or fail when task ids mismatch, required files are template-heavy, or `vision-spec.md` is non-empty while intake says visual analysis is not needed.

3. Include `vision-spec.md` conditionally.
   For non-visual tasks, the script should either omit `vision-spec.md` or include an explicit "not applicable" marker instead of stale content.

4. Clarify `deepseek-plan.md` freshness in `AGENTS.md`.
   Change "if `deepseek-plan.md` exists, read it" into "read it only if it matches the current task metadata; otherwise treat it as stale."

5. Align staged workflow wording.
   Make all docs describe the same sequence:
   intake -> task/context -> optional vision-spec -> optional DeepSeek -> implementation-plan -> implementation -> execution-report.

6. Make `AGENTS.md` explicitly authoritative.
   Add a short rule in `README.md` and `prompts.md`: "If this guide conflicts with `AGENTS.md`, follow `AGENTS.md`."

7. Add a report retention policy.
   Decide whether `execution-report.md` is disposable scratch or durable history. If durable, modify reset behavior to archive or require confirmation before overwriting.

8. Add a workflow-review subtype.
   Document process and architecture reviews as a subtype of Complex Reasoning Task, with no business-code modification during review stages.

9. Remove or relocate smoke-test content from `README.md`.
   Move test evidence to a separate smoke-test report or leave it only in execution history.

10. Keep prompt cookbook minimal.
   `prompts.md` should avoid re-explaining policy. It should provide prompts that reference `AGENTS.md` and required files.

## Proposed Workflow Stages

```text
1. Intake
   - Create/update intake.md.
   - Classify task, risk, visual need, DeepSeek need, direct implementation permission.
   - Assign task metadata.

2. Task Definition
   - Create/update task.md.
   - Record goal, constraints, scope, acceptance criteria, out-of-scope items.

3. Context Preparation
   - Create/update context.md.
   - Include relevant files, architecture notes, suspected areas, verification plan.
   - Mark whether context is for Codex-only planning or DeepSeek.

4. Visual Specification, if needed
   - Create/update vision-spec.md only for visual/browser/PDF/UI tasks.
   - Otherwise mark it not applicable or exclude it from DeepSeek input.

5. DeepSeek Planning, if recommended
   - Run deepseek-plan.mjs only after preflight passes.
   - Generate deepseek-plan.md.
   - Treat output as advisory.

6. Codex Reality Check
   - Read intake/task/context/optional vision/deepseek-plan.
   - Compare plan against real files.
   - Create/update implementation-plan.md before code changes.

7. Implementation
   - Make minimal scoped edits.
   - Do not modify unrelated files.

8. Verification
   - Run smallest relevant verification first.
   - Escalate to broader checks when warranted.

9. Execution Report
   - Create/update execution-report.md after implementation.
   - Record files changed, decisions, commands, results, and remaining risks.

10. Reset or Archive
   - Before a new task, either reset scratch files or archive prior task artifacts.
   - Never silently reuse stale task artifacts.
```
