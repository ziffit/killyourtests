---
name: testmanager
description: Use before committing changed or new Markdown specs to verify test-pyramid compliance, detect duplicate tests, and find consolidation opportunities
---

# Testmanager

## Overview

Check all changed or new specs before every commit for test-pyramid compliance, deduplication, and consolidation. The core principle: every line in a spec must deliver clear business value, and no test may re-test an area already covered by another test.

## Preconditions

- All changed/new `.spec.md` files are known (e.g. via `git diff --cached --name-only`).
- All existing specs are read for comparison, not only the changed ones.

## Checks

| # | Area | What is checked |
|---|------|-----------------|
| 1 | **Test pyramid / business value** | Check test-data tables: do the rows really cover distinct business content? Boundary-value tests (empty, null, 1, 999999) only with explicit rationale in the spec. Identical behavior with different parameters = consolidation required. |
| 2 | **Content-similar tests** | Compare all specs against each other. Same area + similar/identical assertions = flag. Steps may differ if the result (assertion) is the same. Recognize similarity even when the wording differs (e.g. "shopping cart" vs. "basket"). |
| 3 | **Consolidation potential** | Detect setup similarities (e.g. "add product to cart" in several specs). Proposal: which tests could perform several verifications after shared setup? Cost-benefit: merging vs. separate readability. |
| 4 | **Spec–test traceability** | For every changed/new spec, verify that the paired test file name is identical except for the extension (`*.spec.md` ↔ `*.test.ts`), that the frontmatter `id` matches the file-name prefix and is absent from the heading, and that the paired changed test quotes the current spec steps verbatim via `// Schritt N:` comments. A missing or misnamed counterpart, an ID mismatch, or stale step comments after a spec change = `high` severity finding; the required fix is a clean regeneration (see `generate-playwright-test-from-spec`), never an in-place edit. |

## Response Shape

Return one of these verdicts:

- `PASS` when all specs comply with the three checks.
- `FINDINGS` when issues are found.

For `FINDINGS`, structure the report as:

```
## FINDINGS

### [Severity: high|medium|low] Short description

- **Area:** [Test pyramid|Deduplication|Consolidation]
- **Files:** [filename:line, filename:line]
- **Problem:** [Concrete description]
- **Proposal:** [What should be changed]
```

Severity ladder:

| Severity | When |
|----------|------|
| `high` | Identical tests that cover the same business content |
| `medium` | Test-data tables without business differentiation |
| `low` | Consolidation proposals with reasonable cost-benefit ratio |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Checking only the changed spec, not all of them | Always read all specs for comparison |
| Using steps as the criterion for identity | The assertion result is the criterion, not the steps |
| Proposing consolidation without checking readability loss | When consolidating, weigh readability and maintainability |
| Flagging boundary-value tests indiscriminately | Only flag if no rationale is stated in the spec |
| Automatically flagging test-data tables with 2 rows | Check whether the 2 rows really test distinct business content |
