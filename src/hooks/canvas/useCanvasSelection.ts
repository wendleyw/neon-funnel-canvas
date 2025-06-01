
import { useCallback, useState } from 'react';

interface UseCanvasSelectionOptions {
  onConnectionAdd: (connection: any) => void;
}

export const useCanvasSelection = ({ onConnectionAdd }: UseCanvasSelectionOptions) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  const handleConnectionStart = useCallback((componentId: string) => {
    setConnectingFrom(componentId);
  }, []);

  const handleConnectionEnd = useCallback((componentId: string) => {
    if (connectingFrom && connectingFrom !== componentId) {
      const newConnection = {
        id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        from: connectingFrom,
        to: componentId,
        type: 'success' as const
      };
      
      onConnectionAdd(newConnection);
    }
    setConnectingFrom(null);
  }, [connectingFrom, onConnectionAdd]);

  const clearSelection = useCallback(() => {
    setSelectedComponent(null);
    setConnectingFrom(null);
  }, []);

  return {
    selectedComponent,
    setSelectedComponent,
    connectingFrom,
    handleConnectionStart,
    handleConnectionEnd,
    clearSelection
  };
};
