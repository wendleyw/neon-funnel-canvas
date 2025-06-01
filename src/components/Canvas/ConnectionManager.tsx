
import React from 'react';
import { FunnelComponent, Connection } from '../../types/funnel';
import { ConnectionLine } from '../ConnectionLine';

interface ConnectionManagerProps {
  components: FunnelComponent[];
  connections: Connection[];
  connectingFrom: string | null;
  selectedConnection: string | null;
  onConnectionSelect: (connectionId: string) => void;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  components,
  connections,
  selectedConnection,
  onConnectionSelect
}) => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {connections.map((connection) => {
        const fromComponent = components.find(c => c.id === connection.from);
        const toComponent = components.find(c => c.id === connection.to);
        
        if (!fromComponent || !toComponent) return null;
        
        return (
          <ConnectionLine
            key={connection.id}
            connection={connection}
            fromPosition={fromComponent.position}
            toPosition={toComponent.position}
            isSelected={selectedConnection === connection.id}
            onSelect={() => onConnectionSelect(connection.id)}
          />
        );
      })}
    </svg>
  );
};
