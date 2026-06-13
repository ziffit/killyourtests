# Test-Learnings

Vor dem Schreiben eines Tests konsultieren, nach erfolgreicher Verifikation ergänzen.

## Confirmation-Seite

- `mat-card` ist mehrdeutig (4 Treffer) → mit `.filter()` / `.first()` eingrenzen
- Lieferzeit prüfen: `await expect(page.locator('.confirmation-card')).toContainText(/5 days/i);`
- Gesamtpreis/Bonus-Punkte: spezifischeren Container-Selektor verwenden, nicht `body`

## Assertions & Selektoren (ALLGEMEIN)

- **`page.locator('body')` ist verboten** – immer einen spezifischen Container/Element-Selektor verwenden
- Jede Assertion bekommt einen `// Schritt N`-Kommentar zur Rückverfolgbarkeit zur Spec
- Bei nicht eindeutigen Selektoren zuerst prüfen, ob die Spec präzisiert werden muss, bevor der Selektor "erzwungen" wird
- `mat-radio-button` ohne `.first()`/`.filter()` ist mehrdeutig → immer eingrenzen

## Checkout-Buttons

Die "Continue"-Buttons heißen pro Seite unterschiedlich:

| Seite | Selektor |
|-------|----------|
| Address Selection | `button.btn-next` |
| Delivery Method | `button:has-text("Continue")` |
| Payment | `button:has-text("Continue")` |
| Order Summary (Bezahlen) | `button#checkoutButton` |

## Search & Basket

- Such-Input: `input[placeholder="Search…"], input.mat-input-element`
- Nach jedem Suchdurchlauf muss der Search-Input mit `.mat-search_icon-close` geschlossen werden
- Bei mehrfachem Hinzufügen (`addProduct`-Schleife) nach jedem Klick `waitForTimeout(500)` und dann den Snackbar-Notification-Hinweis per `.mat-simple-snackbar-action button` (Text: "X") schließen (`waitForTimeout(200)`)
- Basket-Zeile: `mat-row:has-text("Produktname")`
- Basket-Buttons pro Zeile: Button 0 = Minus, Button 1 = Plus, Button `.last()` = Trash (löschen)
- Es gibt kein `input[type="number"]` für die Menge – die Quantity wird nur als `<span>` angezeigt
- Der Minus-Button ist bei qty=1 enabled (nicht disabled), reduziert die Menge aber nicht unter 1
- Checkout-Button `button#checkoutButton` ist disabled bei leerem Basket (`toBeDisabled()`)

## Testdaten-Generierung

- Zufällige Testdaten (z.B. Stadtname) werden inline via `pickRandom()`-Helper aus vorgegebenen Listen generiert, siehe `specs/PROJ-0006_complex_checkout.spec.md` "Testdata Generation"

## Tags / Test-Selektion

- Tags werden als YAML-Frontmatter in Specs definiert: `tags: [regression, fast, desktop]`
- Im Playwright-Test werden Tags an den Testnamen gehängt: `test('... @desktop @regression', ...)`
- Selektion per CLI: `npx playwright test --grep @desktop` oder `--grep-invert @mobile`
- Viewport-Konvention: Desktop-Tests nutzen `1280x720` (Default in playwright.config.ts), Mobile-Tests (PROJ-0006) nutzen `390x844` per `test.use({ viewport: ... })`

## Accessibility / Keyboard-Navigation

- Snackbar schließen: `page.keyboard.press('Escape')` (Alternative zum X-Button-Klick)
- `<mat-select>`: Tab zum Select, `ArrowDown` öffnet Panel + wählt erste Option, `Enter` bestätigt Auswahl
- `<select>` (nativ): `ArrowDown`/`ArrowUp` navigiert direkt, keine Bestätigung nötig → danach `Tab` zum nächsten Feld
- `<mat-radio-button>`: Angular-Material-Radio reagiert nicht zuverlässig auf `press('Space')` – daher `click()` verwenden
- `<mat-expansion-panel-header>`: `.press('Enter')` zum Öffnen/Schließen
- Formular-Navigation: `focus()` auf erstes Feld, dann `Tab` zwischen Feldern, `page.keyboard.type()` zum Befüllen
- **Bekannte Limitation**: Manche Angular-Material-Buttons (z.B. `button.btn-next`) reagieren nicht auf Enter-Taste – sie brauchen `click()` (Accessibility-Bug in der App)
- `.mat-search_icon-search` ist kein Button → öffnen per `click()` nötig, nicht per Enter
- **Hidden Slide-Toggle im Register-Formular**: Zwischen `#repeatPasswordControl` und `mat-select` liegt ein versteckter Slide-Toggle → Tab muss 2x gedrückt werden
