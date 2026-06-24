import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Milestone,
  MilestoneStatus,
  NewsItem,
  AppNotification,
  NotificationSettings,
  FilterState,
  SectionId,
  MilestonesStatusFile,
} from '../types';
import { initialMilestones, initialNews } from '../data/initialData';
import {
  shouldNotify,
  sendPushNotification,
  buildStatusChangeMessage,
} from '../utils/notifications';

const STATUS_RANK: Record<MilestoneStatus, number> = {
  'non-iniziato': 0,
  'in-corso': 1,
  'ritardato': 2,
  'raggiunto': 3,
};

interface AppState {
  milestones: Milestone[];
  news: NewsItem[];
  notifications: AppNotification[];
  notificationSettings: NotificationSettings;
  filters: FilterState;
  autoSyncEnabled: boolean;
  lastAutoSyncAt: string | null;
  lastAutoSyncFeedCount: number;

  updateMilestoneStatus: (id: string, status: MilestoneStatus) => void;
  updateMilestoneNotes: (id: string, notes: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  toggleSectionNotification: (sectionId: SectionId) => void;
  setAutoSyncEnabled: (enabled: boolean) => void;
  syncFromRemote: (data: MilestonesStatusFile) => void;
  addNewsItem: (item: Omit<NewsItem, 'id' | 'isManual'>) => void;
  deleteNewsItem: (id: string) => void;
  getMilestoneById: (id: string) => Milestone | undefined;
  getUnreadCount: () => number;
}

const defaultNotificationSettings: NotificationSettings = {
  pushEnabled: true,
  inAppEnabled: true,
  sections: {
    starship: true,
    starlink: true,
    xai: true,
    financials: true,
  },
};

function applyStatusChange(
  state: AppState,
  id: string,
  status: MilestoneStatus,
  options: {
    source: 'manual' | 'auto';
    evidence?: string;
    evidenceUrl?: string;
    autoMessage?: string;
  }
): Partial<AppState> | null {
  const milestone = state.milestones.find((m) => m.id === id);
  if (!milestone || milestone.status === status) return null;

  const today = new Date().toISOString().split('T')[0];
  const updatedMilestones = state.milestones.map((m) =>
    m.id === id
      ? {
          ...m,
          status,
          lastUpdated: today,
          statusSource: options.source,
          autoEvidence: options.evidence ?? m.autoEvidence,
          autoEvidenceUrl: options.evidenceUrl ?? m.autoEvidenceUrl,
        }
      : m
  );

  const baseMessage =
    options.autoMessage ??
    buildStatusChangeMessage(milestone.name, status);

  const message =
    options.source === 'auto'
      ? `🤖 Auto-rilevamento: ${baseMessage}`
      : baseMessage;

  if (shouldNotify(status, milestone.sectionId, state.notificationSettings.sections)) {
    const notification: AppNotification = {
      id: `notif-${Date.now()}-${id}`,
      milestoneId: id,
      milestoneName: milestone.name,
      sectionId: milestone.sectionId,
      status,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    if (state.notificationSettings.pushEnabled) {
      sendPushNotification('SPCX Milestone Update', message, id);
    }

    return {
      milestones: updatedMilestones,
      notifications: [notification, ...state.notifications],
    };
  }

  return { milestones: updatedMilestones };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      milestones: initialMilestones.map((m) => ({ ...m, statusSource: 'initial' as const })),
      news: initialNews,
      notifications: [],
      notificationSettings: defaultNotificationSettings,
      filters: { section: 'all', status: 'all' },
      autoSyncEnabled: true,
      lastAutoSyncAt: null,
      lastAutoSyncFeedCount: 0,

      updateMilestoneStatus: (id, status) => {
        const patch = applyStatusChange(get(), id, status, { source: 'manual' });
        if (patch) set(patch);
      },

      updateMilestoneNotes: (id, notes) => {
        set({
          milestones: get().milestones.map((m) =>
            m.id === id ? { ...m, personalNotes: notes } : m
          ),
        });
      },

      setFilters: (filters) => {
        set({ filters: { ...get().filters, ...filters } });
      },

      markNotificationRead: (id) => {
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        });
      },

      markAllNotificationsRead: () => {
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
        });
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      updateNotificationSettings: (settings) => {
        set({
          notificationSettings: { ...get().notificationSettings, ...settings },
        });
      },

      toggleSectionNotification: (sectionId) => {
        const current = get().notificationSettings;
        set({
          notificationSettings: {
            ...current,
            sections: {
              ...current.sections,
              [sectionId]: !current.sections[sectionId],
            },
          },
        });
      },

      setAutoSyncEnabled: (enabled) => {
        set({ autoSyncEnabled: enabled });
      },

      syncFromRemote: (data) => {
        const state = get();
        let nextMilestones = [...state.milestones];
        let nextNotifications = [...state.notifications];
        let changed = false;

        for (const milestone of nextMilestones) {
          if (milestone.statusSource === 'manual') continue;

          const remote = data.updates[milestone.id];
          if (!remote || remote.status === 'non-iniziato' || !remote.evidence) continue;

          const shouldApply =
            STATUS_RANK[remote.status] > STATUS_RANK[milestone.status] ||
            (remote.status === milestone.status &&
              remote.evidence !== milestone.autoEvidence);

          if (!shouldApply) continue;

          const patch = applyStatusChange(
            { ...state, milestones: nextMilestones, notifications: nextNotifications },
            milestone.id,
            remote.status,
            {
              source: 'auto',
              evidence: remote.evidence,
              evidenceUrl: remote.evidenceUrl ?? undefined,
              autoMessage: `${milestone.name} → ${remote.status}. Fonte: "${remote.evidence}"`,
            }
          );

          if (patch) {
            if (patch.milestones) nextMilestones = patch.milestones;
            if (patch.notifications) nextNotifications = patch.notifications;
            changed = true;
          }
        }

        const autoNews: NewsItem[] = data.recentNews
          .filter((n) => !state.news.some((existing) => existing.title === n.title))
          .map((n) => ({
            id: `auto-news-${n.title.slice(0, 30)}`,
            title: n.title,
            summary: `Rilevamento automatico per milestone correlato.`,
            source: n.source,
            date: n.date,
            url: n.url,
            sectionId: n.milestoneId as SectionId,
            isManual: false,
          }));

        set({
          ...(changed
            ? { milestones: nextMilestones, notifications: nextNotifications }
            : {}),
          ...(autoNews.length > 0 ? { news: [...autoNews, ...state.news] } : {}),
          lastAutoSyncAt: data.lastChecked,
          lastAutoSyncFeedCount: data.feedCount,
        });
      },

      addNewsItem: (item) => {
        const newItem: NewsItem = {
          ...item,
          id: `news-${Date.now()}`,
          isManual: true,
        };
        set({ news: [newItem, ...get().news] });
      },

      deleteNewsItem: (id) => {
        set({ news: get().news.filter((n) => n.id !== id) });
      },

      getMilestoneById: (id) => get().milestones.find((m) => m.id === id),

      getUnreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: 'spcx-milestone-tracker',
      partialize: (state) => ({
        milestones: state.milestones,
        news: state.news,
        notifications: state.notifications,
        notificationSettings: state.notificationSettings,
        autoSyncEnabled: state.autoSyncEnabled,
        lastAutoSyncAt: state.lastAutoSyncAt,
        lastAutoSyncFeedCount: state.lastAutoSyncFeedCount,
      }),
    }
  )
);