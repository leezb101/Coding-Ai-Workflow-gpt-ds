# CodeGraph Findings Template

Use this template when CodeGraph or a similar dependency/call graph tool is used during context preparation.

The goal is to summarize only task-relevant graph findings, not to dump the full graph.

## Task Metadata

- Task ID: TODO
- Original Request: TODO
- Generated At: TODO
- Workflow Stage: Context Preparation / Impact Analysis

## CodeGraph Status

- Status: TODO: Available / Unavailable / Not Needed
- Tool Used: TODO
- Query Method: TODO
- Fallback If Unavailable: TODO

## Entry Points

List the smallest likely entry points for the task.

- TODO

## Relevant Callers

List only callers that matter for this task.

- TODO

## Relevant Callees

List only callees that matter for this task.

- TODO

## Dependency Path Summary

Summarize the relevant dependency path in a compact form.

Example:

`Page -> Controller/Cubit -> Repository -> API/Cache`

Actual summary:

TODO

## State / Data Flow Summary

Summarize how state or data appears to move through the relevant path.

TODO

## Selected Files

Files selected for reasoning or implementation planning.

- TODO

## Excluded Files

Files intentionally excluded to reduce context noise.

- TODO

## Shared Components or APIs

List shared components, public APIs, generated files, or common utilities that may be affected.

- TODO

## Risky Dependencies

List dependencies that increase risk or require extra verification.

- TODO

## Safe Change Boundary Hint

Describe the likely safe change boundary based on graph findings.

TODO

## Confidence Level

- TODO: High / Medium / Low

## Notes for context.md

Provide a compact version suitable for `docs/ai-workflow/context.md`.

TODO

## Notes for implementation-plan.md

Provide a compact version suitable for `docs/ai-workflow/implementation-plan.md`.

TODO
