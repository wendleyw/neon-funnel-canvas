import React, { useState } from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../types/funnel';
import { 
  Edit2, 
  Trash2, 
  Link, 
  Copy, 
  MoreHorizontal, 
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Eye,
  Settings,
  Zap
} from 'lucide-react';

interface ComponentNodeCardProps {
  component: FunnelComponent;
  template: ComponentTemplate;
  isSelected: boolean;
  isConnecting: boolean;
  canConnect: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onConnectionClick: () => void;
  onDuplicateClick?: () => void;
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
  const [showActions, setShowActions] = useState(false);

  // Get status info with better design
  const getStatusInfo = () => {
    const status = component.data.status;
    switch (status) {
      case 'active':
        return { color: '#10B981', bgColor: '#10B98115', icon: Play, text: 'Live' };
      case 'paused':
        return { color: '#F59E0B', bgColor: '#F59E0B15', icon: Pause, text: 'Paused' };
      case 'draft':
        return { color: '#6B7280', bgColor: '#6B728015', icon: Settings, text: 'Draft' };
      default:
        return { color: '#8B5CF6', bgColor: '#8B5CF615', icon: Zap, text: 'Ready' };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  // Get metrics based on component type
  const getMetrics = () => {
    const props = component.data.properties;
    if (template.category === 'traffic-sources') {
      return {
        primary: props?.impressions || '12.5K',
        secondary: props?.clicks || '856',
        primaryLabel: 'Impressions',
        secondaryLabel: 'Clicks'
      };
    }
    if (template.category === 'lead-capture') {
      return {
        primary: props?.conversion_rate || '24%',
        secondary: props?.leads || '205',
        primaryLabel: 'Conv. Rate',
        secondaryLabel: 'Leads'
      };
    }
    if (template.category === 'sales-conversion') {
      return {
        primary: props?.revenue || '$12.4K',
        secondary: props?.orders || '42',
        primaryLabel: 'Revenue',
        secondaryLabel: 'Orders'
      };
    }
    return {
      primary: props?.value || '100%',
      secondary: props?.count || '—',
      primaryLabel: 'Performance',
      secondaryLabel: 'Volume'
    };
  };

  const metrics = getMetrics();

  return (
    <div className="group relative">
      {/* Main Card - Funnellytics Style */}
      <div
        className={`
          relative w-72 bg-white rounded-xl shadow-sm border-2 overflow-hidden component-card-modern
          transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5
          ${isSelected ? 'border-blue-500 shadow-blue-500/20 ring-4 ring-blue-500/10' : 'border-gray-200 hover:border-gray-300'}
          ${canConnect ? 'border-green-500 border-4 shadow-green-500/30 animate-pulse' : ''}
          ${isConnecting ? 'ring-2 ring-blue-500/50' : ''}
        `}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Header Strip with Gradient */}
        <div 
          className="h-2 w-full relative overflow-hidden"
          style={{ 
            background: `linear-gradient(90deg, ${template.color}, ${template.color}CC, ${template.color}99)`
          }}
        >
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              background: `linear-gradient(90deg, transparent, ${template.color}40, transparent)`,
              animation: 'shimmer 3s infinite'
            }}
          />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Enhanced Icon */}
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium shadow-sm border"
                  style={{ 
                    backgroundColor: `${template.color}10`,
                    borderColor: `${template.color}20`,
                    color: template.color
                  }}
                >
                  {template.icon}
                </div>
                {/* Status indicator on icon */}
                <div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
                  style={{ backgroundColor: statusInfo.color }}
                >
                  <StatusIcon className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              
              {/* Title and Category */}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">
                  {component.data.title || template.label}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="text-xs px-2 py-1 rounded-full font-medium border"
                    style={{ 
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.color,
                      borderColor: `${statusInfo.color}30`
                    }}
                  >
                    {statusInfo.text}
                  </span>
                  <span className="text-xs text-gray-500">
                    {template.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Actions */}
            <div className={`transition-all duration-200 ${showActions || isSelected ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-1">
                {/* Quick Stats Button */}
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105 action-button"
                  title="View Analytics"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>

                {/* Primary Actions */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border">
                  <button
                    onClick={onEditClick}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white rounded-md transition-all duration-200 hover:scale-105 action-button"
                    title="Edit Component"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onConnectionClick}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 hover:scale-105 action-button"
                    title="Connect"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  {onDuplicateClick && (
                    <button
                      onClick={onDuplicateClick}
                      className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-all duration-200 hover:scale-105 action-button"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={onDeleteClick}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 hover:scale-105 action-button"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {component.data.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {component.data.description}
            </p>
          )}

          {/* Metrics Dashboard */}
          <div className="bg-gray-50 rounded-lg p-3 border">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{metrics.primary}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">{metrics.primaryLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{metrics.secondary}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">{metrics.secondaryLabel}</div>
              </div>
            </div>
            
            {/* Performance Indicator */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Performance</span>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-medium">+12.5%</span>
                </div>
              </div>
              <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300 performance-bar"
                  style={{ 
                    width: '68%',
                    background: `linear-gradient(90deg, ${template.color}, ${template.color}CC)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick Info Tags */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">Live tracking</span>
            </div>
            <div className="text-xs text-gray-400">
              ID: {component.id.slice(-6)}
            </div>
          </div>
        </div>

        {/* Connection Indicator Overlay */}
        {canConnect && (
          <div className="absolute inset-0 rounded-xl bg-green-500/5 border-4 border-green-500 animate-pulse flex items-center justify-center">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Click to Connect
            </div>
          </div>
        )}

        {/* Selection Glow */}
        {isSelected && !canConnect && (
          <div 
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${template.color}05, transparent 70%)`,
              boxShadow: `inset 0 0 0 1px ${template.color}20`
            }}
          />
        )}
      </div>

      {/* Enhanced Connection Points */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-125 connection-point" 
           style={{ backgroundColor: template.color }} />
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-125 connection-point"
           style={{ backgroundColor: template.color }} />
      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-125 connection-point"
           style={{ backgroundColor: template.color }} />
      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-125 connection-point"
           style={{ backgroundColor: template.color }} />
    </div>
  );
};
