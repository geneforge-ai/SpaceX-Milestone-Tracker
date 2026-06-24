# SpaceX Milestone Tracker

Dashboard per investitori di lungo termine di SpaceX (ticker **SPCX**) per monitorare i milestone chiave dell'azienda.

## Sezioni

- **Starship** — voli orbitali, refueling, equipaggio, cadenza lanci
- **Starlink** — abbonati, Direct-to-Cell, redditività
- **xAI Integration** — sinergie SpaceX + xAI, compute orbitale
- **Financials & Corporate** — earnings, margini, cash flow

## Funzionalità

- Dashboard con overview e filtri per sezione/stato
- Cambio stato manuale e note personali per ogni milestone
- Notifiche in-app e push (Raggiunto / Ritardato)
- News & Updates (feed simulato + aggiunta manuale)
- Export CSV e PDF
- Persistenza locale (localStorage)
- Design responsive, stile fintech/investor

## Avvio rapido

```bash
npm install
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173)

## Demo live

**https://geneforge-ai.github.io/SpaceX-Milestone-Tracker/**

## Build

```bash
npm run build
npm run preview
```

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Zustand (state + persist)
- jsPDF (export PDF)

## Disclaimer

Strumento di monitoraggio personale. Non costituisce consulenza finanziaria.