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
} from '../types';
import { initialMilestones, initialNews } from '../data/initialData';
import {
  shouldNotify,
  sendPushNotification,
  buildStatusChangeMessage,
} from '../utils/notifications';

interface AppState {
  milestones: Milestone[];
  news: NewsItem[];
  notifications: AppNotification[];
  notificationSettings: NotificationSettings;
  filters: FilterState;

  updateMilestoneStatus: (id: string, status: MilestoneStatus) => void;
  updateMilestoneNotes: (id: string, notes: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  toggleSectionNotification: (sectionId: SectionId) => void;
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

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      milestones: initialMilestones,
      news: initialNews,
      notifications: [],
      notificationSettings: defaultNotificationSettings,
      filters: { section: 'all', status: 'all' },

      updateMilestoneStatus: (id, status) => {
        const state = get();
        const milestone = state.milestones.find((m) => m.id === id);
        if (!milestone || milestone.status === status) return;

        const today = new Date().toISOString().split('T')[0];
        const updatedMilestones = state.milestones.map((m) =>
          m.id === id ? { ...m, status, lastUpdated: today } : m
        );

        if (
          shouldNotify(status, milestone.sectionId, state.notificationSettings.sections)
        ) {
          const message = buildStatusChangeMessage(milestone.name, status);
          const notification: AppNotification = {
            id: `notif-${Date.now()}`,
            milestoneId: id,
            milestoneName: milestone.name,
            sectionId: milestone.sectionId,
            status,
            message,
            timestamp: new Date().toISOString(),
            read: false,
          };

          set({
            milestones: updatedMilestones,
            notifications: [notification, ...state.notifications],
          });

          if (state.notificationSettings.pushEnabled) {
            sendPushNotification('SPCX Milestone Update', message, id);
          }
        } else {
          set({ milestones: updatedMilestones });
        }
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
      }),
    }
  )
);