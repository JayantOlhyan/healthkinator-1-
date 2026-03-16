import fs from 'fs';
import path from 'path';
import { config } from '../config';

interface Report {
  id: string;
  date: string;
  diagnosis: {
    condition: string;
    report: string;
    confidence: number;
    suggestions?: string[];
  };
  history: { role: string; parts: { text: string }[] }[];
}

interface UserProfile {
  name: string;
  avatar: string;
}

const REPORTS_FILE = path.join(config.dataDir, 'reports.json');
const PROFILE_FILE = path.join(config.dataDir, 'profile.json');

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(config.dataDir)) {
    fs.mkdirSync(config.dataDir, { recursive: true });
  }
};

// --- Reports ---

export const getReports = (): Report[] => {
  ensureDataDir();
  try {
    if (fs.existsSync(REPORTS_FILE)) {
      const data = fs.readFileSync(REPORTS_FILE, 'utf-8');
      const reports = JSON.parse(data) as Report[];
      return reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch (error) {
    console.error('Failed to read reports file:', error);
  }
  return [];
};

export const saveReport = (report: Report): void => {
  ensureDataDir();
  const existing = getReports();
  const updated = [report, ...existing.filter(r => r.id !== report.id)];
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
};

export const clearReports = (): void => {
  ensureDataDir();
  fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2), 'utf-8');
};

// --- User Profile ---

const DEFAULT_PROFILE: UserProfile = { name: 'Guest', avatar: 'default' };

export const getUserProfile = (): UserProfile => {
  ensureDataDir();
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const data = fs.readFileSync(PROFILE_FILE, 'utf-8');
      return JSON.parse(data) as UserProfile;
    }
  } catch (error) {
    console.error('Failed to read profile file:', error);
  }
  return { ...DEFAULT_PROFILE };
};

export const saveUserProfile = (profile: UserProfile): void => {
  ensureDataDir();
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf-8');
};
