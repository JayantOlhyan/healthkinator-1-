
import React from 'react';
import { HealthIcon } from './icons';

export const Header: React.FC = () => (
  <header className="w-full p-4 border-b border-cyan-500/20 flex items-center justify-center space-x-3">
    <HealthIcon className="w-8 h-8 text-cyan-400" />
    <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 font-display tracking-wider">
      Healthkinator
    </h1>
  </header>
);
