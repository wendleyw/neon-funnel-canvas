
import { useCallback, useState } from 'react';

interface UseCanvasSelectionOptions {
  onConnectionAdd: (connection: any) => void;
  onConnectionDelete: (connectionId: string) => void;
}

export const useCanvasSelection = ({ onConnectionAdd, onConnectionDelete }: UseCanvasSelectionOptions) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  const handleComponentSelect = useCallback((componentId: string) => {
    console.log('Selecionando componente:', componentId);
    
    // Limpa seleção de conexão ao selecionar componente
    setSelectedConnection(null);
    
    if (selectedComponent === componentId) {
      // Clicou no mesmo componente, cancela seleção
      setSelectedComponent(null);
      setConnectingFrom(null);
      console.log('Seleção cancelada');
    } else {
      // Seleciona o componente
      setSelectedComponent(componentId);
      setConnectingFrom(null);
      console.log('Componente selecionado:', componentId);
    }
  }, [selectedComponent]);

  const startConnection = useCallback((fromComponentId: string) => {
    console.log('Iniciando conexão de:', fromComponentId);
    setConnectingFrom(fromComponentId);
  }, []);

  const handleComponentConnect = useCallback((toComponentId: string) => {
    if (connectingFrom && connectingFrom !== toComponentId) {
      console.log('Criando conexão de', connectingFrom, 'para', toComponentId);
      const newConnection = {
        id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        from: connectingFrom,
        to: toComponentId,
        type: 'success' as const
      };
      
      onConnectionAdd(newConnection);
      setConnectingFrom(null);
      setSelectedComponent(null);
    }
  }, [connectingFrom, onConnectionAdd]);

  const handleConnectionSelect = useCallback((connectionId: string) => {
    // Limpa seleção de componentes ao selecionar conexão
    setSelectedComponent(null);
    setConnectingFrom(null);
    
    if (selectedConnection === connectionId) {
      // Se já estava selecionada, delete a conexão
      console.log('Deletando conexão:', connectionId);
      onConnectionDelete(connectionId);
      setSelectedConnection(null);
    } else {
      // Seleciona a conexão
      console.log('Selecionando conexão:', connectionId);
      setSelectedConnection(connectionId);
    }
  }, [selectedConnection, onConnectionDelete]);

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
    clearSelection
  };
};
