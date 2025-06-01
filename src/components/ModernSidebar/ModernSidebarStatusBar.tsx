
import React from 'react';
import { Circle } from 'lucide-react';

interface ModernSidebarStatusBarProps {
  componentCount: number;
  connectionCount: number;
}

export const ModernSidebarStatusBar: React.FC<ModernSidebarStatusBarProps> = ({
  componentCount,
  connectionCount
}) => {
  return (
    <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Circle className="w-2 h-2 text-green-400 fill-green-400" />
          <span>Pronto</span>
        </div>
        <span>•</span>
        <span>{componentCount} comp.</span>
        <span>•</span>
        <span>{connectionCount} conexões</span>
      </div>
    </div>
  );
};
