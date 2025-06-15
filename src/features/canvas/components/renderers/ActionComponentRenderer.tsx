import React from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../../types/funnel';
import { Edit2, Trash2, Link, Copy, Zap, Clock, CheckCircle } from 'lucide-react';
import { 
  getComponentStatusInfo, 
  getSelectionClasses, 
  getConnectionHandleClasses,
  splitTextIntoLines 
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
 * ActionComponentRenderer - Square design for action components
 * 
 * Features:
 * - Square button-like design
 * - Action-oriented styling
 * - Status indicators
 * - Clean, modern appearance
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
  const StatusIcon = statusInfo.icon;

  // Split title for better display
  const titleLines = splitTextIntoLines(component.data.title, 15);

  // Get action-specific properties
  const properties = component.data.properties || {};
  const executions = properties.executions || '—';
  const successRate = properties.successRate || '100%';

  const baseClasses = `
    relative w-36 h-36 bg-white rounded-lg shadow-lg border-2 overflow-hidden 
    transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1
    group cursor-pointer flex flex-col items-center justify-center p-3
  `;

  const containerClasses = getSelectionClasses(isSelected, canConnect, isConnecting, baseClasses);

  return (
    <div className="group relative">
      {/* Main Square Container */}
      <div className={containerClasses}>
        
        {/* Header Strip */}
        <div 
          className="absolute top-0 left-0 right-0 h-2"
          style={{ 
            background: `linear-gradient(90deg, ${template.color || '#8B5CF6'}, ${template.color || '#8B5CF6'}CC)`
          }}
        />

        {/* Icon */}
        <div 
          className="text-3xl mb-2 filter drop-shadow-sm"
          role="img" 
          aria-label={template.label}
        >
          {template.icon}
        </div>

        {/* Title */}
        <div className="text-center mb-2">
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
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2"
          style={{ 
            backgroundColor: `${statusInfo.color}20`,
            color: statusInfo.color 
          }}
        >
          <StatusIcon className="w-3 h-3" />
          <span>{statusInfo.text}</span>
        </div>

        {/* Action Metrics */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gray-50 rounded-md px-2 py-1 text-xs border">
            <div className="flex items-center justify-between text-gray-600">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>{executions}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>{successRate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Handles */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Input Handle (Left) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-lg" />
          
          {/* Output Handle (Right) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-lg" />
        </div>

        {/* Selection Ring */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
        )}

        {/* Connection State Indicator */}
        {canConnect && (
          <div className="absolute inset-0 border-4 border-green-400 rounded-lg pointer-events-none animate-pulse" />
        )}

        {/* Action Pulse Effect */}
        {component.data.status === 'active' && (
          <div 
            className="absolute inset-0 rounded-lg opacity-20 animate-pulse"
            style={{ 
              background: `radial-gradient(circle, ${template.color || '#8B5CF6'}40, transparent)`
            }}
          />
        )}
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
            title="Edit action"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicateClick?.(e);
            }}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Duplicate action"
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
            title="Delete action"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}; 