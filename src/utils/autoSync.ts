import type { MilestonesStatusFile } from '../types';

const RAW_STATUS_URL =
  'https://raw.githubusercontent.com/geneforge-ai/SpaceX-Milestone-Tracker/main/public/milestones-status.json';

export function getAutoStatusUrl(): string {
  if (import.meta.env.DEV) {
    return '/milestones-status.json';
  }
  return `${RAW_STATUS_URL}?t=${Date.now()}`;
}

export async function fetchAutoStatus(): Promise<MilestonesStatusFile | null> {
  try {
    const res = await fetch(getAutoStatusUrl(), { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as MilestonesStatusFile;
  } catch {
    return null;
  }
}

export const AUTO_SYNC_INTERVAL_MS = 15 * 60 * 1000;