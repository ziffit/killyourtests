# Agent Instructions

This file defines the binding rules for Markdown-First E2E testing in this project.

## Context

This project uses human-readable Markdown specifications as the source of truth for Playwright E2E tests.

- Specs live in `specs/*.spec.md`.
- Generated tests live in `tests/*.spec.ts`.
- Project knowledge, selector decisions, and known pitfalls are documented in `learnings.md`.
- Specs describe user behavior, not technical implementation details.

## Mandatory workflow

1. Read `learnings.md` before every test generation.
2. Review the spec as a blocking gate.
3. Write the Playwright test only after the spec is clear.
4. Run the test and iterate until it passes.
5. Document new insights in `learnings.md`.

## Spec creation in the browser (mandatory)

Every spec is developed interactively in the visible (headed) browser of a browser MCP server so the user can follow every step live.

- Open the browser before the first step and keep it visible for the entire spec creation; not headless, not closed.
- Click through every spec step for real in the app before writing it down.
- Read all texts (success and error messages, labels, links) from the running app; do not guess them from source code or i18n files.
- Write and save the spec only after a complete live walkthrough.
- If the app is unreachable: stop and ask the user.

## Spec rules

- Write in the imperative: "Click ...", "Navigate to ...", "Enter ...".
- No technical selectors in specs: no CSS classes, IDs, or `aria-label`.
- Describe UI elements by visible text, context, position, or purpose.
- One step describes exactly one logical user action or one verification.
- Action and verification never share a step.
- Verifications state concrete expectations.
- Test data is explicit.
- Every spec contains at least one viewport tag: `desktop` or `mobile`.

## Test data

An optional `## Testdaten` block before `## Scenario` parameterizes the spec.

```markdown
## Testdaten

| Query  | Expected result |
|--------|-----------------|
| apple  | Apple Juice     |

## Scenario: Search shows expected hits

1. Go to the test-ready start page (`/`)
2. Search for "{Query}"
3. Verify that "{Expected result}" is displayed
```

- Each table row produces its own test.
- Empty values are not allowed.
- Deviating cases belong in separate scenarios.

## Playwright rules

- Use a project fixture that references the spec in the report, if one exists.
- Every assertion block references the matching spec step with `// Schritt N: <full step text>` and quotes its complete text.
- No assertions against `page.locator('body')`.
- Prefer user-facing selectors: role, test id, label, placeholder, visible text.
- Use technical selectors only when they are stable and unambiguous.

## Test execution in the visible browser (mandatory)

Generated tests are always run in the visible (headed) browser and with `slowMo` so the user can follow the run live.

- Always use `--headed` together with `SLOW_MO`/slowMo, never headless.
- On failure, repeat the run visibly and evaluate the trace, screenshot, and error message.

## Failure handling

On test failures, the cause is determined first:

- If the spec is unclear or wrong, the spec is refined or the user is asked.
- If the test code is wrong, the existing test is used only for root-cause analysis; afterwards it is regenerated from the spec and `learnings.md` instead of being repaired.
- If a new app pattern is relevant, `learnings.md` is extended.

A test is only done when it has been run successfully or an external blocker is documented.

## Recommended skills

Copy the skills from `playbook/skills/` into your project or your agent/CLI skill directory:

- `review-markdown-spec`
- `generate-playwright-test-from-spec`
- `debug-playwright-test-failure`
- `testmanager` (before commits with changed specs)
