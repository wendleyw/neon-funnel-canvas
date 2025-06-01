
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
  return (
    <div className="w-48 bg-gray-900 rounded-lg border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600 relative group">
      <ComponentNodeHeader
        template={template}
        isSelected={isSelected}
        isConnecting={isConnecting}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        onConnectionClick={onConnectionClick}
        onDuplicateClick={onDuplicateClick}
      />
      
      {/* Indicator para modo de conexão */}
      {canConnect && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
          <ArrowRight className="w-3 h-3" />
        </div>
      )}
      
      <ComponentNodeContent component={component} />
      
      <ComponentNodeConnectionPoints />
    </div>
  );
};
