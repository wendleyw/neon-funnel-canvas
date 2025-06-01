
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface SidebarHeaderProps {
  onCreateNewComponent: () => void;
}

export const SidebarHeader = React.memo<SidebarHeaderProps>(({ onCreateNewComponent }) => {
  return (
    <>
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white mb-1">FunnelCraft</h2>
        <p className="text-gray-400 text-xs">Arraste componentes para o canvas</p>
      </div>
      
      <div className="p-3">
        <Button
          onClick={onCreateNewComponent}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Novo Componente
        </Button>
      </div>
    </>
  );
});

SidebarHeader.displayName = 'SidebarHeader';
