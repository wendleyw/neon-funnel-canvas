import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Connection, FunnelComponent } from '../types/funnel';

interface ConnectionSequence {
  id: string;
  connections: Connection[];
  components: FunnelComponent[];
  totalDuration: number;
  startTime: number;
}

interface SequenceAnimationContextType {
  isSequenceMode: boolean;
  activeSequences: ConnectionSequence[];
  toggleSequenceMode: () => void;
  disableSequenceMode: () => void;
  analyzeAndStartSequences: (connections: Connection[], components: FunnelComponent[]) => void;
  getConnectionDelay: (connectionId: string) => number;
  isConnectionInActiveSequence: (connectionId: string) => boolean;
}

const SequenceAnimationContext = createContext<SequenceAnimationContextType | undefined>(undefined);

interface SequenceAnimationProviderProps {
  children: ReactNode;
}

export const SequenceAnimationProvider: React.FC<SequenceAnimationProviderProps> = ({ children }) => {
  const [isSequenceMode, setIsSequenceMode] = useState(true);
  const [activeSequences, setActiveSequences] = useState<ConnectionSequence[]>([]);

  const toggleSequenceMode = useCallback(() => {
    setIsSequenceMode(prev => !prev);
    console.log(`[SequenceAnimation] Sequence mode ${!isSequenceMode ? 'enabled' : 'disabled'}`);
  }, [isSequenceMode]);

  const disableSequenceMode = useCallback(() => {
    setIsSequenceMode(false);
    setActiveSequences([]);
    console.log('[SequenceAnimation] Sequence mode disabled and sequences cleared');
  }, []);

  // Detecta cadeias de conexões e calcula sequências
  const findConnectionChains = useCallback((connections: Connection[], components: FunnelComponent[]) => {
    console.log('[SequenceAnimation] Finding connection chains...', { 
      connectionsCount: connections.length, 
      componentsCount: components.length 
    });

    const chains: Connection[][] = [];
    const usedConnections = new Set<string>();

    // Cria mapa de componentes para lookup rápido
    const componentMap = new Map(components.map(c => [c.id, c]));
    
    // Cria mapa de conexões de saída para cada componente
    const outgoingConnections = new Map<string, Connection[]>();
    connections.forEach(conn => {
      if (!outgoingConnections.has(conn.from)) {
        outgoingConnections.set(conn.from, []);
      }
      outgoingConnections.get(conn.from)!.push(conn);
    });

    // Encontra pontos de início (componentes sem conexões de entrada)
    const incomingConnections = new Set(connections.map(c => c.to));
    const startPoints = components.filter(comp => !incomingConnections.has(comp.id));

    console.log('[SequenceAnimation] Start points found:', startPoints.map(s => s.data.title));
    console.log('[SequenceAnimation] Incoming connections:', Array.from(incomingConnections));
    console.log('[SequenceAnimation] Outgoing connections map:', Object.fromEntries(outgoingConnections));

    // Constrói cadeias a partir de cada ponto inicial
    startPoints.forEach(startComponent => {
      const chain: Connection[] = [];
      let currentComponentId = startComponent.id;

      console.log(`[SequenceAnimation] Building chain from ${startComponent.data.title} (${currentComponentId})`);

      while (currentComponentId) {
        const outgoing = outgoingConnections.get(currentComponentId);
        if (outgoing && outgoing.length > 0 && !usedConnections.has(outgoing[0].id)) {
          const connection = outgoing[0]; // Pega a primeira conexão (pode ser expandido para múltiplas)
          chain.push(connection);
          usedConnections.add(connection.id);
          
          console.log(`[SequenceAnimation] Added connection to chain: ${componentMap.get(connection.from)?.data.title} → ${componentMap.get(connection.to)?.data.title}`);
          
          currentComponentId = connection.to;
        } else {
          console.log(`[SequenceAnimation] Chain ended at ${componentMap.get(currentComponentId)?.data.title} - no more connections`);
          break;
        }
      }

      if (chain.length > 0) {
        chains.push(chain);
        console.log('[SequenceAnimation] Chain completed:', chain.map(c => `${componentMap.get(c.from)?.data.title} → ${componentMap.get(c.to)?.data.title}`));
      }
    });

    console.log(`[SequenceAnimation] Found ${chains.length} connection chains`);
    return chains;
  }, []);

  const analyzeAndStartSequences = useCallback((connections: Connection[], components: FunnelComponent[]) => {
    console.log('[SequenceAnimation] analyzeAndStartSequences called', { 
      isSequenceMode, 
      connectionsLength: connections.length, 
      componentsLength: components.length 
    });

    if (!isSequenceMode || connections.length === 0) {
      setActiveSequences([]);
      console.log('[SequenceAnimation] Sequence mode disabled or no connections, clearing sequences');
      return;
    }

    console.log('[SequenceAnimation] Analyzing connections for sequences...');

    const chains = findConnectionChains(connections, components);
    const newSequences: ConnectionSequence[] = [];

    chains.forEach((chain, index) => {
      if (chain.length > 0) {
        const sequenceId = `sequence-${index}-${Date.now()}`;
        const connectionDuration = 4000; // 4 segundos por conexão
        const totalDuration = chain.length * connectionDuration;

        const sequence: ConnectionSequence = {
          id: sequenceId,
          connections: chain,
          components: components.filter(c => 
            chain.some(conn => conn.from === c.id || conn.to === c.id)
          ),
          totalDuration,
          startTime: Date.now()
        };

        newSequences.push(sequence);
        console.log(`[SequenceAnimation] Created sequence ${sequenceId} with ${chain.length} connections, duration: ${totalDuration}ms`);
      }
    });

    console.log(`[SequenceAnimation] Created ${newSequences.length} sequences`);
    setActiveSequences(newSequences);

    // Reinicia as sequências a cada ciclo completo
    if (newSequences.length > 0) {
      const maxDuration = Math.max(...newSequences.map(s => s.totalDuration));
      console.log(`[SequenceAnimation] Setting restart timer for ${maxDuration + 1000}ms`);
      setTimeout(() => {
        if (isSequenceMode) {
          console.log('[SequenceAnimation] Restarting sequences...');
          analyzeAndStartSequences(connections, components);
        }
      }, maxDuration + 1000); // Pequena pausa entre ciclos
    }
  }, [isSequenceMode, findConnectionChains]);

  const getConnectionDelay = useCallback((connectionId: string): number => {
    for (const sequence of activeSequences) {
      const connectionIndex = sequence.connections.findIndex(c => c.id === connectionId);
      if (connectionIndex !== -1) {
        const delay = connectionIndex * 4000;
        console.log(`[SequenceAnimation] Connection ${connectionId} delay: ${delay}ms (index: ${connectionIndex})`);
        return delay; // 4 segundos de delay por conexão anterior
      }
    }
    return 0;
  }, [activeSequences]);

  const isConnectionInActiveSequence = useCallback((connectionId: string): boolean => {
    const inSequence = activeSequences.some(sequence => 
      sequence.connections.some(c => c.id === connectionId)
    );
    console.log(`[SequenceAnimation] Connection ${connectionId} in sequence: ${inSequence}`);
    return inSequence;
  }, [activeSequences]);

  return (
    <SequenceAnimationContext.Provider
      value={{
        isSequenceMode,
        activeSequences,
        toggleSequenceMode,
        disableSequenceMode,
        analyzeAndStartSequences,
        getConnectionDelay,
        isConnectionInActiveSequence
      }}
    >
      {children}
    </SequenceAnimationContext.Provider>
  );
};

export const useSequenceAnimation = () => {
  const context = useContext(SequenceAnimationContext);
  if (context === undefined) {
    throw new Error('useSequenceAnimation must be used within a SequenceAnimationProvider');
  }
  return context;
}; 