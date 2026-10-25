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

## Binding Rule on Failure (MUST)

When a test generated under this skill fails, this sequence is mandatory — no exceptions:

1. Use the existing failing test **only** to isolate the root cause (see `debug-playwright-test-failure`).
2. Record the reusable insight in `learnings.md` **before** regenerating.
3. Replace the test file with a **complete regeneration** from the approved spec and `learnings.md`.
4. Every statement in the regenerated test must trace back to the spec or a documented learning.
5. Re-run the regenerated test; iterate in the same way until it passes or a blocker is documented.

Prohibited by this rule: any hand edit that makes a failing test pass — including minimal fixes, selector swaps, or "restoring the previous state". That is a repair, not a regeneration, even when the diff is one line. The only permitted edits are clearly marked, temporary debug statements that are removed before regeneration.

## Binding Rule on Spec Changes (MUST)

A spec edit invalidates its test, even if the test still passes — the step comments must quote the current spec verbatim, and after any spec change they no longer do. Therefore, before committing a changed spec:

1. Discard the test and regenerate it completely from the updated spec and `learnings.md`.
2. The updated spec goes through the blocking spec review first (see `review-markdown-spec`).
3. Re-run the regenerated test; the commit only contains spec and regenerated test together.

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
