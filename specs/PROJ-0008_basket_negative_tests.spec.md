---
tags: [regression, mobile]
---

# PROJ-0008: Juice Shop Basket Negative Tests

## Scenario: Checkout with empty basket is not possible

1. Navigiere zur Login-Seite (`/#/login`)
2. Schließe den Welcome-Banner und den Cookie-Consent-Banner
3. Registriere einen neuen Benutzer mit einer eindeutigen E-Mail und Passwort SuperSafe123!
4. Logge dich mit der erstellten E-Mail und SuperSafe123! ein
5. Navigiere direkt zum Warenkorb (`/#/basket`), ohne Produkte hinzuzufügen
6. Verifiziere dass der "Checkout"-Button deaktiviert ist

## Scenario: Remove all items from basket leaves basket empty

1. Navigiere zur Login-Seite (`/#/login`)
2. Schließe den Welcome-Banner und den Cookie-Consent-Banner
3. Registriere einen neuen Benutzer mit einer eindeutigen E-Mail und Passwort SuperSafe123!
4. Logge dich mit der erstellten E-Mail und SuperSafe123! ein
5. Navigiere zur Startseite (`/`)
6. Suche nach "Apple Juice" und lege genau 1 Stück in den Warenkorb
7. Navigiere zum Warenkorb (`/#/basket`)
8. Lösche den Artikel aus dem Warenkorb
9. Verifiziere dass die Artikelzeile nicht mehr sichtbar ist
10. Verifiziere dass der "Checkout"-Button deaktiviert ist