import { Report, UserProfile } from '../types';

const REPORTS_KEY = 'healthkinator_reports';
const PROFILE_KEY = 'healthkinator_profile';

export const getReports = (): Report[] => {
  try {
    const reportsJson = localStorage.getItem(REPORTS_KEY);
    if (reportsJson) {
      const reports = JSON.parse(reportsJson) as Report[];
      // Sort by date, newest first
      return reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  } catch (error) {
    console.error("Failed to parse reports from localStorage", error);
  }
  return [];
};

export const saveReport = (report: Report): void => {
  const existingReports = getReports();
  // Filter out any potential duplicates by ID before adding
  const updatedReports = [report, ...existingReports.filter(r => r.id !== report.id)];
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));
  } catch (error) {
    console.error("Failed to save report to localStorage", error);
  }
};

export const clearReports = (): void => {
  try {
    localStorage.removeItem(REPORTS_KEY);
  } catch (error) {
    console.error("Failed to clear reports from localStorage", error);
  }
};

export const getUserProfile = (): UserProfile => {
  try {
    const profileJson = localStorage.getItem(PROFILE_KEY);
    if (profileJson) {
      return JSON.parse(profileJson) as UserProfile;
    }
  } catch (error) {
    console.error("Failed to parse profile from localStorage", error);
  }
  // Return default profile if none is found or parsing fails
  return { name: 'Guest', avatar: 'default' };
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save profile to localStorage", error);
  }
};