# MarkupPlayRight

**KI-gestütztes E2E-Testing mit Playwright und Markdown-Spezifikationen.**

Tests werden als menschenlesbare Markdown-Dateien beschrieben (`specs/`) und von einer KI in ausführbare Playwright-Tests (`tests/`) übersetzt. Das Projekt demonstriert einen "Markup-First"-Workflow: Die fachliche Beschreibung ist der Source of Truth, der generierte Code ist Wegwerfware.

## Konzept

```
Spec (Spec.md) → KI-Review → KI generiert Test (spec.ts) → Ausführung → ggf. Spec verfeinern
```

- **Spezifikationen** in `specs/*.spec.md`: imperativ, fachlich, ohne technische Selektoren
- **Generierte Tests** in `tests/*.spec.ts`: Playwright TypeScript, mit Rückverfolgung zur Spec
- **Agent-Instructions** (`agent-instructions.md`): Regeln und Prozesse für den KI-Agenten
- **Learnings** (`learnings.md`): lebendes Dokument mit gesammelten Patterns und Fallstricken

## Voraussetzungen

- [Node.js](https://nodejs.org/) 18+
- [Docker Engine](https://docker.com/) (für die Ziel-Applikation)

## Setup

```bash
git clone <repo-url>
cd MarkupPlayRight
npm install
docker compose up -d
npx playwright install chromium
```

## Tests ausführen

```bash
npm test                    # alle Tests (headless)
npm run test:ui             # Playwright UI Mode
npx playwright test --grep @desktop   # nur Desktop-Tests
npx playwright test --grep @mobile    # nur Mobile-Tests
```

## Ziel-Applikation

Die Tests laufen gegen [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) v17.1.1 – eine bewusst unsichere Webapplikation für Sicherheitstrainings.

## Workflow für neue Tests

1. Spec in `specs/` anlegen (siehe vorhandene Specs als Vorlage)
2. Spec vom KI-Agenten reviewen lassen
3. Test generieren und ausführen lassen
4. Bei Fehlern: Spec verfeinern, nicht den Test debuggen
5. Erkenntnisse in `learnings.md` dokumentieren

## Lizenz

ISC
