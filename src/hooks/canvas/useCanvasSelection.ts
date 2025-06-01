
import { useCallback, useState } from 'react';

interface UseCanvasSelectionOptions {
  onConnectionAdd: (connection: any) => void;
}

export const useCanvasSelection = ({ onConnectionAdd }: UseCanvasSelectionOptions) => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [firstSelected, setFirstSelected] = useState<string | null>(null);

  const handleComponentSelect = useCallback((componentId: string) => {
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

  const clearSelection = useCallback(() => {
    setSelectedComponent(null);
    setFirstSelected(null);
  }, []);

  return {
    selectedComponent,
    firstSelected,
    setSelectedComponent,
    handleComponentSelect,
    clearSelection
  };
};
