import { useCallback } from 'react';
import { Connection } from '../../../types/funnel';

interface UseConnectionHandlersProps {
  setProject: React.Dispatch<React.SetStateAction<any>>;
}

export const useConnectionHandlers = ({ setProject }: UseConnectionHandlersProps) => {
  const handleConnectionAdd = useCallback((connection: Connection) => {
    setProject(prev => {
      const updatedProject = {
        ...prev,
        connections: [...prev.connections, connection],
        updatedAt: new Date().toISOString()
      };
      return updatedProject;
    });
  }, [setProject]);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    setProject(prev => {
      const updatedProject = {
        ...prev,
        connections: prev.connections.filter(conn => conn.id !== connectionId),
        updatedAt: new Date().toISOString()
      };
      return updatedProject;
    });
  }, [setProject]);

  const handleConnectionUpdate = useCallback((connectionId: string, updates: Partial<Connection>) => {
    setProject(prev => {
      const updatedProject = {
        ...prev,
        connections: prev.connections.map(conn =>
          conn.id === connectionId ? { ...conn, ...updates } : conn
        ),
        updatedAt: new Date().toISOString()
      };
      return updatedProject;
    });
  }, [setProject]);

  return {
    handleConnectionAdd,
    handleConnectionDelete,
    handleConnectionUpdate,
  };
};
