
import { useCallback, useState } from 'react';

interface UseCanvasSelectionOptions {
  onConnectionAdd: (connection: any) => void;
  onConnectionDelete: (connectionId: string) => void;
}

export const useCanvasSelection = ({ onConnectionAdd, onConnectionDelete }: UseCanvasSelectionOptions) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [firstSelected, setFirstSelected] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  const handleComponentSelect = useCallback((componentId: string) => {
    // Limpa seleção de conexão ao selecionar componente
    setSelectedConnection(null);
    
    if (!firstSelected) {
      // Primeiro componente selecionado
      setFirstSelected(componentId);
      setSelectedComponent(componentId);
    } else if (firstSelected === componentId) {
      // Clicou no mesmo componente, cancela seleção
      setFirstSelected(null);
      setSelectedComponent(null);
    } else {
      // Segundo componente selecionado, cria conexão
      const newConnection = {
        id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        from: firstSelected,
        to: componentId,
        type: 'success' as const
      };
      
      onConnectionAdd(newConnection);
      setFirstSelected(null);
      setSelectedComponent(null);
    }
  }, [firstSelected, onConnectionAdd]);

  const handleConnectionSelect = useCallback((connectionId: string) => {
    // Limpa seleção de componentes ao selecionar conexão
    setSelectedComponent(null);
    setFirstSelected(null);
    
    if (selectedConnection === connectionId) {
      // Se já estava selecionada, delete a conexão
      onConnectionDelete(connectionId);
      setSelectedConnection(null);
    } else {
      // Seleciona a conexão
      setSelectedConnection(connectionId);
    }
  }, [selectedConnection, onConnectionDelete]);

  const clearSelection = useCallback(() => {
    setSelectedComponent(null);
    setFirstSelected(null);
    setSelectedConnection(null);
  }, []);

  return {
    selectedComponent,
    firstSelected,
    selectedConnection,
    setSelectedComponent,
    handleComponentSelect,
    handleConnectionSelect,
    clearSelection
  };
};
