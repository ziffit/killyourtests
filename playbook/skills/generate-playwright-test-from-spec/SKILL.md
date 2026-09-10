---
name: generate-playwright-test-from-spec
description: Use when creating or updating a Playwright E2E test from an approved Markdown spec
---

# Generate Playwright Test From Spec

## Overview

Generate Playwright tests only from reviewed Markdown specs. The core principle: the test code implements the spec and stays traceable to it.

## Preconditions

- The spec review verdict is `APPROVED`.
- `learnings.md` has been read.
- The project test fixture, test directory, and verification command are known.

## Generation Rules

| Area | Rule |
|------|------|
| Source of truth | Preserve the spec behavior; do not invent extra behavior |
| Fixture | Use the project-specific fixture if one exists |
| Assertions | Add `// Schritt N` or equivalent step references for each assertion block |
| Selectors | Prefer role, test id, label, placeholder, and visible text before technical selectors |
| Scope | Use specific containers or elements; never assert against the whole body |
| Parametrization | Generate one independent test per Markdown table row unless the project says otherwise |
| Viewport | Apply `mobile` or other viewport tags according to project convention |
| Learnings | Record new reusable app knowledge in `learnings.md` |

## Selector Priority

1. `page.getByRole()` or `page.getByTestId()`
2. `page.getByLabel()` or `page.getByPlaceholder()`
3. `page.getByText()`, `locator(':has-text()')`, or `filter()`
4. Stable IDs
5. Semantic locators with surrounding context

## Completion Criteria

Run the smallest test command that covers the generated test. The task is complete only when the test passes or an external blocker is documented.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Generating from an unapproved spec | Stop and review the spec first |
| Combining unrelated setup inside test steps | Extract reusable setup only when the project already uses that pattern |
| Using broad assertions | Target the smallest stable element that proves the expectation |
| Hiding flaky behavior with arbitrary waits | Prefer observable conditions and document verified app quirks |
