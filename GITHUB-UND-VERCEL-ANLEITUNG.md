# GitHub & Vercel – Schritt-für-Schritt (für Einsteiger)

Diese Anleitung führt dich von null bis zum gepushten Projekt auf GitHub. Jeder Schritt ist so erklärt, dass du nichts vorher wissen musst.

---

## Voraussetzungen

### 1. Git auf dem PC installieren

- Öffne: **https://git-scm.com/download/win**
- Lade die **Windows-Version** herunter und führe den Installer aus.
- Bei den Einstellungen kannst du alles so lassen wie vorgeschlagen (einfach „Next“ klicken).
- Nach der Installation: **PowerShell oder Command Prompt neu öffnen** (wichtig, damit Git erkannt wird).

**Prüfen, ob Git da ist:**  
In PowerShell oder CMD eingeben:

```bash
git --version
```

Wenn etwas wie `git version 2.x.x` erscheint, ist Git installiert.

---

### 2. GitHub-Account erstellen (falls du noch keinen hast)

- Öffne: **https://github.com**
- Oben rechts auf **Sign up** klicken.
- E-Mail, Passwort und Benutzername wählen, Account anlegen.
- E-Mail bestätigen, wenn GitHub danach fragt.

---

## Projekt auf GitHub pushen

### Schritt 1: Projektordner im Terminal öffnen

1. **PowerShell** oder **Eingabeaufforderung (CMD)** öffnen (Windows-Taste, „PowerShell“ oder „cmd“ tippen, Enter).
2. In den Projektordner wechseln. **Genau so eingeben** (Anführungszeichen mitkopieren):

```bash
cd "C:\Users\morit\OneDrive\Desktop\Gümper Znacht"
```

3. Enter drücken. Der Prompt zeigt danach etwas wie:  
   `PS C:\Users\morit\OneDrive\Desktop\Gümper Znacht>`

---

### Schritt 2: Git im Projekt initialisieren (nur einmal nötig)

Eingeben:

```bash
git init
```

Enter. Du solltest sehen: `Initialized empty Git repository in ...`

---

### Schritt 3: Alle Dateien zum „Staging“ hinzufügen

Eingeben:

```bash
git add .
```

Enter. Der Punkt bedeutet: „alle Dateien im Ordner“. Es erscheint keine Meldung – das ist normal.

**Wichtig:** Deine Datei `.env.local` (mit den Stripe-Keys) wird **nicht** mitgepusht – sie steht in der `.gitignore`. Deine Keys bleiben nur auf deinem PC.

---

### Schritt 4: Ersten „Commit“ erstellen (Stand speichern)

Eingeben:

```bash
git commit -m "Gümper Znacht Website – bereit für Deployment"
```

Enter. Du solltest Zeilen wie `X files changed`, `create mode 100644 ...` sehen. Das ist der erste gespeicherte Stand deines Projekts.

---

### Schritt 5: Neues Repository auf GitHub anlegen

1. Im Browser zu **https://github.com** gehen und einloggen.
2. Oben rechts auf das **+** klicken → **New repository**.
3. Ausfüllen:
   - **Repository name:** z.B. `guemperznacht` (klein, keine Leerzeichen).
   - **Description:** optional, z.B. `Anmeldung Gümper Znacht 2026`.
   - **Public** auswählen.
   - **Nicht** „Add a README“ oder „Add .gitignore“ anhaken – wir haben schon Code.
4. Auf **Create repository** klicken.

Danach siehst du eine Seite mit Überschrift wie „… quick setup“ und eine URL, z.B.  
`https://github.com/DEIN-BENUTZERNAME/guemperznacht.git`  
Diese URL brauchst du im nächsten Schritt.

---

### Schritt 6: GitHub als „Remote“ hinzufügen

**Ersetze `DEIN-BENUTZERNAME` und `guemperznacht`** durch deinen echten GitHub-Benutzernamen und den echten Repo-Namen.

In PowerShell/CMD (im Projektordner) eingeben:

