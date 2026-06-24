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
- **Monitoraggio automatico** via GitHub Actions (RSS ogni 6h) + sync nell'app

## Avvio rapido

```bash
npm install
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173)

## Demo live

**https://geneforge-ai.github.io/SpaceX-Milestone-Tracker/**

> **Setup una tantum:** vai su [Settings → Pages](https://github.com/geneforge-ai/SpaceX-Milestone-Tracker/settings/pages) e imposta **Source: GitHub Actions**. Il deploy parte automaticamente ad ogni push su `main`.

## Monitoraggio automatico

Un workflow GitHub Actions (`milestone-monitor.yml`) analizza feed RSS ogni 6 ore, rileva avanzamenti nei milestone tramite keyword, e aggiorna `public/milestones-status.json`.

L'app sincronizza quel file automaticamente e:
- aggiorna gli stati (salvo override manuale)
- invia notifiche su Raggiunto / Ritardato
- aggiunge news rilevanti alla sezione News

```bash
npm run monitor   # esegui scan localmente
```

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