---
tags: [regression, fast, desktop]
---

# PROJ-0002: Juice Shop Product Search Test

## Testdaten

| Suchbegriff | Sichtbar       | Nicht sichtbar   |
|-------------|----------------|------------------|
| apple       | Apple Juice    | Banana Milkshake |
| banana      | Banana Juice   | Apple Juice      |
| carrot      | Carrot Juice   | Apple Juice      |

## Scenario: Search for products and verify results

1. Gehe zur testbereiten Startseite (`/`)
2. Suche nach "{Suchbegriff}"
3. Verifiziere dass "{Sichtbar}" in den Suchergebnissen angezeigt wird
4. Verifiziere dass "{Nicht sichtbar}" nicht in den Suchergebnissen angezeigt wird
