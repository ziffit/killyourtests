# MarkupPlayRight

**KI-gestütztes E2E-Testing mit Playwright und Markdown-Spezifikationen.**

Tests werden als menschenlesbare Markdown-Dateien beschrieben (`specs/`) und von einer KI in ausführbare Playwright-Tests (`tests/`) übersetzt. Das Projekt demonstriert einen "Markup-First"-Workflow: Die fachliche Beschreibung ist der Source of Truth, der generierte Code ist Wegwerfware.

## Konzept

```
Spec (Spec.md) → KI-Review → KI generiert Test (spec.ts) → Ausführung → ggf. Spec verfeinern
```

- **Spezifikationen** in `specs/*.spec.md`: imperativ, fachlich, ohne technische Selektoren
- **Generierte Tests** in `tests/*.spec.ts`: Playwright TypeScript, mit Rückverfolgung zur Spec
- **Agent-Instructions** (`AGENTS.md`): Regeln und Prozesse für KI-Agenten und Menschen
- **Learnings** (`learnings.md`): lebendes Dokument mit gesammelten Patterns und Fallstricken
- **Playbook** (`playbook/`): wiederverwendbarer Kern zur Übernahme in andere Projekte

## Voraussetzungen

- [Node.js](https://nodejs.org/) 20+ (LTS empfohlen)
- [Docker](https://docker.com/) mit Compose v2 (Docker Desktop oder Engine + compose plugin)

## Setup

```bash
git clone <repo-url>
cd MarkupPlayRight
npm install
npm run setup   # installiert Chromium, startet Juice Shop, aktiviert den Git-Hook
```

## Tests ausführen

```bash
npm test                    # alle Tests (headless)
npm run test:ui             # Playwright UI Mode
npx playwright test --grep @desktop   # nur Desktop-Tests
npx playwright test --grep @mobile    # nur Mobile-Tests
```

## Fehlerbehebung

| Problem | Lösung |
|---------|--------|
| "Juice Shop did not start in time" oder Docker-Fehler | Ist Docker gestartet? Prüfen mit `docker info` und `docker compose ps` |
| Port 3000 bereits belegt | Container auf anderen Port legen, z.B. Linux/macOS: `JUICE_PORT=3100; export BASE_URL=http://127.0.0.1:3100`; Windows (PowerShell): `$env:JUICE_PORT="3100"; $env:BASE_URL="http://127.0.0.1:3100"`; dann `npm run setup` und `npm test` |
| "Executable doesn't exist" beim Testlauf | `npx playwright install chromium` |

## Ziel-Applikation

Die Tests laufen gegen [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) v17.1.1 – eine bewusst unsichere Webapplikation für Sicherheitstrainings.

Wichtig bei größerer Nutzergruppe: Jeder `npm test`-Lauf startet per `global-setup` die Shop-Datenbank neu. Führe keine zwei Testläufe gleichzeitig gegen dieselbe Juice-Shop-Instanz aus — parallel sollte jeder einen eigenen Container mit eigenem Port nutzen (siehe Fehlerbehebung).

## Workflow für neue Tests

1. Spec in `specs/` anlegen (siehe vorhandene Specs als Vorlage)
2. Spec vom KI-Agenten reviewen lassen
3. Test generieren und ausführen lassen
4. Bei Fehlern: Spec verfeinern, nicht den Test debuggen
5. Erkenntnisse in `learnings.md` dokumentieren

## Vorgehen in ein neues Projekt übernehmen

Dieses Repository ist eine Referenzimplementierung. Der wiederverwendbare Teil liegt in `playbook/` und kann ohne Juice-Shop-spezifische Details in andere Projekte kopiert werden.

### Zielstruktur im neuen Projekt

```text
AGENTS.md
learnings.md
specs/
tests/
fixtures/
```

Optional können die Prozess-Skills aus `playbook/skills/` übernommen werden:

```text
skills/
  review-markdown-spec/
  generate-playwright-test-from-spec/
  debug-playwright-test-failure/
  testmanager/
```

### Startschritte

1. Kopiere `playbook/AGENTS.template.md` nach `AGENTS.md` im Zielprojekt.
2. Kopiere `playbook/learnings.template.md` nach `learnings.md`.
3. Kopiere bei Bedarf `playbook/skills/` in das Skill-Verzeichnis deines KI-Tools oder dokumentiere den Pfad im Projekt.
4. Passe in `AGENTS.md` die Projektpfade, Testbefehle, Fixture-Regeln, Tags und Viewports an.
5. Definiere in `learnings.md` die erste "testbereite Seite", z. B. Login oder Startseite.
6. Schreibe die erste kleine Spec in `specs/`.
7. Lasse die Spec reviewen, generiere daraus den Playwright-Test und führe ihn aus.
8. Ergänze neue app-spezifische Erkenntnisse in `learnings.md`.

Nicht kopieren solltest du Juice-Shop-spezifika aus diesem Beispielprojekt: konkrete Selektoren, Testdaten, Docker-Setup, Banner-Logik und Checkout-Flows. Diese Details gehören immer in das jeweilige Zielprojekt.

Eine ausführliche Anleitung steht in [`playbook/adoption-guide.md`](playbook/adoption-guide.md).

## Lizenz

ISC
