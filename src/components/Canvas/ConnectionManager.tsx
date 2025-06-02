import React from 'react';
import { FunnelComponent, Connection } from '../../types/funnel';
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
  console.log('🔗 ConnectionManager render:', {
    connectionsCount: connections.length,
    componentsCount: components.length,
    connections: connections.map(c => ({ id: c.id, from: c.from, to: c.to }))
  });

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
      {connections.map((connection) => {
        const fromComponent = components.find(c => c.id === connection.from);
        const toComponent = components.find(c => c.id === connection.to);
        
        if (!fromComponent || !toComponent) {
          console.warn(`❌ Conexão ${connection.id}: componente não encontrado`, {
            from: connection.from,
            to: connection.to,
            fromFound: !!fromComponent,
            toFound: !!toComponent
          });
          return null;
        }

        console.log(`🎯 Renderizando conexão ${connection.id}:`, {
          from: {
            id: fromComponent.id,
            position: fromComponent.position,
            adjustedPosition: {
              x: fromComponent.position.x + 5000,
              y: fromComponent.position.y + 5000
            }
          },
          to: {
            id: toComponent.id,
            position: toComponent.position,
            adjustedPosition: {
              x: toComponent.position.x + 5000,
              y: toComponent.position.y + 5000
            }
          }
        });
        
        return (
          <ConnectionLine
            key={connection.id}
            connection={connection}
            fromPosition={{
              x: fromComponent.position.x + 5000,
              y: fromComponent.position.y + 5000
            }}
            toPosition={{
              x: toComponent.position.x + 5000,
              y: toComponent.position.y + 5000
            }}
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
