import React from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../../types/funnel';
import { Edit2, Trash2, Link, Copy, TrendingUp, Users, BarChart3 } from 'lucide-react';
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
 * Features:
 * - Circular design representing traffic flow
 * - Visual metrics display
 * - Clean, modern appearance
 * - Optimized for source components
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

  // Split title for better display in circular layout
  const titleLines = splitTextIntoLines(component.data.title, 10);

  // Get metrics or default values
  const metrics = component.data.properties || {};
  const visitors = metrics.visitors || '1.2K';
  const ctr = metrics.ctr || '2.4%';
  const cost = metrics.cost || '$45';

  const baseClasses = `
    relative w-40 h-40 bg-white rounded-full shadow-lg border-4 overflow-hidden 
    transition-all duration-300 ease-out hover:shadow-xl hover:scale-105
    group cursor-pointer flex flex-col items-center justify-center
  `;

  const containerClasses = getSelectionClasses(isSelected, canConnect, isConnecting, baseClasses);

  return (
    <div className="group relative">
      {/* Main Circular Container */}
      <div className={containerClasses}>
        
        {/* Status Ring */}
        <div 
          className="absolute inset-2 rounded-full border-2 opacity-30"
          style={{ borderColor: statusInfo.color }}
        />

        {/* Icon and Title */}
        <div className="text-center z-10">
          <div 
            className="text-2xl mb-1 filter drop-shadow-sm"
            role="img" 
            aria-label={template.label}
          >
            {template.icon}
          </div>
          
          <div className="text-gray-900 font-bold text-xs leading-tight">
            {titleLines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          
          <div className="text-gray-500 text-xs mt-1 font-medium">
            {template.label}
          </div>
        </div>

        {/* Status Indicator */}
        <div 
          className="absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: statusInfo.color }}
          title={statusInfo.text}
        />

        {/* Metrics Display */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs shadow-lg border">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{visitors}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{ctr}</span>
              </div>
              {cost !== '$45' && (
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  <span>{cost}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Connection Handles */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Input Handle (Top) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-lg" />
          
          {/* Output Handle (Bottom) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-lg" />
        </div>

        {/* Selection Ring */}
        {isSelected && (
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full pointer-events-none" />
        )}

        {/* Connection State Indicator */}
        {canConnect && (
          <div className="absolute inset-0 border-4 border-green-400 rounded-full pointer-events-none animate-pulse" />
        )}

        {/* Border Gradient */}
        <div 
          className="absolute inset-0 rounded-full opacity-20"
          style={{ 
            background: `conic-gradient(from 0deg, ${template.color || '#3B82F6'}, transparent, ${template.color || '#3B82F6'})` 
          }}
        />
      </div>

      {/* Floating Action Menu */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-1 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditClick?.(e);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit source"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateClick?.(e);
            }}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Duplicate source"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnectionClick?.(e);
            }}
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
            title="Connect"
          >
            <Link className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick?.(e);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete source"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}; 