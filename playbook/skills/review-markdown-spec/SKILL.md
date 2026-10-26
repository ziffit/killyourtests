---
name: review-markdown-spec
description: Use when a Markdown E2E spec should be checked before generating or changing a Playwright test, or when a test description in natural language must be turned into a spec
---

# Review Markdown Spec

## Overview

Review the Markdown spec as the source of truth before any test generation. The input may be an existing spec or a test description in natural language. Natural-language input is first transposed into the spec format (steps, test data, tags) and then reviewed as usual. The core principle: unclear specs create brittle tests, so ambiguity is blocked before code exists. Claims about the running app are checked in the visible browser, not inferred from the spec text — see `Live Check`.

## Review Contract

Read `learnings.md`, then inspect the target spec. If the input is natural language, first transpose it into a `specs/*.spec.md` file following project convention, and ask for missing concrete test data before writing any placeholder. Do not generate or edit Playwright code during this review.

| Check | Required outcome |
|-------|------------------|
| Spec ID and file name | `id` present in the frontmatter, unique, matching the file-name prefix and absent from the heading; the paired test file name is identical except for the extension |
| Imperative style | Steps read like user instructions |
| No technical selectors | No CSS classes, IDs, `aria-label`, XPath, or implementation-only names |
| Step granularity | One logical user action or one verification per line |
| Action/verification split | No step both does something and checks the result |
| Explicit expectations | Verifications state concrete visible text, value, URL, count, or element |
| Explicit test data | No vague values like "valid user" or "correct address". A concrete value or an explicitly stated generator rule ("random city from this fixed list") is fine; "a unique email" without the rule is a placeholder |
| Clear choices | Options name the exact item to choose or the intended rule |
| Tags/viewports | Exactly one of `desktop` / `mobile`, plus at least one category tag |
| Known app pitfalls | No step contradicts a documented limitation in `learnings.md`; where it does, propose the variant the app can actually do |

## Live Check (cheap first)

A verification the reviewer cannot locate live is an unclear spec, not a test problem. Check only what the Markdown cannot answer: that the claimed text, value or URL really exists, and that no documented app limitation forbids the path.

Escalate only as far as needed:

| Tool | Use for | Cost |
|------|---------|------|
| `browser_find` | "which element does this step mean?" — substring/regex over the accessibility tree, returns matches with `aria-ref` and path context | a few lines |
| `browser_snapshot` | one full capture per new page state | whole tree |
| `browser_evaluate` | facts the tree does not carry: match counts, `disabled`, computed visibility, `<mat-select>` options | one expression |

Rules:

- Do not parse raw HTML. The accessibility tree is the projection Playwright locators resolve against. Raw HTML adds hidden nodes, hydration duplicates and generated class names — the same guess with more confidence.
- A stalled action is almost always a stale `aria-ref`, not slow introspection. Refs die on navigation, snackbar and dialog. Never reuse a ref from memory: locate the next target again after every state change.
- Locate only the next target, not the whole page, after each state change.
- If an action does not complete within about a second, stop waiting and `browser_find` instead.
- One `browser_find` per verification target is the budget. If a target needs more, the step is too vague — report it instead of working around it in the test.

## Response Shape

Return one of these verdicts:

- `APPROVED` when the spec is clear enough for test generation.
- `CHANGES_REQUIRED` when the spec must be fixed first.
- `NEEDS_INPUT` when the spec is clear but a decision or test data cannot be inferred safely. Ask; do not fill in a guess.
- `UNVERIFIED` when a claim could not be checked live, for example because the app is unreachable. Never upgrade this to `APPROVED` silently.

For `CHANGES_REQUIRED`, list each blocking issue with the step number, problem, and suggested rewrite. Ask only for information that cannot be inferred safely.

```
VERDICT: <APPROVED | CHANGES_REQUIRED | NEEDS_INPUT | UNVERIFIED>
Live: <targets located via browser_find, or why the check was not possible>

| Step | Problem | Suggested rewrite |
|------|---------|-------------------|
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Treating selector-like text as acceptable because it is precise | Replace it with user-visible context |
| Allowing "and verify" in an action step | Split into action step and verification step |
| Fixing ambiguity in generated code instead of the spec | Improve the spec first |
| Skipping `learnings.md` | Read it before judging known app patterns |
| Approving a verification target that was never located in the running app | Check it with `browser_find`, or report `UNVERIFIED` |
| Reusing an `aria-ref` across a navigation or snackbar | Locate the target again in the current state |
| Turning a too-vague step into a clever locator in the test | Report the step and propose a rewrite |
