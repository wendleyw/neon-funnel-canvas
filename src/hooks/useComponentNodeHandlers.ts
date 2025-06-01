
import { useCallback } from 'react';
import { FunnelComponent } from '../types/funnel';

interface UseComponentNodeHandlersProps {
  component: FunnelComponent;
  canConnect: boolean;
  onSelect: () => void;
  onConnect: () => void;
  onDelete: () => void;
  onStartConnection: () => void;
  onUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onDuplicate?: () => void;
  setIsEditing: (editing: boolean) => void;
}

export const useComponentNodeHandlers = ({
  component,
  canConnect,
  onSelect,
  onConnect,
  onDelete,
  onStartConnection,
  onUpdate,
  onDuplicate,
  setIsEditing
}: UseComponentNodeHandlersProps) => {
  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, [setIsEditing]);

  const handleDuplicateClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate?.();
  }, [onDuplicate]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, [setIsEditing]);

  const handleUpdateComponent = useCallback((updates: Partial<FunnelComponent>) => {
    onUpdate(component.id, updates);
  }, [component.id, onUpdate]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Se pode conectar, conecta em vez de selecionar
    if (canConnect) {
      onConnect();
      return;
    }
    
    // Não seleciona se clicou em botões
    if ((e.target as Element).closest('button')) {
      return;
    }
    
    onSelect();
  }, [onSelect, onConnect, canConnect]);

  const handleConnectionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onStartConnection();
  }, [onStartConnection]);

  return {
    handleDeleteClick,
    handleEditClick,
    handleDuplicateClick,
    handleDoubleClick,
    handleUpdateComponent,
    handleClick,
    handleConnectionClick
  };
};
