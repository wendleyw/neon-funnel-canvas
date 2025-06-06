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
      {/* Circular Source Component */}
      <div
        className={containerClasses}
        style={{ 
          backgroundColor: `${template.color}15`,
          borderColor: template.color
        }}
      >
        {/* Background gradient overlay */}
        <div 
          className="absolute inset-0 opacity-20 rounded-full"
          style={{ 
            background: `radial-gradient(circle at center, ${template.color}, transparent 70%)`
          }}
        />

        {/* Content in center */}
        <div className="relative z-10 text-center px-2">
          {/* Icon */}
          <div 
            className="text-2xl mb-2"
            style={{ color: template.color }}
          >
            {template.icon}
          </div>
          
          {/* Title - split into multiple lines if needed */}
          <h3 
            className="text-white font-bold text-xs leading-tight text-center"
            style={{ 
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              lineHeight: '1.2'
            }}
          >
            {titleLines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </h3>

          {/* Status indicator */}
          <div className="mt-2 flex items-center justify-center">
            <StatusIcon 
              className="w-3 h-3" 
              style={{ color: statusInfo.color }} 
            />
          </div>
        </div>

        {/* Actions (visible on hover/selection) */}
        <div className={`
          absolute -bottom-8 left-1/2 transform -translate-x-1/2 
          flex items-center gap-1 transition-all duration-200
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}>
          <button
            onClick={onEditClick}
            className="p-1.5 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-all duration-200 shadow-lg"
            title="Edit"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={onConnectionClick}
            className="p-1.5 bg-gray-800 text-gray-300 hover:text-blue-400 hover:bg-gray-700 rounded-full transition-all duration-200 shadow-lg"
            title="Connect"
          >
            <Link className="w-3 h-3" />
          </button>
          {onDuplicateClick && (
            <button
              onClick={onDuplicateClick}
              className="p-1.5 bg-gray-800 text-gray-300 hover:text-green-400 hover:bg-gray-700 rounded-full transition-all duration-200 shadow-lg"
              title="Duplicate"
            >
              <Copy className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onDeleteClick}
            className="p-1.5 bg-gray-800 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-full transition-all duration-200 shadow-lg"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        {/* Connection Points (handles) - positioned around the circle */}
        {(isSelected || isConnecting) && (
          <>
            <div className={`${handleClasses} -top-2 left-1/2 transform -translate-x-1/2`} />
            <div className={`${handleClasses} top-1/2 -right-2 transform -translate-y-1/2`} />
            <div className={`${handleClasses} -bottom-2 left-1/2 transform -translate-x-1/2`} />
            <div className={`${handleClasses} top-1/2 -left-2 transform -translate-y-1/2`} />
          </>
        )}
      </div>
    </div>
  );
}; 