---
name: debug-playwright-test-failure
description: Use when a Playwright E2E test generated from a Markdown spec fails, flakes, times out, or produces an unexpected result
---

# Debug Playwright Test Failure

## Overview

Debug failures by identifying the true source before editing. The core principle: fix the spec when the expectation is unclear, regenerate the test from spec and learnings when the implementation is wrong, and document reusable app knowledge.

## Iron Rule: No In-Place Repairs

A failing test is **never** repaired by editing it. Whatever the cause, the diagnosed test file is discarded and the final state is always a **fresh regeneration from the current spec and `learnings.md`**. The existing test is only a diagnostic instrument.

- `SPEC` unclear/wrong → clarify the spec first, **then** regenerate anew.
- `TEST_CODE` → diagnose, discard, regenerate anew.
- `APP_UNDER_TEST` / `ENVIRONMENT` → report/document the blocker; once it is resolved, regenerate anew from the spec — never from the failed edition.

## Required Loop

1. Run the failing test with the smallest command that reproduces the failure.
2. Inspect the error, trace, screenshot, video, and relevant spec step.
3. Classify the cause as `SPEC`, `TEST_CODE`, `APP_UNDER_TEST`, or `ENVIRONMENT`.
4. Apply the matching action: clarify the spec, update `learnings.md`, or document the blocker.
5. **Regenerate the test from scratch from the (possibly updated) spec and `learnings.md`.**
6. Re-run the same test case.
7. Repeat until the test passes or the blocker is explicit.

## Cause Actions

| Cause | Action |
|-------|--------|
| `SPEC` | Clarify or correct the Markdown spec **before** regenerating the test from it |
| `TEST_CODE` | Debug the existing test only to isolate and document the root cause; after diagnosis, discard it and regenerate a clean test from the approved spec and `learnings.md` — never patch it incrementally |
| `APP_UNDER_TEST` | Report the app defect; do not mask it in the test; regenerate from the spec after the app is fixed |
| `ENVIRONMENT` | Document the missing service, dependency, or configuration; regenerate from the spec once resolved |

## Learnings Update

Update `learnings.md` when the fix reveals a reusable pattern:

- stable selector strategy,
- component-specific behavior,
- required setup or teardown,
- timing or overlay behavior,
- verified workaround.

Do not add one-off observations that future tests cannot reuse.

Record learnings **before regenerating**, so the fresh test already includes the new knowledge.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Editing selectors before reading the spec | Compare the failure to the spec step first |
| Patching a failing test piece by piece | The existing test is the diagnostic instrument; the fix is a clean regeneration from spec and learnings |
| Re-running the failed edition after a fix elsewhere | The next run always uses a freshly regenerated test, never the failed file |
| Treating every failure as flakiness | Reproduce and classify the cause |
| Swallowing errors with broad retries or catches | Wait for observable conditions or fix the root cause |
| Forgetting learnings | Capture reusable findings immediately after verification |
