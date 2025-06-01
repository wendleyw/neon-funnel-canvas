
import React from 'react';
import { Button } from '../ui/button';
import { Plus, Star } from 'lucide-react';

interface SidebarHeaderProps {
  onCreateNewComponent: () => void;
  onOpenReadyTemplates: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  onCreateNewComponent,
  onOpenReadyTemplates 
}) => {
  return (
    <div className="p-3 border-b border-gray-800">
      <h2 className="text-white font-semibold mb-3">FunnelCraft</h2>
      <p className="text-gray-400 text-sm mb-4">Arraste componentes para o canvas</p>
      
      <div className="space-y-2">
        <Button
          onClick={onOpenReadyTemplates}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          size="sm"
        >
          <Star className="w-4 h-4 mr-2" />
          Templates Prontos
        </Button>
        
        <Button
          onClick={onCreateNewComponent}
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Componente
        </Button>
      </div>
    </div>
  );
};
