# Context

## Task Metadata

- Task ID: 2026-06-05-flutter-state-sync-simulation
- Original Request: Simulate intake and context preparation for a complex Flutter state synchronization issue where tapping Save immediately shows success, but re-entering the page shows old data.
- Generated At: 2026-06-05 11:20:41 CST
- Workflow Stage: Context Preparation

## Selected Skills

- `change-control.md`
- `context-selection.md`
- `codegraph.md`
- `testing-verification.md`

## Context Selection Notes

The request does not name a specific page, so context was selected by searching for Flutter save/submit feedback patterns, Bloc event dispatches, repositories, API services, and persistence services.

The broad search found many submit flows. To avoid reading unrelated files, the initial focused candidate is `ProjectInitiationFormPage`, because it has a visible `保存` button and a save/update draft flow that matches the symptom shape: UI shows success, then page exits, and re-entering reloads details from the backend.

This is a candidate investigation path, not a confirmed affected page. For a real bug, the next context pass should start from the exact route, Save button, or reproduction steps.

## CodeGraph Findings

### CodeGraph Status

Available

CodeGraph was used with the query:

`ProjectInitiationBloc ProjectSaved ProjectUpdated project_initiation_form_page _saveProject updateProject addProject commitProject data flow`

### Entry Points

- `lib/pages/project_initiation/project_initiation_form_page.dart`
  - `ProjectInitiationFormPage` creates `ProjectInitiationBloc`.
  - `_saveProject()` dispatches `SaveProjectDraft` for new records and `UpdateProjectDraft` for edit mode.
  - `BlocConsumer` listener shows `ProjectInitiationSuccess.message` and then calls `context.pop()`.
- `lib/config/routes.dart`
  - Route `project-initiation` maps query parameter `projectId` into `ProjectInitiationFormPage(projectId: ...)`.

### Relevant Callers

- `_saveProject()` in `project_initiation_form_page.dart` calls:
  - `SaveProjectDraft(project: project)`
  - `UpdateProjectDraft(project: project)`
- `ProjectInitiationBloc` handles:
  - `_onSaveProjectDraft`
  - `_onUpdateProjectDraft`
  - `_onLoadProjectInitiationForm`

### Relevant Callees

- `ProjectInitiationBloc._onSaveProjectDraft()` calls `ProjectInitiationRepository.addProject()`.
- `ProjectInitiationBloc._onUpdateProjectDraft()` calls `ProjectInitiationRepository.updateProject()`.
- `ProjectInitiationRepositoryImpl.addProject()` calls `IProjectApiService.addProject()`.
- `ProjectInitiationRepositoryImpl.updateProject()` calls `IProjectApiService.updateProject()`.
- `ProjectApiServiceWrapper.addProject()` sends `project.toJson()` to Retrofit `POST /project/add`.
- `ProjectApiServiceWrapper.updateProject()` sends `project.toJson()` to Retrofit `POST /project/update`.
- Reload path:
  - `LoadProjectInitiationForm(projectId)` calls `ProjectInitiationRepository.getProjectDetail(id)`.
  - `ProjectApiServiceWrapper.getProjectDetail()` reads `GET /project/detail` and extracts `result.data!.project`.

### Dependency / Data Flow Summary

Candidate flow:

1. UI form fields are read by `_buildProjectFromForm()`.
2. The resulting `ProjectInitiation` is sent through `SaveProjectDraft` or `UpdateProjectDraft`.
3. Bloc emits loading, awaits repository/API result, then emits `ProjectInitiationSuccess` when `result.code == 0`.
4. UI displays success toast and pops the page.
5. Re-entering edit mode dispatches `LoadProjectInitiationForm(projectId)`.
6. The form reloads data from `GET /project/detail`.

Potential mismatch points:

