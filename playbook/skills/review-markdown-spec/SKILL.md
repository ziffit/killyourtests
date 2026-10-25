---
name: review-markdown-spec
description: Use when a Markdown E2E spec should be checked before generating or changing a Playwright test, or when a test description in natural language must be turned into a spec
---

# Review Markdown Spec

## Overview

Review the Markdown spec as the source of truth before any test generation. The input may be an existing spec or a test description in natural language. Natural-language input is first transposed into the spec format (steps, test data, tags) — every step verified live in the visible browser per the project rules in `AGENTS.md` — and then reviewed as usual. The core principle: unclear specs create brittle tests, so ambiguity is blocked before code exists.

## Review Contract

Read `learnings.md`, then inspect the target spec. If the input is natural language, first transpose it into a `specs/*.spec.md` file following project convention, and ask for missing concrete test data before writing any placeholder. Do not generate or edit Playwright code during this review.

| Check | Required outcome |
|-------|------------------|
| Imperative style | Steps read like user instructions |
| No technical selectors | No CSS classes, IDs, `aria-label`, XPath, or implementation-only names |
| Step granularity | One logical user action or one verification per line |
| Action/verification split | No step both does something and checks the result |
| Explicit expectations | Verifications state concrete visible text, value, URL, count, or element |
| Explicit test data | No vague values like "valid user" or "correct address" |
| Clear choices | Options name the exact item to choose or the intended rule |
| Tags/viewports | Required project tags such as `desktop` or `mobile` are present |

## Response Shape

Return one of these verdicts:

- `APPROVED` when the spec is clear enough for test generation.
- `CHANGES_REQUIRED` when the spec must be fixed first.

For `CHANGES_REQUIRED`, list each blocking issue with the step number, problem, and suggested rewrite. Ask only for information that cannot be inferred safely.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Treating selector-like text as acceptable because it is precise | Replace it with user-visible context |
| Allowing "and verify" in an action step | Split into action step and verification step |
| Fixing ambiguity in generated code instead of the spec | Improve the spec first |
| Skipping `learnings.md` | Read it before judging known app patterns |
