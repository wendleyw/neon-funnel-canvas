import React, { useMemo } from 'react';
import { Copy, Link, Edit, Trash2 } from 'lucide-react';
import { FunnelComponent } from '../../types/funnel';

interface ComponentNodeActionsProps {
  component: FunnelComponent;
  isSelected: boolean;
  isConnecting: boolean;
  onDuplicateClick: (e: React.MouseEvent) => void;
  onConnectionClick: (e: React.MouseEvent) => void;
  onEditClick?: (e: React.MouseEvent) => void;
  onDeleteClick?: (e: React.MouseEvent) => void;
}

export const ComponentNodeActions: React.FC<ComponentNodeActionsProps> = ({
  component,
  isSelected,
  isConnecting,
  onDuplicateClick,
  onConnectionClick,
  onEditClick,
  onDeleteClick
}) => {
  if (!isSelected || isConnecting) {
    return null;
  }

  const actionStyle = useMemo(() => ({
    left: component.position.x + 5000 + 220, // Position to the right of the component
    top: component.position.y + 5000,
    zIndex: 10000 // Always above components
  }), [component.position.x, component.position.y]);

  return (
    <div 
      className="absolute flex items-center justify-center gap-2 pointer-events-auto"
      style={actionStyle}
    >
      {/* Botão de Editar */}
      {onEditClick && (
        <button
          onClick={onEditClick}
          className="group relative w-9 h-9 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/40 hover:scale-110 backdrop-blur-sm border border-blue-400/30"
          title="Editar componente"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-50 blur-md group-hover:opacity-70 transition-opacity duration-300" />
          <Edit className="w-4 h-4 relative z-10" />
        </button>
      )}

      {/* Botão de Duplicar */}
      <button
        onClick={onDuplicateClick}
        className="group relative w-9 h-9 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-green-500/40 hover:scale-110 backdrop-blur-sm border border-green-400/30"
        title="Duplicar componente"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 opacity-50 blur-md group-hover:opacity-70 transition-opacity duration-300" />
        <Copy className="w-4 h-4 relative z-10" />
      </button>
      
      {/* Botão de Conectar */}
      <button
        onClick={onConnectionClick}
        className="group relative w-9 h-9 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-purple-500/40 hover:scale-110 backdrop-blur-sm border border-purple-400/30"
        title="Conectar com outro componente"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 blur-md group-hover:opacity-70 transition-opacity duration-300" />
        <Link className="w-4 h-4 relative z-10" />
      </button>

      {/* Botão de Excluir */}
      {onDeleteClick && (
        <button
          onClick={onDeleteClick}
          className="group relative w-9 h-9 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-red-500/40 hover:scale-110 backdrop-blur-sm border border-red-400/30"
          title="Excluir componente"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-rose-600 opacity-50 blur-md group-hover:opacity-70 transition-opacity duration-300" />
          <Trash2 className="w-4 h-4 relative z-10" />
        </button>
      )}
    </div>
  );
};
