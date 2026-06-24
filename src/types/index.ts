export type MilestoneStatus = 'non-iniziato' | 'in-corso' | 'raggiunto' | 'ritardato';

export type SectionId = 'starship' | 'starlink' | 'xai' | 'financials';

export interface Section {
  id: SectionId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Milestone {
  id: string;
  sectionId: SectionId;
  name: string;
  description: string;
  expectedPeriod: string;
  status: MilestoneStatus;
  lastUpdated: string;
  source: string;
  personalNotes: string;
  details: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  url?: string;
  sectionId?: SectionId;
  isManual: boolean;
}

export interface AppNotification {
  id: string;
  milestoneId: string;
  milestoneName: string;
  sectionId: SectionId;
  status: MilestoneStatus;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  inAppEnabled: boolean;
  sections: Record<SectionId, boolean>;
}

export interface FilterState {
  section: SectionId | 'all';
  status: MilestoneStatus | 'all';
}

export const STATUS_LABELS: Record<MilestoneStatus, string> = {
  'non-iniziato': 'Non iniziato',
  'in-corso': 'In corso',
  'raggiunto': 'Raggiunto',
  'ritardato': 'Ritardato',
};

export const SECTIONS: Section[] = [
  {
    id: 'starship',
    name: 'Starship',
    description: 'Sviluppo e operazioni del veicolo di lancio riutilizzabile',
    icon: 'rocket',
    color: '#3b82f6',
  },
  {
    id: 'starlink',
    name: 'Starlink',
    description: 'Rete satellitare globale e servizi di connettività',
    icon: 'satellite',
    color: '#8b5cf6',
  },
  {
    id: 'xai',
    name: 'xAI Integration',
    description: 'Sinergie tra SpaceX e xAI per compute e infrastruttura',
    icon: 'brain',
    color: '#06b6d4',
  },
  {
    id: 'financials',
    name: 'Financials & Corporate',
    description: 'Metriche finanziarie e governance aziendale',
    icon: 'chart',
    color: '#10b981',
  },
];