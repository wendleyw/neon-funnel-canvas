import { useCallback } from 'react';
import { Connection } from '../../types/funnel';

interface UseConnectionHandlersProps {
  setProject: React.Dispatch<React.SetStateAction<any>>;
}

export const useConnectionHandlers = ({ setProject }: UseConnectionHandlersProps) => {
  const handleConnectionAdd = useCallback((connection: Connection) => {
    console.log('[ConnectionHandlers] Adding connection:', connection);
    
    // Auto-enable neon animation for new connections
    const animatedConnection = {
      ...connection,
      animated: true // Always enable neon animation by default
    };
    
    setProject(prev => {
      const updatedProject = {
        ...prev,
        connections: [...prev.connections, animatedConnection],
        updatedAt: new Date().toISOString()
      };
      console.log('[ConnectionHandlers] Project after connection add:', {
        connectionsCount: updatedProject.connections.length,
        newConnection: `${connection.from} -> ${connection.to}`,
        animated: animatedConnection.animated
      });
      return updatedProject;
    });
  }, [setProject]);

  const handleConnectionDelete = useCallback((connectionId: string) => {
    console.log('[ConnectionHandlers] Deleting connection:', connectionId);
    setProject(prev => {
      const updatedProject = {
        ...prev,
        connections: prev.connections.filter(connection => connection.id !== connectionId),
        updatedAt: new Date().toISOString()
      };
      console.log('[ConnectionHandlers] Project after connection delete:', {
        connectionsCount: updatedProject.connections.length,
        deletedConnection: connectionId
      });
      return updatedProject;
    });
  }, [setProject]);

  const handleConnectionUpdate = useCallback((connectionId: string, updates: Partial<Connection>) => {
    console.log('[ConnectionHandlers] Updating connection:', connectionId, updates);
    setProject(prev => {
      const updatedProject = {
        ...prev,
        connections: prev.connections.map(connection =>
          connection.id === connectionId ? { ...connection, ...updates } : connection
        ),
        updatedAt: new Date().toISOString()
      };
      console.log('[ConnectionHandlers] Project after connection update:', {
        connectionsCount: updatedProject.connections.length,
        updatedConnection: connectionId,
        updateData: updates
      });
      return updatedProject;
    });
  }, [setProject]);

  return {
    handleConnectionAdd,
    handleConnectionDelete,
    handleConnectionUpdate
  };
};
