
import { useCallback, useState } from 'react';

interface UseCanvasSelectionOptions {
  onConnectionAdd: (connection: any) => void;
  onConnectionDelete: (connectionId: string) => void;
  onConnectionUpdate?: (connectionId: string, updates: any) => void;
}

export const useCanvasSelection = ({ 
  onConnectionAdd, 
  onConnectionDelete, 
  onConnectionUpdate 
}: UseCanvasSelectionOptions) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  const handleComponentSelect = useCallback((componentId: string) => {
    console.log('Selecionando componente:', componentId);
    
    // Limpa seleção de conexão ao selecionar componente
    setSelectedConnection(null);
    setConnectingFrom(null);
    
    // Sempre seleciona o componente clicado
    setSelectedComponent(componentId);
    console.log('Componente selecionado:', componentId);
  }, []);

  const startConnection = useCallback((fromComponentId: string) => {
    console.log('Iniciando conexão de:', fromComponentId);
    setConnectingFrom(fromComponentId);
    // Mantém o componente selecionado durante a conexão
  }, []);

  const handleComponentConnect = useCallback((toComponentId: string) => {
    if (connectingFrom && connectingFrom !== toComponentId) {
      console.log('Criando conexão de', connectingFrom, 'para', toComponentId);
      const newConnection = {
        id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        from: connectingFrom,
        to: toComponentId,
        type: 'success' as const,
        animated: false
      };
      
      onConnectionAdd(newConnection);
      setConnectingFrom(null);
      // Mantém o componente origem selecionado após criar a conexão
      setSelectedComponent(connectingFrom);
    }
  }, [connectingFrom, onConnectionAdd]);

  const handleConnectionSelect = useCallback((connectionId: string) => {
    // Limpa seleção de componentes ao selecionar conexão
    setSelectedComponent(null);
    setConnectingFrom(null);
    
    if (selectedConnection === connectionId) {
      // Se já estava selecionada, fecha o editor
      console.log('Fechando editor de conexão:', connectionId);
      setSelectedConnection(null);
    } else {
      // Seleciona a conexão e abre o editor
      console.log('Abrindo editor de conexão:', connectionId);
      setSelectedConnection(connectionId);
    }
  }, [selectedConnection]);

  const handleConnectionColorChange = useCallback((connectionId: string, updates: any) => {
    console.log('Atualizando conexão:', connectionId, 'com:', updates);
    if (onConnectionUpdate) {
      onConnectionUpdate(connectionId, updates);
    }
  }, [onConnectionUpdate]);

  const clearSelection = useCallback(() => {
    console.log('Limpando todas as seleções');
    setSelectedComponent(null);
    setConnectingFrom(null);
    setSelectedConnection(null);
  }, []);

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
    clearSelection
  };
};
