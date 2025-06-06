
import React from 'react';
import { FunnelComponent, Connection } from '../types/funnel';

interface StatusBarProps {
  components: FunnelComponent[];
  connections: Connection[];
}

export const StatusBar = React.memo<StatusBarProps>(({ components, connections }) => {
  return (
    <div className="h-6 lg:h-8 bg-black border-t border-gray-800 flex items-center justify-between px-2 lg:px-4 text-xs text-gray-400 shrink-0">
      <div className="flex items-center space-x-2 lg:space-x-4">
        <span className="hidden lg:inline">Pronto •</span>
        <span>{components.length} comp.</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">{connections.length} conexões</span>
      </div>
      <div className="hidden lg:block">
        FunnelCraft v1.0 • PWA Ready
      </div>
    </div>
  );
});

StatusBar.displayName = 'StatusBar';
