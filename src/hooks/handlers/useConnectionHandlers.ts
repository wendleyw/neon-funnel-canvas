
import { useCallback } from 'react';
import { Connection } from '../../types/funnel';

interface UseConnectionHandlersProps {
  setProject: React.Dispatch<React.SetStateAction<any>>;
}

export const useConnectionHandlers = ({ setProject }: UseConnectionHandlersProps) => {
  const handleConnectionAdd = useCallback((connection: Connection) => {
    setProject(prev => ({
      ...prev,
      connections: [...prev.connections, connection],
      updatedAt: new Date().toISOString()
    }));
  }, [setProject]);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    setProject(prev => ({
      ...prev,
      connections: prev.connections.filter(connection => connection.id !== connectionId),
      updatedAt: new Date().toISOString()
    }));
  }, [setProject]);

  const handleConnectionUpdate = useCallback((connectionId: string, updates: Partial<Connection>) => {
    setProject(prev => ({
      ...prev,
      connections: prev.connections.map(connection =>
        connection.id === connectionId ? { ...connection, ...updates } : connection
      ),
      updatedAt: new Date().toISOString()
    }));
  }, [setProject]);

  return {
    handleConnectionAdd,
    handleConnectionDelete,
    handleConnectionUpdate
  };
};
