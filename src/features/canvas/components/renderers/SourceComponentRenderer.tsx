import React from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../../types/funnel';
import { Edit2, Trash2, Link, Copy } from 'lucide-react';
import { 
  getComponentStatusInfo, 
  getSelectionClasses, 
  getConnectionHandleClasses, 
  splitTextIntoLines 
} from './shared/ComponentRendererUtils';

interface SourceComponentRendererProps {
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
 * SourceComponentRenderer - Circular design for traffic sources
 * 
 * Following the requirement to render source components as circles with 
 * the title in the center, this component creates a distinct visual 
 * representation for traffic source components.
 */
export const SourceComponentRenderer: React.FC<SourceComponentRendererProps> = ({
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
  const StatusIcon = statusInfo.icon;
  
  const titleLines = splitTextIntoLines(component.data.title || template.label, 12);

  const baseClasses = `
    relative w-32 h-32 rounded-full shadow-lg border-4 overflow-hidden 
    transition-all duration-300 ease-out hover:shadow-xl hover:scale-110
    flex items-center justify-center
  `;

  const containerClasses = getSelectionClasses(isSelected, canConnect, isConnecting, baseClasses);
  const handleClasses = getConnectionHandleClasses();

  return (
    <div className="group relative">
      {/* TEMPORARY: Very obvious red circular design for testing */}
      <div
        className="w-32 h-32 rounded-full bg-red-500 border-4 border-red-700 flex items-center justify-center text-white font-bold"
        style={{ 
          fontSize: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
        }}
      >
        <div className="text-center">
          <div className="text-2xl mb-1">{template.icon}</div>
          <div>SOURCE</div>
          <div className="text-xs">{component.data.title}</div>
        </div>
      </div>
    </div>
  );
}; 