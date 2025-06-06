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
      {/* Extended Page Component Card */}
      <div className={containerClasses}>
        {/* Header Colorido */}
        <div 
          className="h-1 w-full"
          style={{ backgroundColor: template.color }}
        />

        {/* Conteúdo Principal */}
        <div className="p-4">
          {/* Ícone e Título */}
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-semibold border-2"
              style={{ 
                backgroundColor: `${template.color}20`,
                borderColor: `${template.color}40`,
                color: template.color
              }}
            >
              {template.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-base leading-tight">
                {component.data.title || template.label}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <StatusIcon className="w-3 h-3" style={{ color: statusInfo.color }} />
                  <span className="text-xs" style={{ color: statusInfo.color }}>
                    {statusInfo.text}
                  </span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Page
                </span>
              </div>
            </div>
          </div>

          {/* Custom Mockup Preview */}
          {hasCustomImage && (
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">Preview:</div>
              <div className="w-full h-32 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                <img 
                  src={component.data.image || component.data.properties?.customMockup} 
                  alt="Page preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('🖼️ [PageComponentRenderer] Image failed to load:', component.data.image || component.data.properties?.customMockup);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('✅ [PageComponentRenderer] Custom image loaded successfully:', component.data.image || component.data.properties?.customMockup);
                  }}
                />
              </div>
            </div>
          )}

          {/* Page Type Badge */}
          <div className="mb-3">
            <div 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
              style={{ 
                backgroundColor: `${template.color}10`,
                borderColor: `${template.color}30`,
                color: template.color
              }}
            >
              📄 {template.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Page'}
            </div>
          </div>

          {/* Description */}
          {component.data.description && (
            <div className="mb-4">
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {component.data.description}
              </p>
            </div>
          )}

          {/* Page Metrics */}
          <div className="bg-gray-800 rounded-lg p-3 mb-3 border border-gray-700">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-sm font-semibold text-white">
                  {component.data.properties?.views || '1.2K'}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Views</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {component.data.properties?.conversion_rate || '24%'}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Conv Rate</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {component.data.properties?.leads || '285'}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Leads</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center justify-between transition-all duration-200 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <div className="flex items-center gap-1">
              <button
                onClick={onEditClick}
                className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-md transition-all duration-200"
                title="Edit Page"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={onConnectionClick}
                className="p-2 text-gray-500 hover:text-blue-400 hover:bg-gray-800 rounded-md transition-all duration-200"
                title="Connect"
              >
                <Link className="w-4 h-4" />
              </button>
              {onDuplicateClick && (
                <button
                  onClick={onDuplicateClick}
                  className="p-2 text-gray-500 hover:text-green-400 hover:bg-gray-800 rounded-md transition-all duration-200"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button
              onClick={onDeleteClick}
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-md transition-all duration-200"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Connection Points (handles) */}
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