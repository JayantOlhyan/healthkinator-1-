import React from 'react';
import { AvatarId } from '../types';

const DefaultAvatar: React.FC = () => (
    <>
        <circle cx="28" cy="28" r="28" fill="#ECFDF5"/>
        <path d="M42.6667 43.6667C42.6667 38.04 38.1266 33.5 32.5 33.5H23.5C17.8734 33.5 13.3333 38.04 13.3333 43.6667" fill="#A7F3D0"/>
        <circle cx="28" cy="24" r="7.5" fill="#A7F3D0"/>
        <path d="M26.2058 13.6471C25.9999 12.8529 25.8823 12.0294 25.8823 11.1765C25.8823 6.55882 29.6175 2.82353 34.2352 2.82353C36.8528 2.82353 39.0293 4.29441 39.9999 6.38265C41.7352 7.23559 42.9411 8.88265 43.147 10.7941C43.3528 12.7059 42.4411 14.5882 40.8528 15.6765C39.2646 16.7647 37.2352 16.8529 35.4999 15.9118C34.5881 16.9412 33.0881 17.5 31.5 17.5H29.1176C27.9117 17.5 26.8528 16.8824 26.2058 15.8824L25.8823 15.2647L26.2058 13.6471Z" fill="url(#turbanGradient)"/>
        <circle cx="25" cy="23" r="1" fill="#065F46"/>
        <circle cx="31" cy="23" r="1" fill="#065F46"/>
        <path d="M26 28 C 27 29, 29 29, 30 28" stroke="#065F46" strokeWidth="1" strokeLinecap="round" fill="none"/>
    </>
);

const Avatar1: React.FC = () => ( // Robot
    <>
        <circle cx="28" cy="28" r="28" fill="#E0F2FE"/>
        <rect x="18" y="20" width="20" height="15" rx="2" fill="#60A5FA"/>
        <rect x="22" y="25" width="12" height="6" rx="1" fill="#1E40AF"/>
        <circle cx="24" cy="28" r="1.5" fill="#FBBF24"/>
        <circle cx="32" cy="28" r="1.5" fill="#FBBF24"/>
        <rect x="27" y="16" width="2" height="4" fill="#9CA3AF"/>
    </>
);

const Avatar2: React.FC = () => ( // Cat
    <>
        <circle cx="28" cy="28" r="28" fill="#FEF3C7"/>
        <path d="M18 40 C 20 32, 36 32, 38 40" fill="#FDBA74"/>
        <path d="M22,24 a1,1 0 0,1 12,0" fill="#FDBA74"/>
        <path d="M20 20 L 16 14" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round"/>
        <path d="M36 20 L 40 14" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="25" cy="28" r="1.5" fill="#000"/>
        <circle cx="31" cy="28" r="1.5" fill="#000"/>
        <path d="M28 32 C 27 33, 29 33, 28 32" stroke="#000" strokeWidth="1.5" fill="none"/>
    </>
);

const Avatar3: React.FC = () => ( // Abstract
    <>
        <circle cx="28" cy="28" r="28" fill="#E5E7EB"/>
        <circle cx="28" cy="28" r="12" fill="#3B82F6"/>
        <circle cx="28" cy="28" r="6" fill="#F9FAFB"/>
    </>
);

const Avatar4: React.FC = () => ( // Dog
    <>
        <circle cx="28" cy="28" r="28" fill="#F3EADF"/>
        <path d="M28 22 C 22 22, 18 26, 18 34 C 18 42, 38 42, 38 34 C 38 26, 34 22, 28 22" fill="#C4A484"/>
        <circle cx="28" cy="30" r="3" fill="#5C4033"/>
        <circle cx="23" cy="27" r="2" fill="#5C4033"/>
        <circle cx="33" cy="27" r="2" fill="#5C4033"/>
        <path d="M16 30 C 12 32, 12 40, 16 40" stroke="#A47C62" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M40 30 C 44 32, 44 40, 40 40" stroke="#A47C62" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </>
);

const Avatar5: React.FC = () => ( // Sprout
    <>
        <circle cx="28" cy="28" r="28" fill="#D1FAE5"/>
        <path d="M28 38 C 22 38, 22 32, 28 32 C 34 32, 34 38, 28 38 Z" fill="#34D399"/>
        <path d="M28 32 C 28 26, 34 24, 32 18" stroke="#10B981" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M28 32 C 28 26, 22 24, 24 18" stroke="#10B981" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </>
);

const Avatar6: React.FC = () => ( // Alien
    <>
        <circle cx="28" cy="28" r="28" fill="#E0E7FF"/>
        <path d="M28 16 C 18 16, 16 32, 28 38 C 40 32, 38 16, 28 16 Z" fill="#A5B4FC"/>
        <ellipse cx="23" cy="26" rx="4" ry="6" fill="#111827"/>
        <ellipse cx="33" cy="26" rx="4" ry="6" fill="#111827"/>
    </>
);

const Avatar7: React.FC = () => ( // Heart
    <>
        <circle cx="28" cy="28" r="28" fill="#FEE2E2"/>
        <path d="M28 22 C 23 17, 17 22, 17 28 C 17 34, 28 42, 28 42 C 28 42, 39 34, 39 28 C 39 22, 33 17, 28 22 Z" fill="#EF4444"/>
    </>
);


interface UserAvatarIconProps extends React.SVGProps<SVGSVGElement> {
    avatar: AvatarId;
}

export const UserAvatarIcon: React.FC<UserAvatarIconProps> = ({ avatar, ...props }) => (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="turbanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#34D399', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#10B981', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        {avatar === 'default' && <DefaultAvatar />}
        {avatar === 'avatar1' && <Avatar1 />}
        {avatar === 'avatar2' && <Avatar2 />}
        {avatar === 'avatar3' && <Avatar3 />}
        {avatar === 'avatar4' && <Avatar4 />}
        {avatar === 'avatar5' && <Avatar5 />}
        {avatar === 'avatar6' && <Avatar6 />}
        {avatar === 'avatar7' && <Avatar7 />}
    </svg>
);


export const LoadingSpinner: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  // Fix: Corrected the malformed viewBox attribute from '0 0 24" 24"' to '0 0 24 24'.
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`} {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);


export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);

export const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m15 18-6-6 6-6" />
    </svg>
);

export const FileTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
);

export const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
        <path d="M9 18h6"/>
        <path d="M10 22h4"/>
    </svg>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
        <path d="m15 5 4 4"/>
    </svg>
);

export const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
);

export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);