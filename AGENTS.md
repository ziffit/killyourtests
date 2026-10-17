# Agent Instructions

Diese Datei beschreibt die verbindlichen Projektregeln fuer KI-Agenten und Menschen, die in diesem Repository am Markdown-First-E2E-Testing arbeiten.

## Projektkontext

MarkupPlayRight erzeugt Playwright-Tests aus menschenlesbaren Markdown-Spezifikationen.

- `specs/*.spec.md` ist die fachliche Source of Truth.
- `tests/*.spec.ts` ist generierter Playwright-Code und bleibt zur Spec rueckverfolgbar.
- `learnings.md` sammelt app-spezifische Patterns, Selektoren und Fallstricke.
- `playbook/` enthaelt den wiederverwendbaren Kern fuer andere Projekte.

## Grundregeln fuer Specs

Specs werden wie Navigationsanweisungen fuer menschliche Tester geschrieben.

- Schreibe Schritte imperativ: "Klicke auf ...", "Navigiere zu ...", "Gib ... ein".
- Verwende keine technischen Selektoren in Specs: keine CSS-Klassen, IDs oder `aria-label`.
- Beschreibe UI-Elemente ueber Kontext, Position, sichtbaren Text und Zweck.
- Jede Zeile enthaelt genau einen logischen Schritt aus Benutzersicht.
- Trenne Aktion und Verifikation strikt in separate Schritte.
- Verifikationen beschreiben die konkrete Erwartung: was sichtbar ist und wo.
- Testdaten muessen explizit sein; keine Platzhalter wie "valide Adresse".
- Jede Spec braucht mindestens einen Viewport-Tag: `desktop` oder `mobile`.

## Spec-Erstellung im Browser (Pflicht)

Jede Spec wird interaktiv im sichtbaren (headed) Browser des Playwright-MCP-Servers erarbeitet, damit der Anwender jeden Schritt live mitverfolgen kann.

- Vor dem ersten Schritt einer neuen Spec den Browser per `browser_navigate` oeffnen und waehrend der gesamten Spec-Erstellung sichtbar lassen. Browser nicht headless betreiben, nicht schliessen und nicht in den Hintergrund schieben.
- Jeden Spec-Schritt vor dem Aufschreiben real in der App durchklicken.
- Alle Texte (Erfolgs- und Fehlermeldungen, Button-Labels, Links) aus der laufenden App ablesen. Nicht aus Quellcode, i18n-Dateien oder Erfahrungswerten raten.
- Den kompletten Flow einmal live durchlaufen und erst danach die Spec schreiben und speichern.
- Ist die App nicht erreichbar oder nicht startbar: anhalten und den Anwender fragen, statt die Spec ohne Live-Verifikation zu schreiben.
- Abweichende Beobachtungen aus dem Live-Durchlauf gehen in `learnings.md` ein.

## Testdaten-Tabellen

Ein optionaler `## Testdaten`-Block vor `## Scenario` erzeugt einen Testfall pro Tabellenzeile.

```markdown
## Testdaten

| Suchbegriff | Sichtbar    |
|-------------|-------------|
| apple       | Apple Juice |

## Scenario: Search and verify results

1. Gehe zur testbereiten Startseite (`/`)
2. Suche nach "{Suchbegriff}"
3. Verifiziere dass "{Sichtbar}" angezeigt wird
```

- Tabellenkopfzeilen sind Variablennamen.
- `{Variable}` im Schritttext wird pro Tabellenzeile ersetzt.
- Leere Werte sind nicht erlaubt; nutze fuer abweichende Faelle ein separates Scenario.
- Pro Zeile entsteht ein eigener `test()`-Block, kein `test.each`.

## Spec-Review vor Testgenerierung

Vor jeder Testgenerierung muss die Spec blockierend geprueft werden.

