# Agent Instructions

Diese Datei beschreibt die verbindlichen Regeln fuer Markdown-First-E2E-Testing in diesem Projekt.

## Kontext

Dieses Projekt nutzt menschenlesbare Markdown-Spezifikationen als Source of Truth fuer Playwright-E2E-Tests.

- Specs liegen in `specs/*.spec.md`.
- Generierte Tests liegen in `tests/*.spec.ts`.
- Projektwissen, Selektorentscheidungen und bekannte Fallstricke stehen in `learnings.md`.
- Specs beschreiben Nutzerverhalten, nicht technische Implementierungsdetails.

## Pflichtablauf

1. Vor jeder Testgenerierung `learnings.md` lesen.
2. Spec blockierend reviewen.
3. Erst nach klarer Spec den Playwright-Test schreiben.
4. Test ausfuehren und bis zum Erfolg iterieren.
5. Neue Erkenntnisse in `learnings.md` dokumentieren.

## Spec-Regeln

- Imperativ schreiben: "Klicke auf ...", "Navigiere zu ...", "Gib ... ein".
- Keine technischen Selektoren in Specs: keine CSS-Klassen, IDs oder `aria-label`.
- UI-Elemente ueber sichtbaren Text, Kontext, Position oder Zweck beschreiben.
- Ein Schritt beschreibt genau eine logische Nutzeraktion oder eine Verifikation.
- Aktion und Verifikation stehen nie im selben Schritt.
- Verifikationen nennen konkrete Erwartungen.
- Testdaten sind explizit.
- Jede Spec enthaelt mindestens einen Viewport-Tag: `desktop` oder `mobile`.

## Testdaten

Ein optionaler `## Testdaten`-Block vor `## Scenario` parametrisiert die Spec.

```markdown
## Testdaten

| Suchbegriff | Erwartetes Ergebnis |
|-------------|---------------------|
| apple       | Apple Juice         |

## Scenario: Suche zeigt erwartete Treffer

1. Gehe zur testbereiten Startseite (`/`)
2. Suche nach "{Suchbegriff}"
3. Verifiziere dass "{Erwartetes Ergebnis}" angezeigt wird
```

- Jede Tabellenzeile erzeugt einen eigenen Test.
- Leere Werte sind nicht erlaubt.
- Abweichende Faelle gehoeren in eigene Scenarios.

## Playwright-Regeln

- Verwende ein Projekt-Fixture, das die Spec im Report referenziert, falls vorhanden.
- Jeder Assertion-Block referenziert den passenden Spec-Step mit `// Schritt N: <voller Schritttext>` und zitiert dessen vollstaendigen Text.
- Keine Assertions gegen `page.locator('body')`.
- Bevorzuge nutzernahe Selektoren: Role, TestId, Label, Placeholder, sichtbarer Text.
- Nutze technische Selektoren nur, wenn sie stabil und eindeutig sind.

## Fehlerbehebung

Bei Testfehlern wird zuerst die Ursache bestimmt:

- Ist die Spec unklar oder fachlich falsch, wird die Spec angepasst oder der Anwender gefragt.
- Ist der Test-Code falsch, wird der Test korrigiert.
- Ist ein neues App-Pattern relevant, wird `learnings.md` ergaenzt.

Der Test ist erst fertig, wenn er erfolgreich ausgefuehrt wurde oder ein externer Blocker dokumentiert ist.

## Empfohlene Skills

Kopiere die Skills aus `playbook/skills/` in dein Projekt oder dein Agenten-/CLI-Skill-Verzeichnis:

- `review-markdown-spec`
- `generate-playwright-test-from-spec`
- `debug-playwright-test-failure`
- `testmanager` (vor Commits mit geaenderten Specs)
