/**
 * Force-update check: compares app version to a minimum required version
 * fetched from a remote config. When you release a new store build, update
 * version.json (minVersion) and host it at versionCheckUrl so older clients
 * are prompted to update.
 */

import Constants from 'expo-constants';

export interface VersionConfig {
  minVersion: string;
  message?: string;
}

const DEFAULT_VERSION = '0.0.0';

/** Parse "1.2.3" into [1, 2, 3]; non-numeric parts treated as 0 */
function parseVersion(version: string): number[] {
  const parts = (version || DEFAULT_VERSION).replace(/^v/i, '').split('.');
  return parts.map((p) => {
    const n = parseInt(p, 10);
    return Number.isNaN(n) ? 0 : n;
  });
}

/** Returns true if current < required (update required) */
export function isUpdateRequired(current: string, minRequired: string): boolean {
  const a = parseVersion(current);
  const b = parseVersion(minRequired);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const va = a[i] ?? 0;
    const vb = b[i] ?? 0;
    if (va < vb) return true;
    if (va > vb) return false;
  }
  return false;
}

/** Fetch remote version config. Returns null on error or in dev (no forced update). */
export async function fetchVersionConfig(): Promise<VersionConfig | null> {
  if (__DEV__) return null;

  const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;
  const url = extra?.versionCheckUrl;
  if (!url) return null;

  try {
    const res = await fetch(url, { method: 'GET', cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as VersionConfig;
    if (typeof data?.minVersion !== 'string') return null;
    return { minVersion: data.minVersion, message: data.message };
  } catch {
    return null;
  }
}

/** Current app version from app config */
export function getCurrentAppVersion(): string {
  return Constants.expoConfig?.version ?? DEFAULT_VERSION;
}

/** Returns true if the user must update (current < minVersion from remote). */
export async function checkForceUpdate(): Promise<{
  updateRequired: boolean;
  message?: string;
}> {
  const config = await fetchVersionConfig();
  if (!config) return { updateRequired: false };

  const current = getCurrentAppVersion();
  const required = isUpdateRequired(current, config.minVersion);
  return {
    updateRequired: required,
    message: config.message,
  };
}
