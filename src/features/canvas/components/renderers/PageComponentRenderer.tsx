import React from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../../types/funnel';
import { Edit2, Trash2, Link, Copy } from 'lucide-react';
import { 
  getComponentStatusInfo, 
  getSelectionClasses, 
  getConnectionHandleClasses 
} from './shared/ComponentRendererUtils';

interface PageComponentRendererProps {
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
 * PageComponentRenderer - Extended card design for page components
 * 
 * This component renders page components with a longer card design 
 * as requested, maintaining the existing design but extending the width
 * for better page component representation.
 */
export const PageComponentRenderer: React.FC<PageComponentRendererProps> = ({
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

  // Check for custom mockup
  const hasCustomImage = component.data.image || component.data.properties?.customMockup;

  const baseClasses = `
    relative w-80 bg-gray-900 rounded-lg shadow-lg border-2 overflow-hidden 
    transition-all duration-200 ease-out hover:shadow-xl hover:scale-105
  `;

  const containerClasses = getSelectionClasses(isSelected, canConnect, isConnecting, baseClasses);
  const handleClasses = getConnectionHandleClasses();

  return (
    <div className="group relative">
      {/* TEMPORARY: Very obvious green rectangular design for testing */}
      <div
        className="w-80 h-32 bg-green-500 border-4 border-green-700 flex items-center justify-center text-white font-bold"
        style={{ 
          fontSize: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
        }}
      >
        <div className="text-center">
          <div className="text-2xl mb-1">{template.icon}</div>
          <div>PAGE</div>
          <div className="text-xs">{component.data.title}</div>
        </div>
      </div>
    </div>
  );
}; 