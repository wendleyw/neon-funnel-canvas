import React from 'react';
import { UserAction } from '../../../data/userActions';
import { ComponentTemplate } from '../../../types/funnel';
import { useIsMobile } from '../../../hooks/use-mobile';

interface UserActionItemProps {
  action: UserAction;
  onDragStart: (template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
}

export const UserActionItem: React.FC<UserActionItemProps> = ({
  action,
  onDragStart,
  onTemplateClick
}) => {
  const isMobile = useIsMobile();

  const handleDragStart = (e: React.DragEvent) => {
    console.log('🎯 UserActionItem drag start:', action.type, action.label);
    try {
      e.dataTransfer.setData('application/json', JSON.stringify(action));
      e.dataTransfer.effectAllowed = 'copy';
      onDragStart(action);
      console.log('✅ UserActionItem drag start successful');
    } catch (error) {
      console.error('❌ Error in UserActionItem drag start:', error);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    console.log('🎯 UserActionItem clicked:', action.type, action.label);
    try {
      e.preventDefault();
      e.stopPropagation();
      if (onTemplateClick) {
        onTemplateClick(action);
        console.log('✅ UserActionItem click successful');
      }
    } catch (error) {
      console.error('❌ Error in UserActionItem click:', error);
    }
  };

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'conversion':
        return '#10B981'; // Green
      case 'engagement':
        return '#3B82F6'; // Blue
      case 'integration':
        return '#8B5CF6'; // Purple
      case 'custom':
        return '#F59E0B'; // Orange
      default:
        return '#6B7280'; // Gray
    }
  };

  const getActionTypeLabel = (actionType: string) => {
    switch (actionType) {
      case 'conversion':
        return 'CONVERSÃO';
      case 'engagement':
        return 'ENGAJAMENTO';
      case 'integration':
        return 'INTEGRAÇÃO';
      case 'custom':
        return 'PERSONALIZADA';
      default:
        return 'AÇÃO';
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-gray-900/60 to-gray-800/80 border border-gray-700/60 rounded-lg hover:border-gray-600 hover:from-gray-800/80 hover:to-gray-700/90 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden"
      draggable={!isMobile}
      onDragStart={!isMobile ? handleDragStart : undefined}
      onClick={handleClick}
    >
      {/* Header com badge de categoria */}
      <div className="flex items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-3">
          {/* Action Icon with User Indicator */}
          <div className="relative flex-shrink-0">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold shadow-sm transition-all duration-200 group-hover:scale-105"
              style={{ 
                backgroundColor: `${action.color}20`, 
                color: action.color,
                border: `2px solid ${action.color}40`
              }}
            >
              {action.iconEmoji}
            </div>
            
            {/* User Action Indicator */}
            <div 
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold border-2 border-gray-900 group-hover:border-gray-800 transition-colors"
              style={{ 
                backgroundColor: action.color,
                color: 'white'
              }}
            >
              👤
            </div>
          </div>
          
          {/* Title */}
          <h4 className="font-semibold text-white text-base group-hover:text-blue-300 transition-colors">
            {action.userFriendlyName}
          </h4>
        </div>

        {/* Category Badge */}
        <div 
          className="px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide opacity-70 group-hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
          style={{ 
            backgroundColor: `${getActionTypeColor(action.actionType)}25`,
            color: getActionTypeColor(action.actionType),
            border: `1px solid ${getActionTypeColor(action.actionType)}50`
          }}
        >
          {getActionTypeLabel(action.actionType)}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed mb-2">
          {action.description}
        </p>
        
        {/* Label */}
        <div className="flex items-center gap-2">
          <span 
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: `${action.color}15`,
              color: action.color,
              border: `1px solid ${action.color}30`
            }}
          >
            {action.label}
          </span>
        </div>
      </div>

      {/* Add Indicator */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <span className="text-white text-xs font-bold">+</span>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{ 
          background: `linear-gradient(135deg, ${action.color}20, transparent 50%)`
        }}
      />
    </div>
  );
}; 