import React from 'react';
import { ReactFlowEdge } from '../../../types/reactflow';
import { FunnelComponent, Connection as FunnelConnection } from '../../../types/funnel';
import { Trash2 } from 'lucide-react';

interface CanvasOverlaysProps {
  isDragOver: boolean;
  connections: FunnelConnection[];
  edgeContextMenu: {
    visible: boolean;
    edge: ReactFlowEdge | null;
    x: number;
    y: number;
  };
  nodeMap: Map<string, FunnelComponent>;
  onDeleteEdge: (edge: ReactFlowEdge) => void;
  onCloseContextMenu: () => void;
  showStats: boolean;
  nodes: any[];
  edges: any[];
  transform: any[];
}

/**
 * Component for rendering canvas overlays including drag indicators,
 * connection status, and edge context menus
 */
export const CanvasOverlays: React.FC<CanvasOverlaysProps> = ({
  isDragOver,
  connections,
  edgeContextMenu,
  nodeMap,
  onDeleteEdge,
  onCloseContextMenu,
  showStats,
  nodes,
  edges,
  transform
}) => {
  return (
    <>
      {/* Enhanced drag over indicator */}
      {isDragOver && (
        <div className="absolute inset-4 border-2 border-dashed border-blue-500 rounded-lg bg-blue-500/5 pointer-events-none z-10 flex items-center justify-center">
          <div className="text-blue-400 text-lg font-medium">
            📦 Drop component here!
          </div>
        </div>
      )}

      {/* General stats overlay */}
      {showStats && (
        <div className="absolute bottom-4 left-4 bg-gray-800/80 backdrop-blur-sm text-white p-3 rounded-lg text-xs border border-gray-700/50 shadow-xl">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <span>Nodes:</span><span className="font-mono">{nodes.length}</span>
            <span>Edges:</span><span className="font-mono">{edges.length}</span>
            <span>Zoom:</span><span className="font-mono">{transform[2].toFixed(2)}x</span>
            {connections.length > 0 && (
              <>
                <span>Connections:</span><span className="font-mono text-green-400">{connections.length} active connection{connections.length !== 1 ? 's' : ''}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edge Context Menu */}
      {edgeContextMenu.visible && edgeContextMenu.edge && (
        <div 
          className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 py-2 min-w-48"
          style={{
            left: edgeContextMenu.x,
            top: edgeContextMenu.y,
            transform: 'translate(-50%, -100%)', // Position menu above the click point
          }}
        >
          {/* Menu Header */}
          <div className="px-4 py-2 border-b border-gray-700">
            <div className="text-white text-sm font-medium">
              Connection: {edgeContextMenu.edge.data?.label || 'Lead'}
            </div>
            <div className="text-gray-400 text-xs">
              {nodeMap.get(edgeContextMenu.edge.source)?.data.title} → {nodeMap.get(edgeContextMenu.edge.target)?.data.title}
            </div>
          </div>
          
          {/* Menu Options */}
          <div className="py-1">
            <button
              onClick={() => onDeleteEdge(edgeContextMenu.edge!)}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors flex items-center gap-2 text-sm"
            >
              <span>🗑️</span>
              <span>Delete Connection</span>
            </button>
            
            <button
              onClick={onCloseContextMenu}
              className="w-full text-left px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <span>❌</span>
              <span>Cancel</span>
            </button>
          </div>
          
          {/* Instructions */}
          <div className="px-4 py-2 border-t border-gray-700">
            <div className="text-gray-500 text-xs">
              💡 Tip: Press ESC to close
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CanvasOverlays; 