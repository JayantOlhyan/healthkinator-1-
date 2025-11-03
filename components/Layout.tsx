import React from 'react';
import { UserAvatarIcon, SunIcon, MoonIcon, SettingsIcon } from './icons';
import { UserProfile } from '../types';

interface HeaderProps {
    userProfile: UserProfile;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    onShowSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userProfile, theme, toggleTheme, onShowSettings }) => (
  <header className="w-full p-6 flex items-center justify-between">
    <div className="flex items-center space-x-4">
        <UserAvatarIcon avatar={userProfile.avatar} className="w-12 h-12 flex-shrink-0" />
        <div>
            <h1 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              Healthkinator
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hello, {userProfile.name}!</p>
        </div>
    </div>
    <div className="flex items-center space-x-2">
      <button
          onClick={onShowSettings}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Open settings"
      >
          <SettingsIcon className="w-6 h-6" />
      </button>
      <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
      >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
      </button>
    </div>
  </header>
);