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

  const handleComponentConnect = useCallback((toComponentId: string) => {
    console.log('🔗 handleComponentConnect chamado:', { connectingFrom, toComponentId });
    
    if (!connectingFrom) {
      console.warn('⚠️ Tentativa de conectar sem componente de origem');
      return;
    }
    
    if (connectingFrom === toComponentId) {
      console.warn('⚠️ Tentativa de conectar componente a si mesmo');
      return;
    }
    
    console.log('✨ Criando conexão de', connectingFrom, 'para', toComponentId);
    
    const newConnection = {
      id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: connectingFrom,
      to: toComponentId,
      type: 'success' as const,
      animated: false
    };
    
    console.log('📦 Nova conexão criada:', newConnection);
    
    try {
      onConnectionAdd(newConnection);
      console.log('✅ Conexão adicionada com sucesso');
      
      // Limpa o estado de conexão
      setConnectingFrom(null);
      // Seleciona o componente de destino
      setSelectedComponent(toComponentId);
      
      console.log('🎉 Processo de conexão concluído');
    } catch (error) {
      console.error('❌ Erro ao adicionar conexão:', error);
    }
  }, [connectingFrom, onConnectionAdd]);

  const handleComponentSelect = useCallback((componentId: string) => {
    console.log('🎯 Selecionando componente:', componentId);
    
    // Se estamos no modo conexão, tenta conectar
    if (connectingFrom && connectingFrom !== componentId) {
      console.log('🔗 Tentando conectar de', connectingFrom, 'para', componentId);
      handleComponentConnect(componentId);
      return;
    }
    
    // Limpa seleção de conexão ao selecionar componente
    setSelectedConnection(null);
    setConnectingFrom(null);
    
    // Sempre seleciona o componente clicado
    setSelectedComponent(componentId);
    console.log('✅ Componente selecionado:', componentId);
  }, [connectingFrom, handleComponentConnect]);

  const startConnection = useCallback((fromComponentId: string) => {
    console.log('🚀 Iniciando conexão de:', fromComponentId);
    setConnectingFrom(fromComponentId);
    setSelectedConnection(null);
    // Mantém o componente selecionado durante a conexão
    setSelectedComponent(fromComponentId);
    console.log('🔄 Estado de conexão ativo. Clique em outro componente para conectar.');
  }, []);

  const handleConnectionSelect = useCallback((connectionId: string) => {
    console.log('🔗 Selecionando conexão:', connectionId);
    
    // Limpa seleção de componentes ao selecionar conexão
    setSelectedComponent(null);
    setConnectingFrom(null);
    
    if (selectedConnection === connectionId) {
      // Se já estava selecionada, fecha o editor
      console.log('❌ Fechando editor de conexão:', connectionId);
      setSelectedConnection(null);
    } else {
      // Seleciona a conexão e abre o editor
      console.log('📝 Abrindo editor de conexão:', connectionId);
      setSelectedConnection(connectionId);
    }
  }, [selectedConnection]);

  const handleConnectionColorChange = useCallback((connectionId: string, updates: any) => {
    console.log('🎨 Atualizando conexão:', connectionId, 'com:', updates);
    if (onConnectionUpdate) {
      onConnectionUpdate(connectionId, updates);
    }
  }, [onConnectionUpdate]);

  const clearSelection = useCallback(() => {
    console.log('🧹 Limpando todas as seleções');
    setSelectedComponent(null);
    setConnectingFrom(null);
    setSelectedConnection(null);
  }, []);

  // Log do estado atual para debug
  console.log('🔍 Estado atual da seleção:', {
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
    clearSelection
  };
};
