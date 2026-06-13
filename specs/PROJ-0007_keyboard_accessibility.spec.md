---
tags: [accessibility, regression, desktop]
---

# PROJ-0007: Juice Shop Keyboard-Only Accessibility

## Scenario: Complete checkout flow using only keyboard navigation

1. Navigiere zur Login-Seite (`/#/login`)
2. Schließe den Welcome-Banner und den Cookie-Consent-Banner mit der Tastatur (Tab + Enter)
3. Navigiere per Tastatur zur Registrierung (Tab zu "Not yet a customer?", Enter)
4. Registriere einen neuen Benutzer per Tastatur mit generierter E-Mail und Passwort SuperSafe123! (Tab durch alle Felder, Pfeiltasten für Select, Enter zum Absenden)
5. Logge dich per Tastatur mit der erstellten E-Mail und SuperSafe123! ein (Tab durch Felder, Enter auf Login)
6. Navigiere zur Startseite (`/`)
7. Suche per Tastatur nach "Apple Juice" und lege es in den Warenkorb (Enter auf Such-Symbol, Tab zum Add-Button, Enter, Escape für Snackbar)
8. Suche per Tastatur nach "Banana Juice" und lege es in den Warenkorb
9. Navigiere per Tastatur zum Warenkorb (Tab zum Warenkorb-Symbol, Enter)
10. Verifiziere dass der Warenkorb beide Produkte enthält
11. Klicke per Tastatur auf "Checkout" (Tab hin, Enter)
12. Füge eine neue Adresse per Tastatur hinzu: Testland, Peter Meier, 91122222, 90422, Testerstraße 44, Tastenburg (Tab durch Felder, Enter auf Submit)
13. Wähle per Tastatur die erste Adresse aus und klicke "Continue" (Tab + Pfeiltasten + Enter)
14. Wähle per Tastatur "Standard Delivery" und klicke "Continue"
15. Füge per Tastatur eine neue Kreditkarte hinzu: Peter Meier, 1234567890123456, Ablauf 04/2099 (Tab + Pfeiltasten für Selects, Enter auf Submit)
16. Wähle per Tastatur die Karte aus und klicke "Continue"
17. Klicke per Tastatur auf "Place your order and pay"
18. Verifiziere dass die Bestellbestätigung mit einer Erfolgsmeldung angezeigt wird