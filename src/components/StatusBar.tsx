
import React from 'react';
import { FunnelComponent, Connection } from '../types/funnel';

interface StatusBarProps {
  components: FunnelComponent[];
  connections: Connection[];
}

export const StatusBar = React.memo<StatusBarProps>(({ components, connections }) => {
  return (
    <div className="h-8 bg-black border-t border-gray-800 flex items-center justify-between px-4 text-xs text-gray-400">
      <div>
        Pronto • {components.length} componentes • {connections.length} conexões
      </div>
      <div>
        FunnelCraft v1.0 • PWA Ready
      </div>
    </div>
  );
});

StatusBar.displayName = 'StatusBar';
