
import React from 'react';
import { Link, Copy } from 'lucide-react';

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
      
      <button
        onClick={onConnectionClick}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-xs"
        title="Conectar com outro componente"
      >
        <Link className="w-3 h-3" />
        <span>Conectar</span>
      </button>
    </div>
  );
};
