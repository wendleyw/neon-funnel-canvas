
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ComponentNodeHeader } from './ComponentNodeHeader';
import { ComponentNodeContent } from './ComponentNodeContent';
import { ComponentNodeConnectionPoints } from './ComponentNodeConnectionPoints';
import { FunnelComponent, ComponentTemplate } from '../../types/funnel';

interface ComponentNodeCardProps {
  component: FunnelComponent;
  template: ComponentTemplate;
  isSelected: boolean;
  isConnecting: boolean;
  canConnect: boolean;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onConnectionClick: (e: React.MouseEvent) => void;
  onDuplicateClick: (e: React.MouseEvent) => void;
}

export const ComponentNodeCard: React.FC<ComponentNodeCardProps> = ({
  component,
  template,
  isSelected,
  isConnecting,
  canConnect,
  onEditClick,
  onDeleteClick,
  onConnectionClick,
  onDuplicateClick
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'test':
        return 'bg-yellow-500';
      case 'published':
        return 'bg-blue-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-64 bg-gray-900 rounded-xl border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600 relative group overflow-hidden">
      {/* Header com gradiente baseado na cor do template */}
      <div 
        className="h-2 w-full relative"
        style={{ 
          background: `linear-gradient(90deg, ${template.color}, ${template.color}80)` 
        }}
      >
        {/* Status indicator reposicionado no topo esquerdo sobre o gradiente */}
        <div className="absolute top-1 left-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(component.data.status)} border border-white shadow-sm`} />
        </div>
      </div>
      
      <ComponentNodeHeader
        template={template}
        isSelected={isSelected}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
      
      {/* Indicator para modo de conexão */}
      {canConnect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce z-10">
          <ArrowRight className="w-3 h-3" />
        </div>
      )}
      
      <ComponentNodeContent component={component} />
      
      <ComponentNodeConnectionPoints />
    </div>
  );
};
