# Adoption Guide: Markdown-First-E2E-Testing

Dieser Guide beschreibt, wie du das Vorgehen aus diesem Beispielprojekt in ein neues Projekt uebernimmst.

## Zielbild

Das Zielprojekt hat eine klare Trennung zwischen fachlicher Spec, generiertem Test-Code und wachsendem Projektwissen:

```text
AGENTS.md
learnings.md
specs/
tests/
fixtures/
```

Optional kommen wiederverwendbare Skills hinzu:

```text
skills/
  review-markdown-spec/
  generate-playwright-test-from-spec/
  debug-playwright-test-failure/
```

## Schritt 1: Playbook-Dateien kopieren

Kopiere aus diesem Repository:

- `playbook/AGENTS.template.md` nach `AGENTS.md`
- `playbook/learnings.template.md` nach `learnings.md`
- `playbook/skills/` in dein Skill-Verzeichnis oder in eine dokumentierte Projektablage

Passe danach alle Pfade, Testbefehle und Projektnamen an dein Zielprojekt an.

## Schritt 2: Projektregeln anpassen

Ergaenze in `AGENTS.md` nur Regeln, die fuer alle Tests des Zielprojekts gelten:

- Wo Specs liegen.
- Wo Tests liegen.
- Welche Fixture oder Testbasis genutzt wird.
- Welche Befehle Tests ausfuehren.
- Welche Tags oder Viewports verpflichtend sind.
- Welche Dateien Agenten nicht veraendern sollen.

App-spezifische UI-Erkenntnisse gehoeren nicht in `AGENTS.md`, sondern in `learnings.md`.

## Schritt 3: Erste testbereite Seite definieren

Lege in `learnings.md` fest, wie eine Seite testbereit gemacht wird.

Beispiel:

```markdown
| Seite | URL | Vorbereitung |
|-------|-----|--------------|
| Login | `/login` | Seite oeffnen, Cookie-Banner schliessen |
```

Nutze danach in Specs die Formulierung:

```markdown
1. Gehe zur testbereiten Login-Seite (`/login`)
```

## Schritt 4: Erste Spec schreiben

Starte mit einem kleinen, stabilen Nutzerfluss.

```markdown
---
tags: [smoke, desktop]
---

# Login

## Scenario: Erfolgreicher Login

1. Gehe zur testbereiten Login-Seite (`/login`)
2. Gib die E-Mail-Adresse "test@example.com" und das Passwort "password" ein
3. Klicke auf den Login-Button
4. Verifiziere dass der Benutzername in der Navigation angezeigt wird
```

Die Spec beschreibt fachliches Verhalten. Technische Selektoren gehoeren erst in den generierten Playwright-Test.

## Schritt 5: Spec reviewen lassen

Nutze den Skill `review-markdown-spec`, bevor ein Test generiert wird.

Der Review ist blockierend. Wenn die Spec mehrdeutig ist, wird sie zuerst verbessert.

## Schritt 6: Test generieren und ausfuehren

Nutze den Skill `generate-playwright-test-from-spec`.

Der generierte Test muss:

- auf die Spec rueckverfolgbar sein,
- konkrete Assertions enthalten,
- ohne `page.locator('body')` auskommen,
- mit dem projektspezifischen Testbefehl erfolgreich laufen.

## Schritt 7: Fehler systematisch beheben

Wenn der Test fehlschlaegt, nutze `debug-playwright-test-failure`.

Entscheide immer zuerst, ob die Ursache in der Spec, im Test-Code oder in der Testumgebung liegt. Neue wiederverwendbare Erkenntnisse werden in `learnings.md` dokumentiert.

## Schritt 8: Vorgehen stabilisieren

Nach den ersten drei bis fuenf Tests pruefe:

- Sind die Spec-Regeln klar genug?
- Wiederholen sich Learnings, die in Fixtures gehoeren?
- Sind Testdaten ausreichend explizit?
- Sind Tags und Viewports konsistent?
- Sind die Skills fuer das Team auffindbar?

Passe erst danach groessere Teile des Playbooks an.

## Was nicht kopiert werden sollte

Aus diesem Beispielprojekt nicht ungeprueft uebernehmen:

- Juice-Shop-spezifische Selektoren.
- Testnutzer oder Testdaten.
- Docker-Setup.
- App-spezifische Banner-Logik.
- Spezifische Checkout- oder Warenkorb-Flows.

Diese Details gehoeren immer in die jeweilige Projektinstanz.