| Problem | Reaktion |
|---------|----------|
| Aktion und Verifikation kombiniert | Trennung vorschlagen und klaeren |
| Mikro-Steuerung einzelner Felder | Zu einem logischen Schritt zusammenfassen |
| Zwei unzusammenhaengende Aktionen in einem Schritt | Trennung vorschlagen |
| Vage Aktion | Nach Button, Ort, Text oder Zweck fragen |
| Vage Verifikation | Nach konkretem Element, Text, Wert oder URL fragen |
| Ungenaue Testdaten | Konkrete Werte erfragen |
| Unklare Auswahl | Gewuenschte Option erfragen |
| Mehrdeutige Beschreibung | Praezisierung oder Positionsangabe erfragen |

Ohne klare Spec wird kein Test generiert.

## Playwright-Testgenerierung

- Vor dem Schreiben eines Tests `learnings.md` lesen.
- Importiere `test` und `expect` aus `../fixtures/spec-annotation`, nicht direkt aus `@playwright/test`.
- Das `specAttachment`-Autofixture haengt die Spec automatisch an den HTML-Report; kein manueller `attachSpec()`-Aufruf.
- Jeder Assertion-Block bekommt einen `// Schritt N: <voller Schritttext>`-Kommentar passend zum Spec-Step, mit dem vollstaendigen Text des Steps aus der Spec.
- `page.locator('body')` ist fuer Assertions nicht erlaubt.
- Priorisiere Selektoren so:
  1. `page.getByRole()` / `page.getByTestId()`
  2. `page.getByLabel()` / `page.getByPlaceholder()`
  3. `page.getByText()` / `:has-text()` / `filter()`
  4. stabile IDs
  5. semantische Selektoren mit Kontext

## Testausfuehrung im sichtbaren Browser (Pflicht)

Generierte Tests werden immer im sichtbaren (headed) Browser und mit `slowMo` ausgefuehrt, damit der Anwender den Ablauf live nachvollziehen kann.

- Standardbefehl: `npm run test:demo` (setzt `SLOW_MO=800` und `--headed`).
- Einzeltest sichtbar: `SLOW_MO=800 npx playwright test tests/<datei>.spec.ts --headed`.
- Nicht headless ausfuehren, solange der Anwender zusieht.
- Bei Fehlschlag den Lauf sichtbar wiederholen und Trace/Screenshot/Fehlermeldung auswerten.

## Fehlerbehebung

Wenn ein Test fehlschlaegt:

1. Fuehre den betroffenen Test aus und analysiere Fehlermeldung, Trace, Screenshot und Kontext.
2. Entscheide, ob die Ursache in der Spec oder im Test-Code liegt.
3. Bei unklarer oder falscher Spec: Spec praezisieren oder Anwender fragen.
4. Bei Test-Code-Fehler: Test korrigieren und neue Erkenntnis in `learnings.md` sichern.
5. Fuehre den korrigierten Test erneut aus.
6. Iteriere, bis der Test erfolgreich ist oder ein externer Blocker dokumentiert ist.

## Pre-Commit-Regeln

Vor jedem Commit mit geaenderten oder neuen Specs den testmanager-Skill ausfuehren.

- `playbook/skills/testmanager/SKILL.md` prueft Test-Pyramide, Duplikate und Konsolidierung.
- Der Pre-Commit-Hook liegt im Repo unter `hooks/pre-commit` und wird automatisch mit `npm run setup` aktiviert (`git config core.hooksPath hooks`).
- Der Hook warnt, wenn `.spec.md`-Dateien im Commit sind; er blockiert nicht. Die tiefe Analyse uebernimmt der Skill.

## Projekt-spezifische Konventionen

- "Gehe zur testbereiten {Seite}" bedeutet: Zur URL navigieren und stoerende Overlays wie Welcome-Banner oder Cookie-Consent schliessen.
- Die konkrete Umsetzung dieser Konvention steht in `learnings.md`.
- Checkout-Flows und andere lange Tests koennen ein erhoehtes Timeout benoetigen.

## Wiederverwendung in anderen Projekten

Nutze `playbook/`, wenn dieses Vorgehen in ein anderes Projekt uebernommen werden soll. Der Zielzustand ist:

- generische Regeln aus `playbook/AGENTS.template.md` uebernehmen,
- Skills aus `playbook/skills/` kopieren,
- `playbook/learnings.template.md` als projektspezifische Wissensbasis starten,
- App-spezifische Details nicht aus diesem Beispielprojekt uebernehmen.
