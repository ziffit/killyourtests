# Agent Instructions

This file defines the binding project rules for AI agents and humans working on Markdown-First E2E testing in this repository.

## Project context

MarkupPlayRight generates Playwright tests from human-readable Markdown specifications.

- `specs/*.spec.md` is the business source of truth.
- `tests/*.test.ts` is generated Playwright code and stays traceable to the spec.
- `learnings.md` collects app-specific patterns, selectors, and pitfalls.
- Learning entries are always general: no references to concrete specs or tests (IDs, file names, or test names).
- `playbook/` contains the reusable core for other projects.

## Fundamental spec rules

Specs are written like navigation instructions for human testers.

- Write steps in the imperative: "Click on ...", "Navigate to ...", "Enter ...".
- Do not use technical selectors in specs: no CSS classes, IDs, or `aria-label`.
- Describe UI elements by context, position, visible text, and purpose.
- Each line contains exactly one logical user-level step.
- Strictly separate action and verification into distinct steps.
- Verifications state the concrete expectation: what is visible and where.
- Test data must be explicit; no placeholders such as "valid address".
- Every spec needs at least one viewport tag: `desktop` or `mobile`.

## Spec ID and file naming

Every spec owns exactly one unique ID. The ID lives in the YAML frontmatter and in the file name; the heading carries only the title.

```markdown
---
id: PROJ-0001
tags: [regression, fast, desktop]
---

# Juice Shop Login Test
```

- File names: `specs/<ID>_<slug>.spec.md` and `tests/<ID>_<slug>.test.ts`.
- Spec and test file name are identical except for the extension.
- Exactly one test file per spec. A spec without a test and a test without a spec are both invalid.
- The `test.describe` title quotes the spec heading verbatim, without the ID.
- IDs are assigned manually: no auto-increment, no counter script, no guessing. If the request names no ID, ask for it. If the existing schema is recognizable (e.g. `PROJ-0001`), propose the next free ID and wait for confirmation. A proposal is not an assignment - create or rename the file only after confirmation.
- The ID never appears in the spec heading.

## Spec creation in the browser (mandatory)

Every spec is developed interactively in the visible (headed) browser of the Playwright MCP server so the user can follow every step live.

- Before the first step of a new spec, open the browser via `browser_navigate` and keep it visible for the entire spec creation. Do not run it headless, do not close it, and do not move it to the background.
- Click through every spec step for real in the app before writing it down.
- Read all texts (success and error messages, button labels, links) from the running app. Do not guess them from source code, i18n files, or prior experience.
- Walk the complete flow live once, and only then write and save the spec.
- If the app is unreachable or cannot be started: stop and ask the user instead of writing the spec without live verification.
- Deviating observations from the live walkthrough go into `learnings.md`.

## Test data tables

An optional `## Testdaten` block before `## Scenario` creates one test case per table row.

```markdown
## Testdaten

| Query  | Visible     |
|--------|-------------|
| apple  | Apple Juice |

## Scenario: Search and verify results

1. Go to the test-ready start page (`/`)
2. Search for "{Query}"
3. Verify that "{Visible}" is displayed
```

- Table header cells are variable names.
- `{Variable}` in the step text is replaced per table row.
- Empty values are not allowed; use a separate scenario for deviating cases.
- Each row produces its own `test()` block, not `test.each`.

## Spec review before test generation

Before every test generation, the spec must pass a blocking review.

A spec may start from an existing Markdown file or from a test description in natural language. A natural-language description is first transposed into the spec format (steps, test data, tags) and verified live in the browser; the normal review applies afterwards.

| Problem | Response |
|---------|----------|
| Action and verification combined | Propose a split and clarify |
| Micro-management of individual fields | Merge into one logical step |
| Two unrelated actions in one step | Propose a split |
| Vague action | Ask for button, place, text, or purpose |
| Vague verification | Ask for concrete element, text, value, or URL |
| Imprecise test data | Ask for concrete values |
| Unclear choice | Ask for the desired option |
| Ambiguous description | Ask for precision or a position reference |

Without a clear spec, no test is generated.

## Playwright test generation

- Read `learnings.md` before writing a test.
- Import `test` and `expect` from `../fixtures/spec-annotation`, not directly from `@playwright/test`.
- The `specAttachment` auto-fixture attaches the spec to the HTML report automatically; no manual `attachSpec()` call.
- Every assertion block gets a `// Schritt N: <full step text>` comment matching the spec step, with the complete step text from the spec.
- `page.locator('body')` is not allowed for assertions.
- Prioritize selectors as follows:
  1. `page.getByRole()` / `page.getByTestId()`
  2. `page.getByLabel()` / `page.getByPlaceholder()`
  3. `page.getByText()` / `:has-text()` / `filter()`
  4. Stable IDs
  5. Semantic selectors with context
- Regeneration instead of repair (hard rule): whenever a spec changes, a test fails, or a user asks to fix, adjust, or "make the test pass" — never edit the existing test file. Replace the whole file with a clean regeneration from the current spec and `learnings.md`. Rationalizations such as "only a small change", "the unaffected steps stay", or "the test still passes" are exactly what this rule forbids. Detailed trigger list and procedure: `playbook/skills/generate-playwright-test-from-spec/SKILL.md`.

## Test execution in the visible browser (mandatory)

Generated tests are always run in the visible (headed) browser. `slowMo` is used only for the final run so the user can follow it live; development runs go without it.

- Final run: `npm run test:demo` (sets `SLOW_MO=250` and `--headed`).
- Development run, visible: `npx playwright test tests/<file>.test.ts --headed`.
- Locator/action timeout is 8000ms (`playwright.config.ts`) so development failures surface fast. 1.5–3s breaks existing tests: after closing both banners the overlay blocks clicks for ~5s.
- Do not run headless while the user is watching.
- On failure, repeat the run visibly and evaluate the trace, screenshot, and error message.

## Failure handling

When a test fails:

1. Run the affected test and analyze the error message, trace, screenshot, and context.
2. Decide whether the cause lies in the spec or in the test code.
3. If the spec is unclear or wrong: refine the spec or ask the user.
4. If the test code is wrong: use the existing test only for root-cause analysis and record the insight in `learnings.md`.
5. Regenerate the test cleanly from the spec and `learnings.md` instead of repairing the existing test.
6. Run the regenerated test again.
7. Iterate until the test passes or an external blocker is documented.

## Pre-commit rules

Run the testmanager skill before every commit with changed or new specs.

- `playbook/skills/testmanager/SKILL.md` checks test pyramid, duplicates, and consolidation.
- The pre-commit hook lives in the repo under `hooks/pre-commit` and is activated automatically by `npm run setup` (`git config core.hooksPath hooks`).
- The hook warns when `.spec.md` files are part of the commit; it does not block. The deep analysis is done by the skill.

## Project-specific conventions

- "Go to the test-ready {page}" (`Gehe zur testbereiten {Seite}` in German specs) means: navigate to the URL and close blocking overlays such as the welcome banner or cookie consent.
- The concrete implementation of this convention is documented in `learnings.md`.
- Checkout flows and other long tests may need an increased timeout.

## Reuse in other projects

Use `playbook/` when adopting this approach in another project. The target state is:

- adopt the generic rules from `playbook/AGENTS.template.md`,
- copy the skills from `playbook/skills/`,
- start from `playbook/learnings.template.md` as the project-specific knowledge base,
- do not adopt app-specific details from this example project.
