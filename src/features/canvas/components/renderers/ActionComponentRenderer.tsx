import React from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../../types/funnel';
import { Edit2, Trash2, Link, Copy } from 'lucide-react';
import { 
  getComponentStatusInfo, 
  getSelectionClasses, 
  getConnectionHandleClasses 
} from './shared/ComponentRendererUtils';

interface ActionComponentRendererProps {
  component: FunnelComponent;
  template: ComponentTemplate;
  isSelected: boolean;
  isConnecting: boolean;
  canConnect: boolean;
  onEditClick: (e?: React.MouseEvent) => void;
  onDeleteClick: (e?: React.MouseEvent) => void;
  onConnectionClick: (e?: React.MouseEvent) => void;
  onDuplicateClick?: (e?: React.MouseEvent) => void;
}

/**
 * ActionComponentRenderer - Square button design for action components
 * 
 * This component renders action components as square buttons with 
 * the title in the center, providing a clear visual representation
 * of actionable elements in the funnel.
 */
export const ActionComponentRenderer: React.FC<ActionComponentRendererProps> = ({
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

  const statusInfo = getComponentStatusInfo(component.data.status);

  const baseClasses = `
    relative w-36 h-36 rounded-lg shadow-lg border-3 overflow-hidden 
    transition-all duration-300 ease-out hover:shadow-xl hover:scale-110
    flex flex-col items-center justify-center cursor-pointer
  `;

  const containerClasses = getSelectionClasses(isSelected, canConnect, isConnecting, baseClasses);
  const handleClasses = getConnectionHandleClasses();

  return (
    <div className="group relative">
      {/* TEMPORARY: Very obvious blue square design for testing */}
      <div
        className="w-36 h-36 bg-blue-500 border-4 border-blue-700 flex items-center justify-center text-white font-bold"
        style={{ 
          fontSize: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
        }}
      >
        <div className="text-center">
          <div className="text-2xl mb-1">{template.icon}</div>
          <div>ACTION</div>
          <div className="text-xs">{component.data.title}</div>
        </div>
      </div>
    </div>
  );
}; 