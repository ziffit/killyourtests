---
tags: [regression, mobile]
---

# PROJ-0009: Juice Shop Password Reset Flow

## Vorbedingung

Die Sprache der Anwendung ist auf Deutsch eingestellt.

## Scenario: Reset the password via security question and log in with the new password

1. Gehe zur testbereiten Login-Seite (`/#/login`)
2. Klicke auf "Noch kein Kunde?"
3. Registriere einen neuen Benutzer mit einer eindeutigen E-Mail-Adresse, dem Passwort SuperSafe123!, der Sicherheitsfrage "Zweitname deines ältesten Geschwisters?" und der Antwort "Alex"
4. Verifiziere dass die Meldung "Registrierung erfolgreich abgeschlossen. Du kannst dich jetzt anmelden." angezeigt wird
5. Klicke auf "Passwort vergessen?"
6. Gib die E-Mail-Adresse des neuen Benutzers ein
7. Beantworte die Sicherheitsfrage mit "Alex"
8. Lege das neue Passwort NewPass456! fest
9. Klicke auf "Ändern"
10. Verifiziere dass die Meldung "Dein Passwort wurde erfolgreich geändert." angezeigt wird
11. Gehe zur testbereiten Login-Seite (`/#/login`)
12. Melde dich mit der E-Mail-Adresse des neuen Benutzers und dem neuen Passwort NewPass456! an
13. Verifiziere dass das Warenkorb-Symbol oben rechts in der Navigationsleiste sichtbar ist
14. Öffne das Seitenmenü und klicke auf "Abmelden"
15. Gehe zur testbereiten Login-Seite (`/#/login`)
16. Versuche dich mit der E-Mail-Adresse des neuen Benutzers und dem alten Passwort SuperSafe123! anzumelden
17. Verifiziere dass die Fehlermeldung "Email-Adresse oder Passwort ungültig." angezeigt wird
