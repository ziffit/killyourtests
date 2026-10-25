# Test Learnings

This document contains project-specific insights for generating and stabilizing E2E tests.

Read it before writing a test. Update it after successful debugging or new UI insights.

## Test-ready pages

Describe here what "Go to the test-ready {page}" means for each relevant page.

| Page     | URL | Preparation                                   |
|----------|-----|-----------------------------------------------|
| Homepage | `/` | Example: close the banner, confirm cookie consent |

## Reusable flows

Document stable sequences such as login, checkout, registration, or search.

| Flow  | Purpose       | Notes                                              |
|-------|---------------|----------------------------------------------------|
| Login | Sign a user in | Test user, required wait conditions, known issues |

## Selectors and UI patterns

Record only insights that are reusable in future tests.

- Prefer role and text selectors.
- Document ambiguous elements with clear scoping.
- Note unstable IDs or components that should not be used.

## Assertions

Document specific containers or elements for frequent verifications.

| Expectation      | Recommended assertion                 | Reason                              |
|------------------|---------------------------------------|-------------------------------------|
| Example text visible | `await expect(locator).toContainText(...)` | Specific container instead of the whole page |

## Test data

Document valid, reusable test data and constraints.

| Area    | Values        | Notes                              |
|---------|---------------|------------------------------------|
| Address | Example values | Do not use real personal data      |

## Known pitfalls

- Describe causes of flakiness, timing traps, and UI components with special behavior.
- Document workarounds only when they are verified and reusable.
