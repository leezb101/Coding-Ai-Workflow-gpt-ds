import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const WORKFLOW_DIR = path.join(ROOT, "docs", "ai-workflow");

const templates = {
  "intake.md": `# AI Workflow Intake

## Task Metadata

- Task ID: TODO
- Original Request: TODO
- Generated At: TODO
- Workflow Stage: TODO

## Original Request

TODO: Paste the user's original natural language request here.

## Task Classification

- Type: TODO
- Name: TODO
- Confidence: TODO

Available types:

- A: Simple Implementation Task
- B: Complex Reasoning Task
- C: Visual / UI / PDF / Browser Task
- D: High-Risk Refactor Task
- E: Mixed Task

## Risk Level

- TODO: Low / Medium / High

## Needs Visual Analysis

- TODO: Yes / No

## Needs DeepSeek Plan

- TODO: Yes / No

## Can Modify Code Immediately

- TODO: Yes / No

## Selected Skills

- TODO

## Skill Rationale

TODO: Explain why these skills were selected or not selected.

## Recommended Workflow

TODO: Describe the recommended workflow path for this task.

## Required Workflow Files

TODO: List the workflow files required for this task.

## DeepSeek Recommendation

- Recommended: TODO: Yes / No
- Reason: TODO
- What DeepSeek should analyze: TODO
- Required input files:
  - TODO

## Next Action

TODO: Describe the next action Codex should take.
`,

  "task.md": `# Task

## Task Metadata

- Task ID: TODO
- Original Request: TODO
- Generated At: TODO
- Workflow Stage: TODO

## Goal

TODO: Describe the goal of the current task.

## Original Request

TODO: Paste the user's original request.

## Constraints

TODO: List constraints, such as:
- Do not introduce new dependencies
- Preserve existing behavior
- Prefer minimal changes
- Avoid broad rewrites

## Acceptance Criteria

TODO: Define how we know the task is completed.

## Out of Scope

TODO: List what should not be changed.
`,

  "context.md": `# Project Context

## Task Metadata

- Task ID: TODO
- Original Request: TODO
- Generated At: TODO
- Workflow Stage: TODO

## Relevant Files

TODO: List files that are relevant to the task.

## Selected Skills

- TODO

## Context Selection Notes

TODO: Explain how relevant files were selected and why unrelated files were excluded.

## CodeGraph Findings

### CodeGraph Status

TODO: Available / Unavailable / Not Needed

### Entry Points

TODO

### Relevant Callers

TODO

### Relevant Callees

TODO

### Dependency / Data Flow Summary

TODO

### Selected Files

TODO

### Excluded Files

TODO

### Confidence Level

TODO: High / Medium / Low

## Current Behavior

TODO: Summarize the current behavior.

## Expected Behavior

TODO: Summarize the expected behavior.

## Existing Architecture Notes

TODO: Summarize relevant architecture, data flow, component structure, or configuration.

## Suspected Problem Areas

TODO: List possible files, modules, or logic that may need attention.

## Verification Commands

TODO: List relevant commands, such as:
- npm run lint
- npm run test
- npm run build
- flutter analyze
- flutter test

## Code Snippets for External Reasoning

TODO: Paste only the most relevant code snippets if this file will be sent to DeepSeek.
`,

  "vision-spec.md": `# Vision / UI / PDF / Browser Specification

## Task Metadata

- Task ID: TODO
- Original Request: TODO
- Generated At: TODO
- Workflow Stage: TODO

## Source

TODO: Describe the visual source:
- Screenshot
- Browser page
- PDF
- UI design
- Error dialog
- Other

## Visual Structure

TODO: Describe what is visible.

## Observed Problem

TODO: Describe the visual or document-related problem.

## Expected Result

TODO: Describe the expected visual or document-derived result.

## Relevant UI Elements

TODO: List relevant UI elements, components, panels, buttons, dialogs, forms, charts, etc.

## Possible Code Areas

TODO: List possible files or modules related to the visual issue.

## Acceptance Criteria

TODO: Define how the visual/PDF/browser-derived task should be verified.

## Uncertainties

TODO: List anything unclear or requiring confirmation.
`,

  "deepseek-plan.md": `# DeepSeek Plan

## Task Metadata

- Task ID: TODO
- Original Request: TODO
- Generated At: TODO
- Workflow Stage: TODO

## Input Summary

TODO: Summarize the task, context, and vision spec given to DeepSeek.

## Problem Analysis

TODO: DeepSeek analysis goes here.

## Recommended Approach

TODO: Recommended implementation approach.

## Files to Modify

TODO: List files likely needing modification.

## Step-by-Step Plan

TODO: Provide ordered implementation steps.

## Key Code Suggestions

TODO: Include key snippets or pseudocode only where helpful.

## Risks

TODO: List risks and assumptions.

## Codex Desktop Execution Prompt

TODO: Final prompt that can be given to Codex Desktop for implementation.
`,

  "implementation-plan.md": `# Implementation Plan

## Task Metadata

- Task ID: TODO
- Original Request: TODO
- Generated At: TODO
- Workflow Stage: TODO

## Based On

TODO: List source files used:
- intake.md
- task.md
- context.md
- vision-spec.md
- deepseek-plan.md

## Selected Skills

- TODO

## Codebase Reality Check

TODO: Compare the plan against the actual project files.

## Implementation Strategy

TODO: Describe the actual strategy Codex will follow.

## Files to Change

TODO: List files to be changed.

## Safe Change Boundary

### Files Allowed to Change

TODO

### Files Not Allowed to Change

TODO

### Behavior That Must Be Preserved

TODO

### Rollback Strategy

TODO

## Impact Analysis

### Affected Callers

TODO

### Affected Callees

TODO

### Shared Components

TODO

### Risky Dependencies

TODO

## Steps

TODO: List small ordered steps.

## Verification Plan

TODO: List commands and manual checks.

## Rollback Notes

TODO: Describe how to revert or isolate the change if needed.
`,

  "execution-report.md": `# Execution Report

## Task Metadata

- Task ID: TODO
- Original Request: TODO
- Generated At: TODO
- Workflow Stage: TODO

## Task Summary

TODO: Summarize what was requested.

## Files Changed

TODO: List changed files.

## Key Decisions

TODO: Summarize important implementation choices.

## Skill Usage

### Selected Skills

TODO

### Skill Compliance Notes

TODO: Describe how the selected skills were followed.

## Change Boundary Result

### Planned Files

TODO

### Actual Files Changed

TODO

### Deviations

TODO: Explain any deviation from the planned boundary.

## Commands Run

TODO: List commands run and results.

## Verification Result

TODO: Describe whether verification passed or failed.

## Remaining Risks

TODO: List remaining risks, limitations, or follow-up items.
`,
};

async function main() {
  await fs.mkdir(WORKFLOW_DIR, { recursive: true });

  console.warn("Warning: reset will overwrite current workflow scratch files.");
  console.warn("Preserved files: AGENTS.md, docs/ai-workflow/README.md, docs/ai-workflow/prompts.md, docs/ai-workflow/workflow-review-report.md.");

  const resetFiles = [];

  for (const [fileName, content] of Object.entries(templates)) {
    const filePath = path.join(WORKFLOW_DIR, fileName);
    await fs.writeFile(filePath, content, "utf8");
    resetFiles.push(path.relative(ROOT, filePath));
  }

  console.log("AI workflow files reset:");
  for (const file of resetFiles) {
    console.log(`- ${file}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
