---
name: debug-playwright-test-failure
description: Use when a Playwright E2E test generated from a Markdown spec fails, flakes, times out, or produces an unexpected result
---

# Debug Playwright Test Failure

## Overview

Debug failures by identifying the true source before editing. The core principle: fix the spec when the expectation is unclear, fix the test when the implementation is wrong, and document reusable app knowledge.

## Required Loop

1. Run the failing test with the smallest command that reproduces the failure.
2. Inspect the error, trace, screenshot, video, and relevant spec step.
3. Classify the cause as `SPEC`, `TEST_CODE`, `APP_UNDER_TEST`, or `ENVIRONMENT`.
4. Apply the matching action.
5. Re-run the same test.
6. Repeat until the test passes or the blocker is explicit.

## Cause Actions

| Cause | Action |
|-------|--------|
| `SPEC` | Clarify or correct the Markdown spec before changing test code |
| `TEST_CODE` | Fix selectors, waits, assertions, or flow logic |
| `APP_UNDER_TEST` | Report the app defect; do not mask it in the test |
| `ENVIRONMENT` | Document the missing service, dependency, or configuration |

## Learnings Update

Update `learnings.md` when the fix reveals a reusable pattern:

- stable selector strategy,
- component-specific behavior,
- required setup or teardown,
- timing or overlay behavior,
- verified workaround.

Do not add one-off observations that future tests cannot reuse.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Editing selectors before reading the spec | Compare the failure to the spec step first |
| Treating every failure as flakiness | Reproduce and classify the cause |
| Swallowing errors with broad retries or catches | Wait for observable conditions or fix the root cause |
| Forgetting learnings | Capture reusable findings immediately after verification |
