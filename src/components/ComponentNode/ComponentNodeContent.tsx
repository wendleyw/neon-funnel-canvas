
import React from 'react';
import { Eye } from 'lucide-react';
import { FunnelComponent } from '../../types/funnel';
import { StatusBadge } from '../StatusBadge';

interface ComponentNodeContentProps {
  component: FunnelComponent;
}

export const ComponentNodeContent: React.FC<ComponentNodeContentProps> = ({
  component
}) => {
  return (
    <>
      {/* Image Preview */}
      {component.data.image && (
        <div className="px-3 pt-2">
          <img
            src={component.data.image}
            alt={component.data.title}
            className="w-full h-16 object-cover rounded border border-gray-700"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-white font-medium text-sm flex-1 min-w-0 truncate">
            {component.data.title}
          </h4>
          <StatusBadge status={component.data.status} />
        </div>
        
        {component.data.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">
            {component.data.description}
          </p>
        )}
        
        {component.data.url && (
          <div className="flex items-center space-x-1 text-xs text-blue-400">
            <Eye className="w-3 h-3" />
            <span className="truncate">{component.data.url}</span>
          </div>
        )}
      </div>
    </>
  );
};
