
import React from 'react';
import { Layers } from 'lucide-react';

export const SidebarHeader = React.memo(() => {
  return (
    <div className="p-4 border-b border-gray-800 bg-gray-950">
      <div className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-blue-500" />
        <h2 className="text-white font-semibold text-lg">Componentes</h2>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Arraste os componentes para o canvas
      </p>
    </div>
  );
});

SidebarHeader.displayName = 'SidebarHeader';
