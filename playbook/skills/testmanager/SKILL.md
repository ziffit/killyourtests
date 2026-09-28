---
name: testmanager
description: Use before committing changed or new Markdown specs to verify test-pyramid compliance, detect duplicate tests, and find consolidation opportunities
---

# Testmanager

## Overview

Pruefe alle geaenderten oder neuen Specs vor dem Commit auf Test-Pyramide, Deduplizierung und Konsolidierung. Das Kernprinzip: jede Zeile in einer Spec muss eindeutigen fachlichen Wert liefern, und kein Test darf einen bereits abgedeckten Bereich nochmals testen.

## Preconditions

- Alle geaenderten/neuen `.spec.md`-Dateien sind bekannt (z.B. via `git diff --cached --name-only`).
- Alle bestehenden Specs werden fuer den Vergleich gelesen, nicht nur die geaenderten.

## Checks

| # | Bereich | Was wird geprueft |
|---|---------|-------------------|
| 1 | **Test-Pyramide / Business Value** | Testdaten-Tabellen pruefen: testen die Zeilen wirklich unterschiedliche Fachlichkeit? Grenzwerttests (leer, null, 1, 999999) nur mit expliziter Begrueundung in der Spec. Identisches Verhalten mit anderen Parametern = Konsolidierung nötig. |
| 2 | **Inhaltlich aehnliche Tests** | Alle Specs miteinander vergleichen. Gleicher Bereich + aehnliche/gleiche Assertions = Flag. Steps duerfen abweichen, wenn das Ergebnis (Assertion) gleich ist. Auch bei unterschiedlicher Nomenklatur erkennen (z.B. "Warenkorb" vs. "Basket"). |
| 3 | **Konsolidierungspotenzial** | Setup-Aehnlichkeiten erkennen (z.B. "Produkt zum Warenkorb hinzufuegen" in mehreren Specs). Vorschlag: Welche Tests koennten nach gemeinsamem Setup mehrere Verifikationen durchfuehren? Kosten-Nutzen: Zusammenlegung vs. separate Lesbarkeit. |

## Response Shape

Return one of these verdicts:

- `PASS` when all specs comply with the three checks.
- `FINDINGS` when issues are found.

For `FINDINGS`, structure the report as:

```
## FINDINGS

### [Severity: high|medium|low] Kurzbeschreibung

- **Bereich:** [Test-Pyramide|Deduplizierung|Konsolidierung]
- **Dateien:** [Dateiname:Zeile, Dateiname:Zeile]
- **Problem:** [Konkrete Beschreibung]
- **Vorschlag:** [Was geaendert werden sollte]
```

Severity-Leiste:

| Severity | Wann |
|----------|------|
| `high` | Identische Tests, die fachlich dasselbe abdecken |
| `medium` | Testdaten-Tabellen ohne fachliche Differenzierung |
| `low` | Konsolidierungsvorschlaege mit guetingem Kosten-Nutzen-Verhaeltnis |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Nur die geaenderte Spec pruefen, nicht alle | Immer alle Specs fuer Vergleich lesen |
| Steps als Kriterium fuer Identitaet nehmen | Assertion-Ergebnis ist das Kriterium, nicht Steps |
| Konsolidierung vorschlagen ohne Lesbarkeitsverlust zu pruefen | Bei Konsolidierung: Lesbarkeit und Wartbarkeit abwaegen |
| Grenzwerttests pauschal flaggen | Nur flaggen wenn keine Begrueundung in der Spec steht |
| Testdaten-Tabellen mit 2 Zeilen automatisch flaggen | Pruefen ob die 2 Zeilen wirklich unterschiedliche Fachlichkeit testen |
