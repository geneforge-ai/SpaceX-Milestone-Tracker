import type { Milestone, NewsItem } from '../types';

const today = new Date().toISOString().split('T')[0];

export const initialMilestones: Milestone[] = [
  {
    id: 'starship-orbital-catch',
    sectionId: 'starship',
    name: 'Primo volo orbitale completo con catch del booster',
    description:
      'Completamento di un volo orbitale end-to-end con recupero del Super Heavy tramite le torri Mechazilla (chopsticks).',
    expectedPeriod: 'H2 2026',
    status: 'in-corso',
    lastUpdated: today,
    source: 'SpaceX updates, FAA filings',
    personalNotes: '',
    details:
      'Obiettivo critico per dimostrare la riusabilità completa del sistema Starship. Include decollo, separazione, orbita, rientro e cattura del booster. Prerequisito per ridurre drasticamente i costi di lancio.',
  },
  {
    id: 'starship-refueling',
    sectionId: 'starship',
    name: 'Primo test di rifornimento orbitale (refueling)',
    description:
      'Dimostrazione del trasferimento di propellente tra due navicelle Starship in orbita.',
    expectedPeriod: '2027',
    status: 'non-iniziato',
    lastUpdated: today,
    source: 'NASA Artemis program requirements',
    personalNotes: '',
    details:
      'Essenziale per le missioni Artemis e per qualsiasi operazione deep-space. Richiede multiple Starship in orbita con sistemi di accoppiamento e trasferimento criogenico.',
  },
  {
    id: 'starship-crew',
    sectionId: 'starship',
    name: 'Primo volo con equipaggio umano',
    description:
      'Missione Starship con astronauti a bordo, probabilmente nell\'ambito del programma Artemis o volo dimostrativo.',
    expectedPeriod: '2028+',
    status: 'non-iniziato',
    lastUpdated: today,
    source: 'NASA Artemis III timeline',
    personalNotes: '',
    details:
      'Richiede certificazione umana completa, test di abort, life support e multiple missioni senza equipaggio di successo. Rappresenta il passaggio da veicolo sperimentale a operativo.',
  },
  {
    id: 'starship-cadence',
    sectionId: 'starship',
    name: 'Ritmo di almeno 1 volo al mese',
    description:
      'Raggiungere una cadenza operativa sostenuta di almeno un lancio Starship al mese.',
    expectedPeriod: '2028+',
    status: 'non-iniziato',
    lastUpdated: today,
    source: 'Elon Musk statements, industry analysis',
    personalNotes: '',
    details:
      'Indicatore chiave di maturità operativa. Richiede produzione seriale di booster e navicelle, infrastruttura di lancio a Starbase e Cape Canaveral, e processi di turnaround rapidi.',
  },
  {
    id: 'starlink-subscribers',
    sectionId: 'starlink',
    name: 'Raggiungere 10-12 milioni di abbonati attivi',
    description:
      'Espansione della base utenti Starlink a 10-12 milioni di abbonati attivi globalmente.',
    expectedPeriod: 'H2 2026',
    status: 'in-corso',
    lastUpdated: today,
    source: 'SpaceX investor updates, industry estimates',
    personalNotes: '',
    details:
      'La crescita degli abbonati è il driver principale dei ricavi Starlink. Include residential, maritime, aviation e enterprise. Monitorare churn rate e ARPU.',
  },
  {
    id: 'starlink-d2c',
    sectionId: 'starlink',
    name: 'Direct-to-Cell operativo su larga scala',
    description:
      'Servizio Direct-to-Cell che permette di inviare SMS e dati direttamente a smartphone senza hardware aggiuntivo.',
    expectedPeriod: '2027',
    status: 'in-corso',
    lastUpdated: today,
    source: 'T-Mobile partnership, SpaceX FCC filings',
    personalNotes: '',
    details:
      'Partnership con operatori telco globali. Potenziale mercato enorme ma richiede constellation upgrades e accordi regolatori in ogni paese.',
  },
  {
    id: 'starlink-profitable',
    sectionId: 'starlink',
    name: 'Starlink profittevole in modo stabile',
    description:
      'Divisione Starlink con EBITDA positivo su base trimestrale ricorrente.',
    expectedPeriod: '2027',
    status: 'non-iniziato',
    lastUpdated: today,
    source: 'Musk statements, analyst estimates',
    personalNotes: '',
    details:
      'Considerato il cash cow futuro di SpaceX. Dipende da scala, costi di produzione terminali, costi di lancio e mix di servizi enterprise vs consumer.',
  },
  {
    id: 'xai-official',
    sectionId: 'xai',
    name: 'Annunci ufficiali sull\'integrazione SpaceX + xAI',
    description:
      'Comunicazioni ufficiali su partnership strategiche, investimenti incrociati o sinergie operative tra SpaceX e xAI.',
    expectedPeriod: 'H2 2026',
    status: 'in-corso',
    lastUpdated: today,
    source: 'SEC filings, corporate announcements',
    personalNotes: '',
    details:
      'Entrambe le aziende condividono ownership e visione. Potenziale integrazione su funding, talent, e infrastruttura compute.',
  },
  {
    id: 'xai-orbital-compute',
    sectionId: 'xai',
    name: 'Primo test/annuncio di compute o data center in orbita',
    description:
      'Proposta o test di infrastruttura di calcolo AI in orbita, sfruttando il raffreddamento e l\'energia solare dello spazio.',
    expectedPeriod: '2028+',
    status: 'non-iniziato',
    lastUpdated: today,
    source: 'Industry speculation, Musk/xAI roadmap hints',
    personalNotes: '',
    details:
      'Concept ancora speculativo ma strategicamente allineato con le capacità di SpaceX. Potrebbe rivoluzionare il training di modelli AI su scala.',
  },
  {
    id: 'xai-starship-launch',
    sectionId: 'xai',
    name: 'Utilizzo di Starship per lanciare hardware di xAI',
    description:
      'Lancio di payload dedicati xAI (satelliti compute, data relay) tramite Starship.',
    expectedPeriod: '2028+',
    status: 'non-iniziato',
    lastUpdated: today,
    source: 'Strategic analysis',
    personalNotes: '',
    details:
      'Starship offre capacità di payload senza precedenti. Un deployment di cluster compute orbitali richiederebbe lanci dedicati con integrazione profonda.',
  },
  {
    id: 'fin-earnings',
    sectionId: 'financials',
    name: 'Primo earnings report completo da società quotata',
    description:
      'Pubblicazione del primo report trimestrale completo dopo l\'IPO, con breakdown per divisione.',
    expectedPeriod: 'H2 2026',
    status: 'non-iniziato',
    lastUpdated: today,
    source: 'IPO prospectus expectations',
    personalNotes: '',
    details:
      'Fornirà per la prima volta visibilità su ricavi Starlink, Starship, launch services e margini. Evento catalizzatore per la valutazione SPCX.',
  },
  {
    id: 'fin-margins',
    sectionId: 'financials',
    name: 'Miglioramento dei margini e percorso verso la redditività',
    description:
      'Trend positivo nei margini operativi consolidati, con riduzione dei costi e crescita dei ricavi ad alto margine.',
    expectedPeriod: '2027',
    status: 'non-iniziato',
    lastUpdated: today,
    source: 'Analyst models, IPO financials',
    personalNotes: '',
    details:
      'SpaceX ha investito pesantemente in R&D. Il percorso verso margini sani dipende da Starlink profitability e cadence di lancio Starship.',
  },
  {
    id: 'fin-cashflow',
    sectionId: 'financials',
    name: 'Flusso di cassa positivo a livello consolidato',
    description:
      'Free cash flow positivo e sostenibile a livello di gruppo SpaceX.',
    expectedPeriod: '2028+',
    status: 'non-iniziato',
    lastUpdated: today,
    source: 'Long-term investor thesis',
    personalNotes: '',
    details:
      'Obiettivo finale per investitori di lungo termine. Richiede Starlink profittevole, Starship operativo e controllo dei capex su nuovi progetti.',
  },
];

