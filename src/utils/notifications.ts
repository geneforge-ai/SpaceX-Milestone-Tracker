import type { MilestoneStatus, SectionId } from '../types';
import { STATUS_LABELS } from '../types';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

export function sendPushNotification(
  title: string,
  body: string,
  tag?: string
): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: tag ?? 'spcx-milestone',
    requireInteraction: false,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

export function buildStatusChangeMessage(
  milestoneName: string,
  newStatus: MilestoneStatus
): string {
  return `Milestone "${milestoneName}" aggiornato a: ${STATUS_LABELS[newStatus]}`;
}

export function shouldNotify(
  newStatus: MilestoneStatus,
  sectionId: SectionId,
  sectionSettings: Record<SectionId, boolean>
): boolean {
  if (!sectionSettings[sectionId]) return false;
  return newStatus === 'raggiunto' || newStatus === 'ritardato';
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch {
    return null;
  }
}