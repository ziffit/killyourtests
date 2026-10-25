---
name: generate-playwright-test-from-spec
description: Use when creating, updating, fixing, repairing, or adjusting a Playwright E2E test - covering test failures, spec changes, and user requests such as "fix the test", "make it pass", or "adapt the test to the spec". The existing test file is always replaced by a complete regeneration, never edited in place.
---

# Generate Playwright Test From Spec

## Overview

Generate Playwright tests only from reviewed Markdown specs. The core principle: the test code implements the spec and stays traceable to it.

## Preconditions

- The spec review verdict is `APPROVED`.
- `learnings.md` has been read.
- The project test fixture, test directory, and verification command are known.

## Regeneration-Only Rule (MUST)

An existing generated test file is **never** edited by hand. Whatever the trigger, the final state is a complete regeneration from the current spec and `learnings.md`. The triggers cover exactly these situations:

| Trigger | Action |
|---------|--------|
| User asks to fix, repair, adjust, or make a test pass (e.g. "fix the test", "Fehler beseitigen", "passe den Test an") | Complete regeneration |
| Test failure | Debug first (see `debug-playwright-test-failure`), then complete regeneration |
| Spec change - even a single step | Blocking spec review first (see `review-markdown-spec`), then complete regeneration |
| Step comments no longer quote the current spec verbatim | Complete regeneration |

Mandatory sequence: diagnose, record the insight in `learnings.md`, then overwrite the whole test file from the current spec, then re-run. While diagnosing a failure, clearly marked temporary debug statements are permitted; they are removed before regeneration. Every statement of the regenerated test traces back to the current spec or a documented learning.

Forbidden rationalizations - if you notice one of these appearing while reasoning about the change, you are about to violate this rule:

| Rationalization | Verdict |
|-----------------|---------|
| "It's only a minimal / one-line change" | Repair. A one-line edit turns the file into a hand-edited mix; regenerate. |
| "The unaffected steps stay as they are" | There is no unaffected remainder. The file is one unit; replacing only part of it is impossible. |
| "The test itself still passes" | It passes against the outdated expectation and is stale after a spec change; regenerate. |
| "The user explicitly asked to fix the test" | The request means: bring the test back in sync - the path is a regeneration, communicated to the user as such upfront. |
| "The spec only changed at the end" | Location and size of the spec change do not matter; the regeneration covers the full file. |

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
