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
| Assertions | Add a step comment with the complete step text for every assertion block (see Step Comments) |
| Step comments | Quote the full spec step text; never truncate, shorten, or paraphrase it |
| Selectors | Prefer role, test id, label, placeholder, and visible text before technical selectors |
| Scope | Use specific containers or elements; never assert against the whole body |
| Parametrization | Generate one independent test per Markdown table row unless the project says otherwise |
| Viewport | Apply `mobile` or other viewport tags according to project convention |
| Learnings | Record new reusable app knowledge in `learnings.md` |

## Step Comments

Every step of the spec maps to exactly one comment block in the generated test. The comment carries the **entire step text verbatim**, so the test stays readable without opening the spec.

Format: `// Schritt N: <voller Schritttext aus der Spec>`

```ts
// Schritt 1: Navigiere zur Login-Seite (`/#/login`)
await page.goto('/#/login');

// Schritt 6: Verifiziere dass das Warenkorb-Symbol in der Navigationsleiste sichtbar ist
await expect(page.locator('button[aria-label="Show the shopping cart"]')).toBeVisible();
```

Rules:

- Copy the step text exactly as written in the spec: same wording, same order, same punctuation.
- Keep the step number, so `// Schritt N` references stay greppable.
- Replace `{Variablen}` placeholders with the concrete test-data values of the current table row; the comment shows what this test case actually does.
- Never reduce a step to a short label such as `// Schritt 3: Register` or `// Schritt 3` alone.
- Steps that produce several statements still get one comment carrying the full step text; place it above the first statement of that step.
- A step comment belongs above its statements, never appended behind code on the same line.

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
| Truncated or shortened step comments | Quote the complete step text from the spec, only the step number is not enough |
| Repairing an old failing test by hand | Debugging classifies the cause, then regeneration from spec and learnings produces the clean test (see `debug-playwright-test-failure`) |
