import React from 'react';
import { FunnelComponent, Connection } from '../../../types/funnel';
import { ConnectionLine } from '../ConnectionLine';

interface ConnectionManagerProps {
  components: FunnelComponent[];
  connections: Connection[];
  connectingFrom: string | null;
  selectedConnection: string | null;
  onConnectionSelect: (connectionId: string) => void;
  onConnectionUpdate?: (connectionId: string, updates: Partial<Connection>) => void;
  onConnectionDelete?: (connectionId: string) => void;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  components,
  connections,
  selectedConnection,
  onConnectionSelect,
  onConnectionUpdate,
  onConnectionDelete
}) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
      {connections.map((connection) => {
        const fromComponent = components.find(c => c.id === connection.from);
        const toComponent = components.find(c => c.id === connection.to);
        
        if (!fromComponent || !toComponent) {
          console.warn(`[ConnectionManager] Connection ${connection.id}: component not found`, {
            from: connection.from,
            to: connection.to,
            fromFound: !!fromComponent,
            toFound: !!toComponent
          });
          return null;
        }
        
        return (
          <ConnectionLine
            key={connection.id}
            connection={connection}
            fromComponent={fromComponent}
            toComponent={toComponent}
            isSelected={selectedConnection === connection.id}
            onSelect={() => onConnectionSelect(connection.id)}
            onUpdate={onConnectionUpdate}
            onDelete={onConnectionDelete}
          />
        );
      })}
    </div>
  );
};
