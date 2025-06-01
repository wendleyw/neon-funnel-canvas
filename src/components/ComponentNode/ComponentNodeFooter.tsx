
import React from 'react';
import { FunnelComponent } from '../../types/funnel';

interface ComponentNodeFooterProps {
  component: FunnelComponent;
}

export const ComponentNodeFooter: React.FC<ComponentNodeFooterProps> = ({
  component
}) => {
  return (
    <div className="p-3 border-t border-gray-700">
      <div className="text-xs text-gray-400">
        Status: <span className="text-green-400">{component.data.status}</span>
      </div>
    </div>
  );
};