export const initialNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Starship Flight 10: progressi nel recupero del booster',
    summary:
      'L\'ultimo test di volo ha mostrato miglioramenti significativi nella manovra di ritorno del Super Heavy, avvicinandosi al catch completo.',
    source: 'SpaceX / NASASpaceflight',
    date: '2026-06-15',
    sectionId: 'starship',
    isManual: false,
  },
  {
    id: 'news-2',
    title: 'Starlink supera i 8 milioni di abbonati',
    summary:
      'La base utenti continua a crescere rapidamente con espansione in nuovi mercati emergenti e segmento maritime.',
    source: 'Industry estimates',
    date: '2026-05-28',
    sectionId: 'starlink',
    isManual: false,
  },
  {
    id: 'news-3',
    title: 'xAI e SpaceX: sinergie infrastrutturali in discussione',
    summary:
      'Analisti evidenziano potenziali sinergie tra le capacità di lancio di SpaceX e le esigenze compute di xAI per il training di Grok.',
    source: 'Financial Times',
    date: '2026-06-01',
    sectionId: 'xai',
    isManual: false,
  },
  {
    id: 'news-4',
    title: 'SPCX: attese per il primo earnings post-IPO',
    summary:
      'Gli investitori attendono il primo report trimestrale per valutare la struttura dei ricavi e i margini per divisione.',
    source: 'Bloomberg',
    date: '2026-06-10',
    sectionId: 'financials',
    isManual: false,
  },
];