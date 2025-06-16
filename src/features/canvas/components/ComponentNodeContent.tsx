
import React from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../types/funnel';

interface ComponentNodeContentProps {
  component: FunnelComponent;
  template: ComponentTemplate;
  isSelected: boolean;
}

export const ComponentNodeContent: React.FC<ComponentNodeContentProps> = ({
  component,
  template,
  isSelected
}) => {
  const renderIcon = () => {
    if (typeof template.icon === 'string') {
      return <span className="text-2xl">{template.icon}</span>;
    }
    return <span className="text-2xl">🔧</span>;
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-3 mb-3">
        {renderIcon()}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">
            {component.data.title}
          </h3>
          <p className="text-gray-400 text-xs capitalize">
            {template.type.replace('-', ' ')}
          </p>
        </div>
      </div>

      {component.data.description && (
        <p className="text-gray-300 text-xs leading-relaxed mb-3 line-clamp-2">
          {component.data.description}
        </p>
      )}

      {/* Status indicator */}
      <div className="flex items-center gap-2 mt-3">
        <div className={`
          w-2 h-2 rounded-full transition-colors
          ${component.data.status === 'active' ? 'bg-green-500' : 
            component.data.status === 'draft' ? 'bg-yellow-500' : 
            component.data.status === 'inactive' ? 'bg-red-500' : 'bg-gray-500'}
        `} />
        <span className="text-xs text-gray-400 capitalize">
          {component.data.status}
        </span>
      </div>

      {/* Properties summary */}
      {component.data.properties && Object.keys(component.data.properties).length > 0 && (
        <div className="text-xs text-gray-400 mt-2">
          {Object.keys(component.data.properties).length} properties configured
        </div>
      )}
    </div>
  );
};