```bash
git remote add origin https://github.com/DEIN-BENUTZERNAME/guemperznacht.git
```

Beispiel, wenn dein Benutzername `moritzmeier` ist und das Repo `guemperznacht` heißt:

```bash
git remote add origin https://github.com/moritzmeier/guemperznacht.git
```

Enter. Keine Ausgabe = Befehl war erfolgreich.

---

### Schritt 7: Haupt-Branch umbenennen (empfohlen)

Git nutzt oft noch den alten Standard-Namen. Für GitHub/Vercel ist `main` üblich:

```bash
git branch -M main
```

Enter.

---

### Schritt 8: Code auf GitHub pushen

Eingeben:

```bash
git push -u origin main
```

Enter.

- **Falls du nach Benutzername und Passwort gefragt wirst:**  
  - Benutzername = dein **GitHub-Benutzername**.  
  - Passwort = **nicht** dein normales Passwort, sondern ein **Personal Access Token** (siehe Kasten unten).

**Personal Access Token (GitHub „Passwort“):**

1. GitHub → rechts oben auf dein Profilbild → **Settings**.
2. Links ganz unten: **Developer settings**.
3. **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**.
4. Name z.B. `Vercel Deploy`, Ablauf z.B. 90 Tage, Haken bei **repo** setzen.
5. **Generate token** → Token **einmal kopieren** und sicher aufbewahren (wird nur einmal angezeigt).
6. Bei `git push` bei „Password“ **diesen Token einfügen**, nicht dein GitHub-Passwort.

Nach erfolgreichem Push siehst du Zeilen wie `Writing objects: 100%` und `done`.  
Auf der GitHub-Seite deines Repos (F5) sollten jetzt alle Dateien sichtbar sein.

---

## Danach: Mit Vercel verbinden

1. Zu **https://vercel.com** gehen und einloggen (mit GitHub anmelden ist am einfachsten).
2. **Add New** → **Project**.
3. Dein Repo **guemperznacht** (oder wie du es genannt hast) aus der Liste wählen → **Import**.
4. Unter **Environment Variables** die drei Variablen eintragen (wie im README unter „Deploy to Vercel“):
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = dein **Live-**Key `pk_live_...`
   - `STRIPE_SECRET_KEY` = dein **Live-**Key `sk_live_...`
   - `GOOGLE_APPS_SCRIPT_URL` = dieselbe URL wie in deiner `.env.local`
5. **Deploy** klicken.

Vercel baut das Projekt und gibt dir eine URL. Deine Domain **www.guemperznacht.ch** kannst du in Vercel unter **Project → Settings → Domains** dem Projekt zuordnen.

---

## Später: Änderungen erneut pushen

Wenn du im Projekt etwas änderst und es wieder auf GitHub bringen willst:

```bash
cd "C:\Users\morit\OneDrive\Desktop\Gümper Znacht"
git add .
git commit -m "Kurze Beschreibung der Änderung"
git push
```

Danach baut Vercel bei verbundenem Repo automatisch neu (wenn „Auto-Deploy“ an ist – das ist Standard).

---

## Häufige Fehler

| Meldung / Problem | Lösung |
|-------------------|--------|
| `git` wird nicht erkannt | Git installieren (siehe oben) und **neues** Terminal-Fenster öffnen. |
| `remote add origin` → „already exists“ | Remote ist schon gesetzt. Dann nur noch `git push -u origin main` ausführen. |
| Push nach Passwort-Abfrage abgelehnt | Statt Passwort den **Personal Access Token** von GitHub verwenden. |
| Andere Fehlermeldung | Meldung kopieren und z.B. in einer Suchmaschine eingeben oder hier einfügen – dann kann man gezielt helfen. |

Wenn du bei einem konkreten Schritt hängen bleibst: Sag einfach die **Schritt-Nummer** und die **genaue Fehlermeldung** (oder einen Screenshot), dann kann man dich punktgenau durchführen.
