# Gümper Znacht Registration Website

A registration website for the annual "Gümper Znacht" event with Stripe payment integration and Google Sheets data storage.

## Features

- ✅ Register multiple people (with option to add more)
- ✅ Form validation (mandatory fields: Vorname, Name, Tel., Option)
- ✅ Stripe payment integration (CHF 170 per person)
- ✅ Google Sheets integration via Google Apps Script
- ✅ Modern blue gradient design matching the event theme
- ✅ Deployed on Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Google Apps Script Web App URL
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 3. Google Apps Script Setup

1. Open [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Go to **Extensions > Apps Script**
4. Copy the code from `google-apps-script/Code.gs` into the script editor
5. Save the project (give it a name like "Gümper Znacht Registration")
6. Click **Deploy > New deployment**
7. Select type: **Web app**
8. Set:
   - **Execute as**: Me
   - **Who has access**: Anyone
9. Click **Deploy**
10. Copy the **Web App URL** and add it to your `.env.local` file as `GOOGLE_APPS_SCRIPT_URL`

### 4. Stripe Setup

1. Create a [Stripe account](https://stripe.com) (or use existing)
2. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Add the keys to your `.env.local` file:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_`)
   - `STRIPE_SECRET_KEY` (starts with `sk_`)

### 5. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Deploy to Vercel (inkl. www.guemperznacht.ch & Stripe Live)

**A) Code bereitstellen**

1. Projekt in ein **Git-Repository** legen (falls noch nicht geschehen):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Repo auf **GitHub** pushen und in [Vercel](https://vercel.com) **Import** wählen (oder bestehendes Vercel-Projekt mit Domain verbinden).

**B) Domain www.guemperznacht.ch**

- Domain ist bei dir bereits auf Vercel gekauft/gehosted → in Vercel unter **Project → Settings → Domains** prüfen, dass `www.guemperznacht.ch` (und ggf. `guemperznacht.ch`) dem Projekt zugeordnet sind.

**C) Stripe auf Live umstellen**

1. Im [Stripe Dashboard](https://dashboard.stripe.com) oben von **Testmodus** auf **Live** umschalten.
2. Unter **Developers → API keys** die **Live-Keys** kopieren:
   - **Publishable key** (beginnt mit `pk_live_...`)
   - **Secret key** (beginnt mit `sk_live_...`) – nur einmal anzeigen lassen und sicher speichern.
3. Optional: Unter **Settings → Payment methods** prüfen, welche Zahlungsmethoden (Karte, TWINT etc.) für Live aktiv sind.

**D) Umgebungsvariablen in Vercel**

1. Vercel → dein Projekt → **Settings → Environment Variables**.
2. Für **Production** (und ggf. Preview) eintragen:

   | Name | Wert | Hinweis |
   |------|------|--------|
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Live Publishable Key von Stripe |
   | `STRIPE_SECRET_KEY` | `sk_live_...` | Live Secret Key von Stripe |
   | `GOOGLE_APPS_SCRIPT_URL` | deine Web-App-URL | wie in `.env.local` |

3. **Save** – danach einen neuen **Redeploy** auslösen (Deployments → … → Redeploy), damit die neuen Variablen geladen werden.

**E) Nach dem Deployment prüfen**

- https://www.guemperznacht.ch öffnen.
- Anmeldung mit einer Person testen und mit einer **echten Karte** (kleiner Betrag) bezahlen.
- In Stripe Dashboard **Live → Payments** prüfen, ob die Zahlung erscheint.
- Prüfen, ob die Zeile in Google Sheets ankommt.
- Erfolgsseite und Weiterleitung nach Zahlung prüfen.

Die `return_url` nach der Zahlung nutzt automatisch die aktuelle Domain (`window.location.origin`), auf Live also https://www.guemperznacht.ch/success.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── create-payment-intent/  # Stripe payment intent creation
│   │   └── submit-registration/    # Google Sheets submission
│   ├── success/                    # Payment success page
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main registration page
├── components/
│   ├── PersonForm.tsx              # Individual person form
│   ├── PaymentSection.tsx         # Stripe payment component
│   └── RegistrationForm.tsx       # Main registration form
├── types/
│   └── index.ts                    # TypeScript types
├── google-apps-script/
│   └── Code.gs                     # Google Apps Script code
└── package.json
```

## Form Fields

### Mandatory Fields (per person):
- Vorname (First Name)
- Name (Last Name)
- Tel. (Phone)
- Option (Vegi/Vegan/Fleisch)

### Optional Fields:
- Email
- Allergien (Allergies)

## Payment

- Price per person: CHF 170.00
- Payment processor: Stripe
- Currency: CHF (Swiss Francs)

## Data Storage

All registration data is automatically saved to Google Sheets with the following columns:
- Zeitstempel (Timestamp)
- Payment Intent ID
- Vorname
- Name
- Telefon
- Email
- Option
- Allergien
- Betrag (CHF)

## License

Private project for Gümper Znacht event.
