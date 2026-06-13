---
tags: [regression, mobile]
---

# PROJ-0006: Juice Shop Complex Checkout Flow

## Testdata Generation
- generate a random cityname. Concat one random entry from the following Lists to generate the name:
  [Groß,Klein,Mittel,Ober,Unter],[rot,blau,grün,gelb],[apfel,bannen,kirschen,rüben,kohlen,rauken],[berg,thal,dorf,furt,bach]

## Scenario: Complete a large order and verify detailed order confirmation

1. Navigiere zur Login-Seite (`/#/login`)
2. Schließe den Welcome-Banner und den Cookie-Consent-Banner
3. Registriere einen neuen Benutzer mit generierter E-Mail und Passwort SuperSafe123!
4. Logge dich mit der generierten E-Mail und SuperSafe123! ein
5. Navigiere zur Startseite (`/`)
6. Suche nach "Apple Pomace" und lege 3 Stück in den Warenkorb
7. Suche nach "Banana Juice" und lege 10 Stück in den Warenkorb
8. Suche nach "DSOMM" und lege 1 Stück in den Warenkorb
9. Suche nach "Carrot Juice (1000ml)" und lege 1 Stück in den Warenkorb
10. Navigiere zum Warenkorb (`/#/basket`)
11. Verifiziere dass der Gesamtpreis "80.76" beträgt
12. Klicke auf "Checkout"
13. Füge eine neue Adresse hinzu: Testland, Peter Meier, 91122222, 90422, Testerstraße 44, [generierter Cityname]
14. Wähle die erste Adresse aus und klicke "Continue"
15. Wähle die günstigste Versandart (5 Tage Lieferzeit) und klicke "Continue"
16. Füge eine neue Kreditkarte hinzu: Peter Meier, 1234567890123456, Ablauf 04/2099
17. Wähle die Karte aus und klicke "Continue"
18. Klicke auf "Place your order and pay"
19. Verifiziere dass in der Bestellbestätigung die Lieferzeit "5 days" beträgt
20. Verifiziere dass alle 4 bestellten Produkte (Apple Pomace, Banana Juice, DSOMM, Carrot Juice) in der Bestellübersicht aufgeführt sind
21. Verifiziere dass der Gesamtpreis auf der Bestellbestätigung "80.76" beträgt
22. Verifiziere dass "6 Bonus Points" gutgeschrieben wurden