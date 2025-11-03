import React, { useState } from 'react';
import { ChevronLeftIcon, UserAvatarIcon, EditIcon } from './icons';
import { UserProfile, AvatarId } from '../types';

interface SettingsScreenProps {
    userProfile: UserProfile;
    onProfileUpdate: (profile: UserProfile) => void;
    onBack: () => void;
    onClearReports: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const AVATAR_OPTIONS: AvatarId[] = ['default', 'avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6', 'avatar7'];

const SettingsScreen: React.FC<SettingsScreenProps> = ({ userProfile, onProfileUpdate, onBack, onClearReports, theme, setTheme }) => {
    
    const [name, setName] = useState(userProfile.name);
    const [selectedAvatar, setSelectedAvatar] = useState(userProfile.avatar);
    const [savedMessage, setSavedMessage] = useState(false);

    const handleClear = () => {
        if (window.confirm("Are you sure you want to delete all past reports? This action cannot be undone.")) {
            onClearReports();
        }
    };

    const handleSaveProfile = () => {
        onProfileUpdate({ name, avatar: selectedAvatar });
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 2000); // Hide message after 2 seconds
    };

    return (
        <div className="p-6 animate-fade-in flex flex-col h-full">
            <div className="flex items-center mb-6 flex-shrink-0">
                <button onClick={onBack} className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 mr-4">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
            </div>

            <div className="space-y-8 overflow-y-auto">
                {/* Profile Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Profile</h3>
                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Enter your name"
                                />
                                <EditIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Avatar Selection */}
                        <div>
                           <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avatar</label>
                           <div className="flex flex-wrap justify-center gap-x-4 gap-y-3">
                                {AVATAR_OPTIONS.map(avatarId => (
                                    <button 
                                        key={avatarId}
                                        onClick={() => setSelectedAvatar(avatarId)}
                                        className={`p-1 rounded-full transition-all duration-200 ${selectedAvatar === avatarId ? 'ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-700/50 ring-emerald-500' : 'hover:opacity-80'}`}
                                        aria-label={`Select avatar ${avatarId}`}
                                    >
                                        <UserAvatarIcon avatar={avatarId} className="w-14 h-14" />
                                    </button>
                                ))}
                           </div>
                        </div>
                    </div>
                     <button
                        onClick={handleSaveProfile}
                        className="w-full mt-4 font-bold bg-emerald-600 text-white py-3 px-6 rounded-lg text-base hover:bg-emerald-700 transition-colors duration-200 shadow shadow-emerald-500/30 disabled:bg-emerald-400 disabled:cursor-not-allowed"
                        disabled={(name.trim() === userProfile.name && selectedAvatar === userProfile.avatar) || name.trim() === ''}
                    >
                        {savedMessage ? 'Profile Saved!' : 'Save Profile'}
                    </button>
                </div>

                {/* Theme Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
                    <div className="flex space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <button 
                            onClick={() => setTheme('light')}
                            className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${theme === 'light' ? 'bg-white dark:bg-gray-500 text-emerald-600 dark:text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            Light
                        </button>
                        <button 
                            onClick={() => setTheme('dark')}
                            className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-white dark:bg-gray-500 text-emerald-600 dark:text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            Dark
                        </button>
                    </div>
                </div>

                {/* Data Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Data Management</h3>
                    <button
                        onClick={handleClear}
                        className="w-full font-bold bg-red-600 text-white py-3 px-6 rounded-lg text-base hover:bg-red-700 transition-colors duration-200 shadow shadow-red-500/30"
                    >
                        Clear All Past Reports
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">This will permanently delete all your saved diagnosis sessions.</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;