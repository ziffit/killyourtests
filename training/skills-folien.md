# Skill-Overview: Markdown-First E2E-Testing

Zielgruppe: IT-Affine Zuhörer · Format: je Skill eine Folie plus AGENTS-Leitplanken (Marp-kompatibel, `---` trennt Folien)

---

## Folienvorschau · Landkarte

```text
Spec schreiben        Spec prüfen          Test generieren          Debug-Schleife          Commit
specs/*.spec.md  -->  review-markdown-spec --> generate-playwright- -->  debug-playwright- --> testmanager
(Fachliche Wahrheit oder   (Gate: APPROVED)        test-from-spec          test-failure        (PASS/FINDINGS)
 natürliche Sprache)
```

---

## Skill 1 · review-markdown-spec

**Auslöser:** eine Spec soll geprüft werden, bevor ein Playwright-Test entsteht oder geändert wird.

- Eingang: fertige Spec **oder** Testbeschreibung in natürlicher Sprache — diese wird ins Spec-Format überführt (Ziel: `specs/*.spec.md`), jeder Schritt live im Browser verifiziert.
- Prüft die Spec als Source of Truth, NICHT den Code.
- 9 Checks: Spec-ID/Dateiname, imperative Schritte, keine technischen Selektoren, 1 Aktion oder 1 Verifikation pro Zeile, konkrete Testdaten und Erwartungen, Projekt-Tags.
- Kernprinzip: Unklare Specs erzeugen brittle Tests — Mehrdeutigkeit wird blockiert, bevor Code existiert.
- Output: `APPROVED` oder `CHANGES_REQUIRED` (pro Blocker: Step-Nr., Problem, Umformulierung).

**Merksatz:** Ohne `APPROVED` kein Test.

---

## Skill 2 · generate-playwright-test-from-spec

**Auslöser:** aus einer geprüften Spec (`APPROVED`) soll Playwright-Code entstehen.

- Implementiert nur das Spec-Verhalten; erfindet nichts dazu.
- Dateiname = Spec-Dateiname mit `.test.ts`; `test.describe` zitiert die Spec-Überschrift ohne ID.
- Jeder Assertion-Block trägt den ganzen Spec-Step-Text als Kommentar: `// Schritt N: <voller Schritttext>` → Test bleibt rückverfolgbar und greppbar.
- Selektor-Priorität: Role/Test-ID → Label/Placeholder → sichtbarer Text → stabile IDs; immer smallest element, nie `body`.
- Pro Tabellenzeile ein eigener `test()`-Block; Neues App-Wissen wandert in `learnings.md` — immer allgemein, ohne Verweise auf konkrete Specs oder Tests.
- Keine statischen Waits und keine breiten Retries: auf beobachtbare Bedingungen warten.
- Abgeschlossen erst, wenn der Test läuft oder ein Blocker dokumentiert ist.
- Tests laufen sichtbar (headed); `slowMo` nur im finalen Demo-Lauf.
- Regeneration statt Reparatur: Jede Spec-Änderung und jeder Testfehler führen zu einer kompletten Neugenerierung aus Spec + `learnings.md` — nie ein Hand-Edit am Test.

**Merksatz:** Der Test implementiert die Spec — nichts anderes.

---

## Skill 3 · debug-playwright-test-failure

**Auslöser:** ein aus einer Spec generierter Test schlägt fehl, flackert oder liefert ein unerwartetes Ergebnis.

- Pflicht-Loop: kleinster reproduzierbarer Lauf → Fehler/Trace/Screenshot/Spec-Step prüfen → Ursache klassifizieren → Aktion → gleicher Test erneut.
- Ursachenklassen: `SPEC` (Spec fixen), `TEST_CODE` (bestehenden Test nur zur Diagnose debuggen), `APP_UNDER_TEST` (Defekt melden, nicht maskieren), `ENVIRONMENT` (Blocker dokumentieren).
- Bei `TEST_CODE`: nach der Diagnose **Test aus Spec + `learnings.md` neu generieren, nie patchen**; Learnings vorher sichern.
- Bei `APP_UNDER_TEST`/`ENVIRONMENT`: Blocker dokumentieren; nach Behebung ebenfalls komplett neu generieren, nie die alte Fassung weiterverwenden.
- Keine arbiträren Waits, keine breiten Retries: Ursache beheben oder Blocker dokumentieren.
- Wiederverwendbare Erkenntnisse → `learnings.md`, Einzelfall-Observationen nicht. Einträge bleiben allgemein: keine Verweise auf konkrete Specs oder Tests.

**Merksatz:** Diagnose am alten Test, Fix als Neugenerierung.

---

## Skill 4 · testmanager

**Auslöser:** vor jedem Commit mit geänderten oder neuen Specs.

- Prüft alle Specs im Verbund (nicht nur die geänderten) auf vier Bereiche:
  1. **Test-Pyramide / Business Value** — Tabellenzeilen testen wirklich verschiedene Sachen? Grenzwerte nur mit Begründung.
  2. **Ähnliche Tests** — gleicher Bereich + gleiche oder ähnliche Assertions = Flag, auch bei anderer Wortwahl.
  3. **Konsolidierung** — ähnliche Setup-Tests merge-fähig? Vorschlag mit Kosten-Nutzen.
  4. **Spec-Test-Traceability** — identischer Dateiname (nur Endung anders), Frontmatter-`id` = Dateinamen-Präfix und nicht in der Überschrift, Schritt-Kommentare zitieren die aktuelle Spec wörtlich (`// Schritt N:`)? Abweichung oder veraltete Kommentare = `high`, Fix nur per Neugenerierung.
- Output: `PASS` oder `FINDINGS` mit Severity `high|medium|low`, dazu Bereich, Dateien, Problem, Vorschlag.

**Merksatz:** Kein Test deckt ab, was ein anderer schon beweist.

---

## AGENTS.md · Leitplanken

- Specs sind die fachliche Wahrheit; jede Spec entsteht live im sichtbaren Browser.
- Tests werden nur aus geprüfter Spec + `learnings.md` generiert und sichtbar (headed) ausgeführt; `slowMo` nur im finalen Demo-Lauf.
- Spec-Änderung oder Testfehler → komplette Neugenerierung, nie In-Place-Reparatur.
- `learnings.md`: nur allgemeine, wiederverwendbare Erkenntnisse — keine Verweise auf konkrete Specs oder Tests.
- Vor jedem Commit mit geänderten oder neuen Specs: testmanager.

**Merksatz:** Alles fließt aus Spec und Learnings — nichts wird am Test gepatcht.
