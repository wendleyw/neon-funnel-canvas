import { useState, useEffect } from 'react';
import { FunnelComponent, Connection as FunnelConnection } from '../../../types/funnel';

interface UseCanvasStateProps {
  components: FunnelComponent[];
  connections: FunnelConnection[];
  onConnectionAdd: (connection: FunnelConnection) => void;
  onComponentDelete: (id: string) => void;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
}

interface UseCanvasStateReturn {
  highlightedNodeId: string | null;
  setHighlightedNodeId: (id: string | null) => void;
}

/**
 * Custom hook for managing canvas state and global window effects
 * Handles highlighted nodes and global window callbacks
 */
export const useCanvasState = ({
  components,
  connections,
  onConnectionAdd,
  onComponentDelete,
  onComponentUpdate
}: UseCanvasStateProps): UseCanvasStateReturn => {
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  /**
   * Set up global connection callbacks for external use
   */
  useEffect(() => {
    const globalWindow = window as typeof window & {
      __onConnectionAdd?: (connection: FunnelConnection) => void;
      __onComponentDelete?: (id: string) => void;
      __onComponentUpdate?: (id: string, updates: Partial<FunnelComponent>) => void;
    };
    
    globalWindow.__onConnectionAdd = onConnectionAdd;
    globalWindow.__onComponentDelete = onComponentDelete;
    globalWindow.__onComponentUpdate = onComponentUpdate;
    
    return () => {
      delete globalWindow.__onConnectionAdd;
      delete globalWindow.__onComponentDelete;
      delete globalWindow.__onComponentUpdate;
    };
  }, [onConnectionAdd, onComponentDelete, onComponentUpdate]);

  return {
    highlightedNodeId,
    setHighlightedNodeId
  };
}; 