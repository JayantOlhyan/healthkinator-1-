import { Report, UserProfile } from '../types';

const API_BASE = '/api';

// ──────────────────────────────────────────────
// Reports — persisted via backend API
// ──────────────────────────────────────────────

export const getReports = async (): Promise<Report[]> => {
  try {
    const res = await fetch(`${API_BASE}/reports`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return [];
  }
};

export const saveReport = async (report: Report): Promise<void> => {
  try {
    await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
  } catch (error) {
    console.error('Failed to save report:', error);
  }
};

export const clearReports = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE}/reports`, { method: 'DELETE' });
  } catch (error) {
    console.error('Failed to clear reports:', error);
  }
};

// ──────────────────────────────────────────────
// User Profile — persisted via backend API
// ──────────────────────────────────────────────

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return { name: 'Guest', avatar: 'default' };
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
};