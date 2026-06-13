# Agent Instructions

Diese Datei enthält verbindliche Arbeitsanweisungen und Richtlinien für KI-Agenten, die in diesem Projekt arbeiten. 
Alle KI-Assistenten MÜSSEN sich strikt an die hier definierten Prozesse halten.

## Spec-Format & Stil

Specs werden geschrieben, als würdest du einen menschlichen Tester per Navigationsanweisung durch die App steuern.

- **Imperativ geschrieben** – "Klicke auf ...", "Navigiere zu ...", "Gib ... ein"
- **Keine technischen Selektoren** (IDs, CSS-Klassen, `aria-label`) in der Spec. Stattdessen Beschreibung via Kontext, Position und Zweck:
  - ✅ `"Klicke auf das Warenkorb-Symbol in der oberen rechten Navigationsleiste"`
  - ❌ `"Klicke auf button[aria-label='Show the shopping cart']"`
- **Jede Zeile enthält genau einen logischen Schritt aus Benutzersicht** – keine Mikro-Steuerung:
  - ✅ `"Suche nach 'Apple Pomace' und lege 3 Stück in den Warenkorb"` (ein zusammenhängender Vorgang)
  - ✅ `"Fülle das Adressformular mit Testland, Peter Meier, 91122222, 90422, Testerstraße 44, [city] aus"`
  - ❌ `"Gib Land ein"` → `"Gib Name ein"` → `"Gib Mobilnummer ein"` ... (jedes Feld einzeln = zu granular)
  - ❌ `"Lege 'Apple Pomace' in den Warenkorb und schließe das Suchfeld"` (zwei unzusammenhängende Aktionen)
- **Aktion und Verifikation sind getrennte Schritte** – das ist die EINZIGE strikte Trennung:
  - ✅ `"Suche nach 'Apple Juice' und lege es in den Warenkorb"` → nächste Zeile: `"Verifiziere dass das Warenkorb-Symbol die Anzahl 1 anzeigt"`
  - ❌ `"Füge das Produkt hinzu und prüfe ob sich die Anzahl erhöht"`
- **Verifikationen beschreiben die konkrete Erwartung** (Was? Wo?):
  - ✅ `"Verifiziere dass in der Bestellbestätigung unter 'Delivery Address' der Text '5 days' steht"`
  - ❌ `"Prüfe dass die Seite korrekt ist"`
- **Testdaten sind explizit** (innerhalb eines logischen Schritts):
  - ✅ `"Fülle das Adressformular mit Testland, Peter Meier, 91122222 aus"`
  - ✅ `"Gib als Land 'Testland' ein"` (wenn es der einzige Schritt zum Ausfüllen ist)
  - ❌ `"Gib ein valides Land ein"`
- **Navigator-Stil**: "Navigiere zum Login (`/#/login`)" für URL-Angaben ist erlaubt – beschreibt das Ziel, nicht den technischen Pfad

## Spec-Review (VOR der Test-Generierung)

Bevor ein Test generiert wird, MUSS die Spec auf die folgenden Kriterien geprüft werden.
Bei Verstößen FRAGT DER AGENT AKTIV NACH und macht ggf. Verbesserungsvorschläge:

| Problem | Reaktion |
|---------|----------|
| Aktion + Verifikation kombiniert (`"Lege X in Warenkorb und prüfe Y"`) | Nachfragen und Trennung vorschlagen |
| Mikro-Steuerung (`"Gib Land ein"` einzeln für jedes Feld) | Vorschlagen, in einen logischen Schritt zusammenzufassen |
| Zwei unzusammenhängende Aktionen (`"Lege in Warenkorb und schließe Suchfeld"`) | Nachfragen und Trennung vorschlagen |
| Vage Aktion (`"Klicke Button"`) | Nachfragen: *Welcher Button? Wo steht er? Welche Beschriftung?* |
| Vage Verifikation (`"Prüfe dass Seite korrekt"`) | Nachfragen: *Was genau muss sichtbar sein? Ein Text? Ein Element? Eine URL?* |
| Ungenaue Testdaten (`"valide Adresse"`) | Nachfragen: *Welche konkreten Werte sollen verwendet werden?* |
| Unklare Auswahl (`"Wähle Versandart"`) | Nachfragen: *Welche Option? Günstigste (5 Tage) oder schnellste (2 Tage)?* |
| Mehrdeutige Beschreibung | Nachfragen und ggf. Positionsangabe erfragen |

