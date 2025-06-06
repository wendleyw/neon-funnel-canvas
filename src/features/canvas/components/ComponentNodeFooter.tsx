import React from 'react';
import { Link, Copy, Share2 } from 'lucide-react';
import { Button } from '@/features/shared/ui/button';

interface ComponentNodeFooterProps {
  isSelected: boolean;
  isConnecting: boolean;
  onConnectionClick: (e: React.MouseEvent) => void;
  onDuplicateClick: (e: React.MouseEvent) => void;
}

export const ComponentNodeFooter: React.FC<ComponentNodeFooterProps> = ({
  isSelected,
  isConnecting,
  onConnectionClick,
  onDuplicateClick
}) => {
  if (!isSelected || isConnecting) {
    return null;
  }

  return (
    <div className="p-3 border-t border-gray-700 flex items-center justify-center space-x-4">
      <button
        onClick={onDuplicateClick}
        className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-xs"
        title="Duplicar componente"
      >
        <Copy className="w-3 h-3" />
        <span>Duplicar</span>
      </button>
      
      <Button 
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 transition-all duration-150 h-6 w-6 p-1"
        onClick={onConnectionClick} 
        title="Connect with another component"
        aria-label="Connect component"
      >
        <Share2 size={14} />
      </Button>
    </div>
  );
};
