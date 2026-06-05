# AI Workflow Prompts

This file contains reusable prompts for Codex Desktop.

These prompts are not an independent policy source. They must follow `AGENTS.md`. If any prompt conflicts with `AGENTS.md`, follow `AGENTS.md`.

## 1. Start a New Task

Use this prompt at the beginning of every new task.

    Please follow AGENTS.md.

    Do not modify business code first.

    Select relevant skills from docs/ai-workflow/skills/ according to AGENTS.md, and record selected skills in the appropriate workflow files.

    Start with the AI workflow intake step.

    Create or update:

    - docs/ai-workflow/intake.md

    My request is:

    [PASTE YOUR REQUEST HERE]

    After intake, tell me only:

    1. task type
    2. risk level
    3. whether visual analysis is needed
    4. whether DeepSeek planning is recommended
    5. whether code can be modified immediately
    6. required workflow files
    7. next action

## 2. Prepare Context for DeepSeek

Use this prompt when intake says DeepSeek planning is recommended.

    Please follow AGENTS.md.

    Do not modify business code.

    Select relevant skills from docs/ai-workflow/skills/ according to AGENTS.md, and record selected skills in the appropriate workflow files.

    Based on docs/ai-workflow/intake.md and my current request, create or update:

    - docs/ai-workflow/task.md
    - docs/ai-workflow/context.md

    If this task involves screenshots, UI, PDF, browser pages, or visual behavior, also create or update:

    - docs/ai-workflow/vision-spec.md

    The context should include:

    1. relevant files
    2. current behavior
    3. expected behavior
    4. existing architecture notes
    5. suspected problem areas
    6. verification commands
    7. focused code snippets useful for DeepSeek

    Do not implement anything yet.

    After this step, tell me whether I should run:

    node scripts/ai/deepseek-plan.mjs

## 3. Run DeepSeek Planning

Run this in terminal after context is prepared:

    export DEEPSEEK_API_KEY="your_api_key_here"
    node scripts/ai/deepseek-plan.mjs

Optional model override:

    export DEEPSEEK_MODEL="deepseek-v4-pro"
    node scripts/ai/deepseek-plan.mjs

## 4. Execute a DeepSeek Plan

Use this prompt after docs/ai-workflow/deepseek-plan.md has been generated.

    Please follow AGENTS.md.

    Read:

    - docs/ai-workflow/intake.md
    - docs/ai-workflow/task.md
    - docs/ai-workflow/context.md
    - docs/ai-workflow/vision-spec.md
    - docs/ai-workflow/deepseek-plan.md

    Treat deepseek-plan.md as advisory, not absolute.

    Select relevant skills from docs/ai-workflow/skills/ according to AGENTS.md, and record selected skills in the appropriate workflow files.

    First create or update:

    - docs/ai-workflow/implementation-plan.md

    Compare the DeepSeek plan against the real codebase.

    If the plan conflicts with actual code, follow the actual code and explain the adjustment in implementation-plan.md.

    Then implement in small safe steps.

    After implementation:

    1. run relevant verification commands
    2. fix focused issues if verification fails
    3. create or update docs/ai-workflow/execution-report.md

    Finally tell me:

    1. files changed
    2. commands run
    3. verification result
    4. remaining risks

## 5. Directly Execute a Simple Task

Use this prompt only when intake says the task is low-risk and can be modified immediately.

    Please follow AGENTS.md.

    Based on docs/ai-workflow/intake.md, create or update:

    - docs/ai-workflow/task.md

    Select relevant skills from docs/ai-workflow/skills/ according to AGENTS.md, and record selected skills in the appropriate workflow files.

    Then implement the task with minimal changes.

    Do not introduce new dependencies unless explicitly required.

    After implementation:

    1. run relevant verification commands
    2. create or update docs/ai-workflow/execution-report.md

    Finally tell me:

    1. files changed
    2. commands run
    3. verification result
    4. remaining risks

## 6. Visual / UI / PDF / Browser Intake

Use this prompt when the task includes screenshots, UI designs, browser pages, PDFs, or visual behavior.

    Please follow AGENTS.md.

    Do not modify business code.

    Select relevant skills from docs/ai-workflow/skills/ according to AGENTS.md, and record selected skills in the appropriate workflow files.

    Based on the provided screenshot, UI, PDF, browser page, or visual behavior, create or update:

    - docs/ai-workflow/intake.md
    - docs/ai-workflow/vision-spec.md

    If code changes may be needed, also create or update:

    - docs/ai-workflow/task.md
    - docs/ai-workflow/context.md

    The vision spec should include:

    1. source
    2. visual structure
    3. observed problem
    4. expected result
    5. relevant UI elements
    6. possible code areas
    7. acceptance criteria
    8. uncertainties

    Do not implement anything yet.

    After this step, tell me whether DeepSeek planning is recommended.

## 7. Reset Workflow Files

Run this in terminal when starting a completely new task and you want to clear the previous workflow files:

    node scripts/ai/reset-ai-workflow.mjs

This resets:

- intake.md
- task.md
- context.md
- vision-spec.md
- deepseek-plan.md
- implementation-plan.md
- execution-report.md

It does not reset:

- README.md
- prompts.md
- AGENTS.md

## 8. Skill-Aware Context Preparation

    Please follow AGENTS.md.

    Do not modify business code.

    Select relevant skills from:

    - docs/ai-workflow/skills/change-control.md
    - docs/ai-workflow/skills/context-selection.md
    - docs/ai-workflow/skills/codegraph.md
    - docs/ai-workflow/skills/testing-verification.md
    - docs/ai-workflow/skills/refactor-safety.md

    Based on the current intake and task, prepare or update:

    - docs/ai-workflow/context.md

    Requirements:

    1. Record selected skills.
    2. Explain why each skill was selected or not selected.
    3. Use context-selection.md to avoid reading unrelated files.
    4. Use codegraph.md if CodeGraph is available and useful.
    5. If CodeGraph is unavailable, record the fallback approach.
    6. Summarize selected files, excluded files, entry points, and suspected data/control flow.
    7. Do not implement anything.
