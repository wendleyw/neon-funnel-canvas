import { useCallback, useState } from 'react';
import { Connection } from '../../../types/funnel';

interface UseCanvasSelectionOptions {
  onConnectionAdd: (connection: Connection) => void;
  onConnectionDelete: (connectionId: string) => void;
  onConnectionUpdate?: (connectionId: string, updates: Partial<Connection>) => void;
}

export const useCanvasSelection = ({ 
  onConnectionAdd, 
  onConnectionDelete, 
  onConnectionUpdate 
}: UseCanvasSelectionOptions) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  const handleComponentConnect = useCallback((toComponentId: string) => {
    if (connectingFrom && connectingFrom !== toComponentId) {
      console.log('✨ Creating connection from', connectingFrom, 'to', toComponentId);
      
      const newConnection: Connection = {
        id: `connection-${Date.now()}`,
        from: connectingFrom,
        to: toComponentId,
        type: 'success' as const,
        color: '#10B981',
        animated: true
      };
      
      onConnectionAdd(newConnection);
      // Clear connection state
      setConnectingFrom(null);
    }
  }, [connectingFrom, onConnectionAdd]);

  const handleComponentSelect = useCallback((componentId: string) => {
    // Keep component selected during connection
    if (connectingFrom) {
      console.log('🔄 Connection state active. Click another component to connect.');
      return;
    }
    
    setSelectedComponent(componentId);
    // Clear connection selection when selecting component
    setSelectedConnection(null);
  }, [connectingFrom]);

  const startConnection = useCallback((componentId: string) => {
    if (connectingFrom === componentId) {
      // If clicking same component, cancel connection
      setConnectingFrom(null);
      return;
    }
    
    // If in connection mode, try to connect
    if (connectingFrom) {
      handleComponentConnect(componentId);
      return;
    }
    
    // Start connection mode
    setConnectingFrom(componentId);
    // Clear connection selection when selecting component
    setSelectedConnection(null);
  }, [connectingFrom, handleComponentConnect]);

  const handleConnectionSelect = useCallback((connectionId: string) => {
    console.log('🔗 Connection selected:', connectionId);
    
    // Clear component selection when selecting connection
    setSelectedComponent(null);
    
    // If already selected, close editor
    if (selectedConnection === connectionId) {
      setSelectedConnection(null);
      return;
    }
    
    // Select connection and open editor
    setSelectedConnection(connectionId);
  }, [selectedConnection]);

  const handleConnectionColorChange = useCallback((connectionId: string, updates: Partial<Connection>) => {
    console.log('🎨 Updating connection:', connectionId, 'with:', updates);
    if (onConnectionUpdate) {
      onConnectionUpdate(connectionId, updates);
    }
  }, [onConnectionUpdate]);

  const clearSelection = useCallback(() => {
    console.log('🧹 Clearing all selections');
    setSelectedComponent(null);
    setConnectingFrom(null);
    setSelectedConnection(null);
  }, []);

  // Log current state for debug
  console.log('🔍 Current selection state:', {
    selectedComponent,
    connectingFrom,
    selectedConnection,
    isConnecting: !!connectingFrom
  });

  return {
    selectedComponent,
    connectingFrom,
    selectedConnection,
    setSelectedComponent,
    handleComponentSelect,
    startConnection,
    handleComponentConnect,
    handleConnectionSelect,
    handleConnectionColorChange,
    clearSelection,
  };
};
