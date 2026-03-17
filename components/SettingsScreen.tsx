import React, { useState } from 'react';
import { ChevronLeftIcon, UserAvatarIcon, EditIcon } from './icons';
import { UserProfile, AvatarId } from '../types';

interface SettingsScreenProps {
    userProfile: UserProfile;
    onProfileUpdate: (profile: UserProfile) => void;
    onBack: () => void;
    onClearReports: () => void;
}

const AVATAR_OPTIONS: AvatarId[] = ['default', 'avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6', 'avatar7'];

const SettingsScreen: React.FC<SettingsScreenProps> = ({ userProfile, onProfileUpdate, onBack, onClearReports }) => {
    
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
        <div className="p-6 animate-fade-in flex flex-col h-full text-white">
            <div className="flex items-center mb-6 flex-shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                    <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <h2 className="text-3xl font-bold flex-grow text-center mr-10 relative">Settings</h2>
            </div>

            <div className="space-y-8 overflow-y-auto pb-10">
                {/* Profile Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Profile</h3>
                    <div className="bg-[#14263A] rounded-2xl p-4 border border-brand-teal/20 space-y-4">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border border-gray-600 rounded-xl bg-brand-navy text-white focus:ring-2 focus:ring-brand-emerald focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your name"
                                />
                                <EditIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Avatar Selection */}
                        <div>
                           <label className="block text-sm font-medium text-gray-400 mb-3">Avatar</label>
                           <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 p-1">
                                {AVATAR_OPTIONS.map(avatarId => (
                                    <button 
                                        key={avatarId}
                                        onClick={() => setSelectedAvatar(avatarId)}
                                        className={`p-1 rounded-full transition-all duration-300 ${selectedAvatar === avatarId ? 'ring-2 ring-offset-2 ring-offset-[#14263A] ring-brand-emerald shadow-lg shadow-brand-emerald/40 glow-emerald' : 'hover:opacity-80'}`}
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
                        className="w-full mt-6 font-bold bg-brand-emerald text-brand-navy py-4 px-6 rounded-2xl text-lg hover:bg-brand-teal hover:text-white transition-colors duration-300 shadow-lg shadow-brand-emerald/20 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                        disabled={(name.trim() === userProfile.name && selectedAvatar === userProfile.avatar) || name.trim() === ''}
                    >
                        {savedMessage ? 'Profile Saved!' : 'Save Profile'}
                    </button>
                </div>

                {/* Data Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-3">Data Management</h3>
                    <button
                        onClick={handleClear}
                        className="w-full font-bold bg-brand-danger text-white py-4 px-6 rounded-2xl text-lg hover:bg-red-700 transition-colors duration-300 shadow shadow-brand-danger/30"
                    >
                        Clear All Past Reports
                    </button>
                    <p className="text-xs text-gray-400 mt-2 text-center px-4">This will permanently delete all your saved diagnosis sessions.</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;