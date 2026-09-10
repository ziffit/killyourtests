# Test-Learnings

Dieses Dokument enthaelt projektspezifische Erkenntnisse fuer die Generierung und Stabilisierung von E2E-Tests.

Vor dem Schreiben eines Tests lesen. Nach erfolgreichem Debugging oder neuen UI-Erkenntnissen aktualisieren.

## Testbereite Seiten

Beschreibe hier, was "Gehe zur testbereiten {Seite}" fuer jede relevante Seite bedeutet.

| Seite | URL | Vorbereitung |
|-------|-----|--------------|
| Startseite | `/` | Beispiel: Banner schliessen, Cookie-Consent bestaetigen |

## Wiederverwendbare Flows

Dokumentiere stabile Sequenzen wie Login, Checkout, Registrierung oder Suche.

| Flow | Zweck | Hinweise |
|------|-------|----------|
| Login | Nutzer anmelden | Testnutzer, notwendige Wartebedingungen, bekannte Fehler |

## Selektoren und UI-Patterns

Halte nur Erkenntnisse fest, die bei kuenftigen Tests wiederverwendbar sind.

- Bevorzuge Rollen- und Textselektoren.
- Dokumentiere mehrdeutige Elemente mit klarer Eingrenzung.
- Notiere instabile IDs oder Komponenten, die nicht verwendet werden sollen.

## Assertions

Dokumentiere spezifische Container oder Elemente fuer haeufige Verifikationen.

| Erwartung | Empfohlene Assertion | Grund |
|-----------|----------------------|-------|
| Beispieltext sichtbar | `await expect(locator).toContainText(...)` | Spezifischer Container statt gesamter Seite |

## Testdaten

Dokumentiere gueltige, wiederverwendbare Testdaten und Einschraenkungen.

| Bereich | Werte | Hinweise |
|---------|-------|----------|
| Adresse | Beispielwerte | Keine echten personenbezogenen Daten verwenden |

## Bekannte Fallstricke

- Beschreibe Flakiness-Ursachen, Timing-Fallen und UI-Komponenten mit Spezialverhalten.
- Dokumentiere Workarounds nur, wenn sie verifiziert und wiederverwendbar sind.
