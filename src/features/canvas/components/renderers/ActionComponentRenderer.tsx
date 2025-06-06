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
      {/* Square Action Component */}
      <div
        className={containerClasses}
        style={{ 
          background: `linear-gradient(135deg, ${template.color}20, ${template.color}10)`,
          borderColor: template.color,
          borderWidth: '3px'
        }}
      >
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              ${template.color} 10px,
              ${template.color} 20px
            )`
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-3">
          {/* Icon */}
          <div 
            className="text-3xl mb-3 drop-shadow-lg"
            style={{ color: template.color }}
          >
            {template.icon}
          </div>
          
          {/* Title - centered and wrapped */}
          <h3 
            className="text-white font-bold text-sm leading-tight text-center mb-2"
            style={{ 
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              lineHeight: '1.3'
            }}
          >
            {component.data.title || template.label}
          </h3>

          {/* Action Type Badge */}
          <div 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
            style={{ 
              backgroundColor: `${template.color}20`,
              borderColor: `${template.color}40`,
              color: template.color
            }}
          >
            ⚡ Action
          </div>
        </div>

        {/* Status indicator in corner */}
        <div className="absolute top-2 right-2">
          <div 
            className="w-3 h-3 rounded-full border-2 border-gray-900"
            style={{ backgroundColor: statusInfo.color }}
            title={statusInfo.text}
          />
        </div>

        {/* Button effect overlay */}
        <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-200 bg-white rounded-lg" />

        {/* Actions (visible on hover/selection) */}
        <div className={`
          absolute -bottom-8 left-1/2 transform -translate-x-1/2 
          flex items-center gap-1 transition-all duration-200
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}>
          <button
            onClick={onEditClick}
            className="p-1.5 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-all duration-200 shadow-lg"
            title="Edit Action"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={onConnectionClick}
            className="p-1.5 bg-gray-800 text-gray-300 hover:text-blue-400 hover:bg-gray-700 rounded-md transition-all duration-200 shadow-lg"
            title="Connect"
          >
            <Link className="w-3 h-3" />
          </button>
          {onDuplicateClick && (
            <button
              onClick={onDuplicateClick}
              className="p-1.5 bg-gray-800 text-gray-300 hover:text-green-400 hover:bg-gray-700 rounded-md transition-all duration-200 shadow-lg"
              title="Duplicate"
            >
              <Copy className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onDeleteClick}
            className="p-1.5 bg-gray-800 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-md transition-all duration-200 shadow-lg"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        {/* Connection Points (handles) - positioned around the square */}
        {(isSelected || isConnecting) && (
          <>
            <div className={`${handleClasses} -top-2 left-1/2 transform -translate-x-1/2`} />
            <div className={`${handleClasses} top-1/2 -right-2 transform -translate-y-1/2`} />
            <div className={`${handleClasses} -bottom-2 left-1/2 transform -translate-x-1/2`} />
            <div className={`${handleClasses} top-1/2 -left-2 transform -translate-y-1/2`} />
          </>
        )}
      </div>

      {/* Action Description (below the component) */}
      {component.data.description && (
        <div className="mt-2 max-w-36">
          <p className="text-gray-400 text-xs text-center leading-relaxed line-clamp-2">
            {component.data.description}
          </p>
        </div>
      )}
    </div>
  );
}; 