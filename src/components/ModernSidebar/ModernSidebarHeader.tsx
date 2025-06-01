
import React, { useState } from 'react';
import { Layers, Search } from 'lucide-react';
import { Input } from '../ui/input';

interface ModernSidebarHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ModernSidebarHeader: React.FC<ModernSidebarHeaderProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="p-6 border-b border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">Kind Funnel</h1>
          <p className="text-xs text-slate-400">Arraste os componentes para o canvas</p>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Buscar componentes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
        />
      </div>
    </div>
  );
};
