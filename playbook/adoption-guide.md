# Adoption Guide: Markdown-First E2E Testing

This guide describes how to adopt the approach from this example project in a new project.

## Target state

The target project has a clear separation between the business spec, the generated test code, and growing project knowledge:

```text
AGENTS.md
learnings.md
specs/
tests/
fixtures/
```

Optionally, reusable skills are added:

```text
skills/
  review-markdown-spec/
  generate-playwright-test-from-spec/
  debug-playwright-test-failure/
  testmanager/
```

## Step 1: Copy the playbook files

Copy from this repository:

- `playbook/AGENTS.template.md` to `AGENTS.md`
- `playbook/learnings.template.md` to `learnings.md`
- `playbook/skills/` into your skill directory or a documented project location

Then adapt all paths, test commands, and project names to your target project.

## Step 2: Adapt the project rules

Add only rules to `AGENTS.md` that apply to all tests in the target project:

- Where specs live.
- Where tests live.
- Which fixture or test base is used.
- Which commands execute tests.
- Which tags or viewports are mandatory.
- Which files agents must not modify.

App-specific UI insights do not belong in `AGENTS.md`; they belong in `learnings.md`. Learning entries are always general: no references to concrete specs or tests (IDs, file names, or test names).

## Step 3: Define the first test-ready page

In `learnings.md`, define how a page is made test-ready.

Example:

```markdown
| Page  | URL     | Preparation                        |
|-------|---------|------------------------------------|
| Login | `/login` | Open the page, close the cookie banner |
```

Then use this phrasing in specs:

```markdown
1. Go to the test-ready login page (`/login`)
```

## Step 4: Write the first spec

Start with a small, stable user flow.

```markdown
---
tags: [smoke, desktop]
---

# Login

## Scenario: Successful login

1. Go to the test-ready login page (`/login`)
2. Enter the email address "test@example.com" and the password "password"
3. Click the login button
4. Verify that the username is displayed in the navigation
```

The spec describes business behavior. Technical selectors belong in the generated Playwright test only.

## Step 5: Have the spec reviewed

Use the `review-markdown-spec` skill before a test is generated.

The review is blocking. If the spec is ambiguous, it is improved first.

## Step 6: Generate and run the test

Use the `generate-playwright-test-from-spec` skill.

The generated test must:

- stay traceable to the spec,
- contain concrete assertions,
- work without `page.locator('body')`,
- pass with the project-specific test command.

## Step 7: Fix failures systematically

If the test fails, use `debug-playwright-test-failure`.

Always decide first whether the cause lies in the spec, the test code, or the test environment. If the test code is wrong, use the existing test only for root-cause analysis; afterwards regenerate it from the spec and `learnings.md` instead of repairing it. New reusable insights are documented in `learnings.md`.

## Step 8: Stabilize the approach

After the first three to five tests, check:

- Are the spec rules clear enough?
- Do learnings repeat that belong in fixtures?
- Is the test data explicit enough?
- Are tags and viewports consistent?
- Are the skills discoverable for the team?

Only then adapt larger parts of the playbook.

## What should not be copied

Do not adopt these from this example project without review:

- Juice Shop-specific selectors.
- Test users or test data.
- The Docker setup.
- App-specific banner logic.
- Specific checkout or cart flows.

These details always belong to the respective project instance.
