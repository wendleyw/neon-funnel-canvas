import React from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../../types/funnel';
import { Edit2, Trash2, Link, Copy, Eye, Globe, Image as ImageIcon } from 'lucide-react';
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
 * PageComponentRenderer - Enhanced card design for page components
 * 
 * Features:
 * - Displays admin template images when available
 * - Uses URL preview data when available
 * - Fallback to default mockup if no image
 * - Modern card design with proper spacing
 * - Better UX/UI with hover effects
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

  // Get preview data if available
  const previewData = component.data.properties?.previewData;

  // Debug logging
  React.useEffect(() => {
    if (previewData) {
      console.log(`[PageRenderer] ${component.id}: Live preview loaded from ${previewData.domain}`);
    }
  }, [component.id, previewData]);

  // Get image from multiple sources with priority
  const getComponentImage = () => {
    // Priority 1: Preview data image (from URL preview)
    if (previewData?.image) {
      return previewData.image;
    }
    
    // Priority 2: Preview data images array (first one)
    if (previewData?.images && previewData.images.length > 0) {
      return previewData.images[0];
    }
    
    // Priority 3: Custom mockup from admin template
    if (component.data.properties?.customMockup) {
      return component.data.properties.customMockup;
    }
    
    // Priority 4: Component data image
    if (component.data.image) {
      return component.data.image;
    }
    
    // Priority 5: Template properties mockup
    if (template.defaultProps?.properties?.customMockup) {
      return template.defaultProps.properties.customMockup;
    }
    
    return null;
  };

  // Get title from preview data or component data
  const getComponentTitle = () => {
    const title = previewData?.title || component.data.title || template.label;
    // Clean and format the title for better readability
    if (!title) return template.label;
    
    // Remove extra whitespace and limit length
    return title.trim().substring(0, 80);
  };

  // Get description from preview data or component data
  const getComponentDescription = () => {
    const description = previewData?.description || component.data.description;
    if (!description) return null;
    
    // Clean and limit description length
    return description.trim().substring(0, 200);
  };

  // Get URL from preview data or component data
  const getComponentUrl = () => {
    return previewData?.url || component.data.url;
  };

  const componentImage = getComponentImage();
  const hasCustomImage = !!componentImage;
  const componentTitle = getComponentTitle();
  const componentDescription = getComponentDescription();
  const componentUrl = getComponentUrl();

  const baseClasses = `
    relative w-96 bg-white rounded-xl shadow-lg border-2 overflow-hidden 
    transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1
    group cursor-pointer
  `;

  const containerClasses = getSelectionClasses(isSelected, canConnect, isConnecting, baseClasses);
  const handleClasses = getConnectionHandleClasses();

  return (
    <div className="group relative">
      {/* Main Card Container */}
      <div className={containerClasses}>
        
        {/* Header Strip */}
        <div 
          className="h-3 w-full"
          style={{ 
            background: `linear-gradient(135deg, ${template.color || '#3B82F6'}, ${template.color || '#3B82F6'}CC)`
          }}
        />

        {/* Content Area */}
        <div className="p-4">
          
          {/* Title and Status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 font-semibold text-sm truncate">
                {componentTitle}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="text-lg"
                  role="img" 
                  aria-label={template.label}
                >
                  {template.icon}
                </div>
                <span className="text-gray-500 text-xs font-medium">
                  {template.label}
                </span>
                {/* Show preview indicator if we have preview data */}
                {previewData && (
                  <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-medium">
                    Live
                  </span>
                )}
              </div>
            </div>
            
            {/* Status Indicator */}
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: `${statusInfo.color}20`, // 20% opacity background
                color: statusInfo.color 
              }}
            >
              <StatusIcon className="w-3 h-3" />
              <span>{statusInfo.text}</span>
            </div>
          </div>

          {/* Image Preview Area - Increased height for better visibility */}
          <div className="mb-3">
            {hasCustomImage ? (
              <div className="relative">
                <img
                  src={componentImage}
                  alt={`${componentTitle} mockup`}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* Fallback placeholder (hidden by default) */}
                <div className="hidden w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-500 text-xs">Preview</span>
                  </div>
                </div>
                
                {/* Preview Overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                  <Eye className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                
                {/* Preview source indicator */}
                {previewData && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
                    Live Preview
                  </div>
                )}
              </div>
            ) : (
              // Default placeholder when no image
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <span className="text-blue-600 text-xs font-medium">Landing Page</span>
                  <div className="text-blue-400 text-xs mt-1">No preview available</div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {componentDescription && (
            <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
              {componentDescription}
            </p>
          )}

          {/* URL if available */}
          {componentUrl && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <Globe className="w-3 h-3" />
              <span className="truncate">{componentUrl}</span>
            </div>
          )}

          {/* Preview metadata if available */}
          {previewData && (
            <div className="flex items-center gap-2 text-xs text-green-600 mb-3 bg-green-50 px-2 py-1 rounded">
              <Eye className="w-3 h-3" />
              <span>Live from {previewData.domain}</span>
              {previewData.timestamp && (
                <span className="text-green-500">
                  • {new Date(previewData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick?.(e);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Edit page"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateClick?.(e);
                }}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                title="Duplicate page"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConnectionClick?.(e);
                }}
                className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                title="Connect to other components"
              >
                <Link className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick?.(e);
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete page"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Connection Handles */}
        <div className={handleClasses}>
          {/* Input Handle (Left) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Output Handle (Right) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Selection Ring */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none" />
        )}

        {/* Connection State Indicator */}
        {canConnect && (
          <div className="absolute inset-0 border-4 border-green-400 rounded-xl pointer-events-none animate-pulse" />
        )}
      </div>
    </div>
  );
}; 