- `_buildProjectFromForm()` may omit fields that exist on `ProjectInitiation`, such as document URL fields, if those fields can be changed elsewhere in the form.
- Success UI depends on `result.code == 0`; if the backend returns success while ignoring invalid/missing fields, the UI can show success while persisted data remains unchanged.
- The reload path depends on `GET /project/detail`; if backend update is asynchronous or detail endpoint is cached/stale, re-entry can show old data.
- Existing list/detail caches elsewhere in the project, such as `RecordsRepositoryImpl` or `TodoRepositoryImpl`, should be checked only if the affected page uses those cached paths.
- If the real page is not ProjectInitiation, the same investigation pattern should be applied to its page, Bloc/Cubit, repository, API wrapper, and reload source.

### Selected Files

- `AGENTS.md`
  - Used for workflow rules and skill selection requirements.
- `docs/ai-workflow/skills/README.md`
  - Used for skill selection rules and CodeGraph usage pattern.
- `lib/pages/project_initiation/project_initiation_form_page.dart`
  - Candidate UI entry point with `保存` button, `BlocConsumer`, success toast, navigation pop, `_saveProject()`, and `_buildProjectFromForm()`.
- `lib/bloc/project_initiation/project_initiation_bloc.dart`
  - Candidate state/event handler for loading, save, update, submit, success, and error states.
- `lib/bloc/project_initiation/project_initiation_event.dart`
  - Defines `SaveProjectDraft`, `UpdateProjectDraft`, and `LoadProjectInitiationForm`.
- `lib/bloc/project_initiation/project_initiation_state.dart`
  - Defines `ProjectInitiationSuccess`, `ProjectInitiationFormLoaded`, and error/loading states.
- `lib/repositories/interfaces/project_initiation_repository.dart`
  - Defines the repository contract for add/update/detail.
- `lib/repositories/implementations/project_initiation_repository_impl.dart`
  - Bridges Bloc calls to API service and maps Dio errors.
- `lib/services/api/interfaces/project_api_service.dart`
  - Defines Retrofit endpoints and wrapper mapping for add/update/detail.
- `lib/models/project/project_initiation.dart`
  - Defines persisted form model and `toJson()` payload structure.
- `lib/config/routes.dart`
  - Confirms candidate route wiring for `project-initiation`.

### Excluded Files

- Most unrelated pages under `lib/pages/**`
  - Excluded because the simulated request does not name those pages and the initial candidate already provides a complete save/reload chain.
- Generated API files such as most `*.g.dart`
  - Excluded except for CodeGraph confirmation of endpoint mapping; primary source files are more useful for reasoning.
- `android/**`, `ios/**`, build files, and Gradle wrapper files
  - Excluded because this is a Flutter state/persistence flow issue, not a platform build issue.
- `docs/ai-workflow/vision-spec.md`
  - Excluded because this is not a visual task.
- `docs/ai-workflow/deepseek-plan.md`
  - Excluded because DeepSeek was explicitly forbidden for this step.

### Confidence Level

Medium

The ProjectInitiation save chain is a plausible and concrete project-backed example, but the real affected page is not specified. Confidence should become High only after the user confirms the route/page or provides reproduction steps.

## Preliminary Suspected Causes

1. The UI may display success after `code == 0`, but the backend may not persist all fields because the payload is incomplete or field names do not match backend expectations.
2. The save path and reload path may use different data shapes: save sends `ProjectInitiation.toJson()`, reload reads `ProjectDetailResponse.project`.
3. The page may pop immediately after success, so users do not see whether local Bloc state was updated with the saved server representation.
4. A cache or stale detail response could rehydrate old values after navigation.
5. If the affected page uses local controllers plus Bloc state, controller update guards such as "only fill if text is empty" can hide later state updates during the same page lifetime.

## Suggested Verification Direction For Later Implementation

- Add or run focused Bloc tests around the affected save event once the real page is confirmed.
- Verify the exact request body produced by the save path.
- Verify that reload reads the updated value from the same source.
- Check whether success should require a refreshed detail response rather than only `Result<void>(code: 0)`.
- Check whether cache invalidation is needed for list/detail repositories used by the affected page.

## DeepSeek Recommendation

DeepSeek is recommended for the next planning step if the real affected page remains unclear or if multiple save flows need comparison. Do not run it in this step.
