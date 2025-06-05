import React, { useMemo } from 'react';
import { Copy, Link, Edit, Trash2 } from 'lucide-react';
import { FunnelComponent } from '../../types/funnel';
import { Button } from '@/components/ui/button';
import { Edit2, Share2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
          title="Edit component"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-50 blur-md group-hover:opacity-70 transition-opacity duration-300" />
          <Edit className="w-4 h-4 relative z-10" />
        </button>
      )}

      {/* Botão de Duplicar */}
      {onDuplicateClick && (
        <button
          onClick={onDuplicateClick}
          className="group relative w-9 h-9 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-green-500/40 hover:scale-110 backdrop-blur-sm border border-green-400/30"
          title="Duplicate component"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 opacity-50 blur-md group-hover:opacity-70 transition-opacity duration-300" />
          <Copy className="w-4 h-4 relative z-10" />
        </button>
      )}
      
      {/* Botão de Conectar */}
      {onConnectionClick && (
        <button
          onClick={onConnectionClick}
          className="group relative w-9 h-9 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-purple-500/40 hover:scale-110 backdrop-blur-sm border border-purple-400/30"
          title="Connect component"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 opacity-50 blur-md group-hover:opacity-70 transition-opacity duration-300" />
          <Link className="w-4 h-4 relative z-10" />
        </button>
      )}

      {/* Botão de Excluir */}
      {onDeleteClick && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onDeleteClick}
                className="group relative w-9 h-9 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-red-500/40 hover:scale-110 backdrop-blur-sm border border-red-400/30"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-rose-600 opacity-50 blur-md group-hover:opacity-70 transition-opacity duration-300" />
                <Trash2 className="w-4 h-4 relative z-10" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Delete component</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Bottom Action Bar - always visible when selected */}
      {isSelected && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%+20px)] z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-1.5 flex items-center justify-center space-x-1">
            {/* Edit Button */}
            <Button 
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 h-7 w-7"
              onClick={onEditClick} 
              title="Edit component"
            >
              <Edit2 size={14} />
            </Button>

            {/* Duplicate Button */}
            <Button 
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-purple-400 hover:bg-purple-900/30 h-7 w-7"
              onClick={onDuplicateClick} 
              title="Duplicate component"
            >
              <Copy size={14} />
            </Button>
            
            {/* Connect Button */}
            <Button 
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-green-400 hover:bg-green-900/30 h-7 w-7"
              onClick={onConnectionClick} 
              title="Create connection"
            >
              <Share2 size={14} />
            </Button>

            {/* Delete Button */}
            <Button 
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-400 hover:bg-red-900/30 h-7 w-7"
              onClick={onDeleteClick} 
              title="Delete component"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
