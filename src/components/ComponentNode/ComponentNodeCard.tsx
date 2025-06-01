
import React from 'react';
import { FunnelComponent } from '../../types/funnel';
import { ComponentNodeHeader } from './ComponentNodeHeader';
import { ComponentNodeContent } from './ComponentNodeContent';
import { ComponentNodeFooter } from './ComponentNodeFooter';
import { ComponentNodeConnectionPoints } from './ComponentNodeConnectionPoints';
import { InstagramPostMockupButton } from '../Instagram/InstagramPostMockupButton';

interface ComponentNodeCardProps {
  component: FunnelComponent;
  isSelected: boolean;
  connectingFrom: string | null;
  onSelect: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<FunnelComponent>) => void;
  onStartConnection: () => void;
  onConnect: () => void;
  onInstagramMockupOpen?: () => void;
}

export const ComponentNodeCard: React.FC<ComponentNodeCardProps> = ({
  component,
  isSelected,
  connectingFrom,
  onSelect,
  onDelete,
  onUpdate,
  onStartConnection,
  onConnect,
  onInstagramMockupOpen
}) => {
  const isInstagramPost = component.type === 'instagram-post';

  return (
    <div
      className={`
        relative bg-gradient-to-br from-gray-800 via-gray-900 to-black
        border-2 transition-all duration-300 cursor-pointer
        hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20
        group min-w-[280px] max-w-[320px]
        ${isSelected 
          ? 'border-purple-500 shadow-lg shadow-purple-500/30 scale-105' 
          : 'border-gray-600 hover:border-purple-400'
        }
        ${connectingFrom && connectingFrom !== component.id 
          ? 'hover:border-green-400 hover:shadow-green-400/30' 
          : ''
        }
        rounded-xl overflow-hidden
      `}
      onClick={onSelect}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      {/* Connection Points */}
      <ComponentNodeConnectionPoints
        componentId={component.id}
        connectingFrom={connectingFrom}
        onStartConnection={onStartConnection}
        onConnect={onConnect}
      />

      {/* Header */}
      <ComponentNodeHeader
        component={component}
        isSelected={isSelected}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />

      {/* Content */}
      <ComponentNodeContent component={component} />

      {/* Instagram Mockup Button */}
      {isInstagramPost && onInstagramMockupOpen && (
        <div className="px-4 pb-3">
          <InstagramPostMockupButton onClick={onInstagramMockupOpen} />
        </div>
      )}

      {/* Footer */}
      <ComponentNodeFooter component={component} />
    </div>
  );
};