Die Spec-Review ist **blockierend**: Ohne eine klare, präzise Spec wird kein Test generiert.

## Test-Erstellung

Tests werden auf Basis der geprüften und freigegebenen Spezifikationen im Ordner `specs/` geschrieben.

Jede Spec MUSS als Tag entweder `desktop` (Default-Viewport 1280×720) oder `mobile` (Viewport 390×844 per `test.use()`) angeben.

**Vorgehen:**
1. `learnings.md` auf relevante Patterns prüfen
2. Spec-Review durchführen (s.o.)
3. Test schreiben – dabei den Test immer wieder mit `npx playwright test --headed` ausführen, um Selektoren und Abläufe im Browser zu prüfen und zu korrigieren
4. Finale Verifikation: `npx playwright test --headed`
5. Falls neue Erkenntnisse gewonnen: in `learnings.md` dokumentieren

## Assertions & Selektoren im generierten Code

- **Jeder Assertion-Block wird via `// Schritt N` auf den Spec-Step referenziert**
  - Beispiel: Spec-Step `5. Verifiziere dass der Gesamtpreis 80.76€ beträgt` → im Code `// Schritt 5`
  - Dies ermöglicht im manuellen Code-Review zu prüfen, ob jeder Spec-Step korrekt verifiziert wird
- **`page.locator('body')` ist NICHT zulässig**
  - Jede Assertion braucht einen eindeutigen Selektor
  - Die KI leitet aus der präzisen Beschreibung in der Spec den passenden Selektor ab
- **Selektoren nach Bestimmtheit priorisieren**:
  1. `data-testid` / `data-test` (wenn vorhanden)
  2. `aria-label` / `role`
  3. `id` / `#id`
  4. Eindeutige Textkombination via `:has-text()` / `filter()`
  5. Semantische Selektoren (`button`, `input`, `mat-row` + Kontext)

## Prozess zur Beseitigung von Test-Fehlern (STRIKT)

Wenn ein Test fehlschlägt, ist ZWINGEND das folgende Vorgehen zur Fehlerbehebung einzuhalten:

1. **Fehlerhaften Test ausführen und Fehler identifizieren:** 
   Führe den betroffenen Test aus und analysiere die Fehlermeldung, Logs und den Kontext präzise.

2. **Fehlerursache prüfen (Spec vs. Code):** 
   Identifiziere, ob der Fehler durch eine ungenaue Spezifikation (`specs/`) oder durch fehlerhaften Code im Test verursacht wird.

3. **Bei ungenauer Spec -> Anwender fragen oder korrigieren:** 
   Ist die Spec ungenau oder unvollständig, frage den Anwender oder korrigiere die Spec direkt, falls die korrekten Werte bekannt sind.

4. **Bei Code-Fehler -> Test korrigieren & Learning sichern:** 
   Ist die Spec in Ordnung, korrigiere den Test-Code direkt (z. B. Selektoren, Timing, Logik).
   Dokumentiere die Erkenntnis anschließend in `learnings.md`, damit der Fehler in zukünftigen Tests nicht wieder auftritt.

5. **Test verifizieren:** 
   Führe den korrigierten Test aus und prüfe zwingend, dass er erfolgreich ausgeführt wird.

6. **Iterieren:** 
   Falls der Test erneut nicht erfolgreich ausgeführt wird, beginne den Prozess zwingend wieder bei Schritt 1.
