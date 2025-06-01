
import React from 'react';
import { FunnelComponent, Connection } from '../../types/funnel';
import { ConnectionLine } from '../ConnectionLine';

interface ConnectionManagerProps {
  components: FunnelComponent[];
  connections: Connection[];
  connectingFrom: string | null;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  components,
  connections,
  connectingFrom
}) => {
  return (
    <>
      {/* SVG for connections */}
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
            />
          );
        })}
      </svg>

      {connectingFrom && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Clique em outro componente para conectar
        </div>
      )}
    </>
  );
};
