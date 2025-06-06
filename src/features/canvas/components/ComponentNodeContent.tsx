import React from 'react';
import { Eye, Link, Share2 } from 'lucide-react';
import { FunnelComponent } from '../../../types/funnel';
import { StatusBadge } from '../StatusBadge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/features/shared/ui/tooltip';

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
            onError={(e) => {
              console.log('Image failed to load:', component.data.image);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-3">
        {/* Title - removido o status badge daqui pois agora está no topo */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-white font-medium text-sm flex-1 min-w-0 truncate">
            {component.data.title}
          </h4>
        </div>
        
        {/* Description */}
        {component.data.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">
            {component.data.description}
          </p>
        )}
        
        {/* URL Link */}
        {component.data.url && (
          <div className="flex items-center space-x-1 text-xs text-blue-400 mb-2">
            <Link className="w-3 h-3" />
            <span className="truncate" title={component.data.url}>
              {component.data.url}
            </span>
          </div>
        )}

        {/* Connections Count */}
        {component.connections && component.connections.length > 0 && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-gray-400 bg-gray-700/50 px-1.5 py-0.5 rounded-sm cursor-default">
                  <Share2 size={10} className="mr-1 text-blue-400" />
                  <span>{component.connections.length} connection{component.connections.length !== 1 ? 's' : ''}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700">
                <p>This component has {component.connections.length} connection{component.connections.length !== 1 ? 's' : ''}.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </>
  );
};
