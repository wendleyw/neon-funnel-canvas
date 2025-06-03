import React, { useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  MarkerType,
  ReactFlowProvider,
  NodeTypes,
  EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { FunnelComponentNode } from './FunnelComponentNode';
import { AnimatedSVGEdge } from './AnimatedSVGEdge';

// Tipos de nós customizados
const nodeTypes: NodeTypes = {
  funnelComponent: FunnelComponentNode,
};

// Tipos de arestas customizadas
const edgeTypes: EdgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};

// Nós iniciais de exemplo
const initialNodes = [
  {
    id: '1',
    type: 'funnelComponent',
    position: { x: 100, y: 100 },
    data: {
      label: 'Landing Page',
      icon: '🚀',
      type: 'landing-page',
      description: 'Página inicial de captura de leads',
      isActive: true,
    },
  },
  {
    id: '2',
    type: 'funnelComponent',
    position: { x: 400, y: 100 },
    data: {
      label: 'Quiz Interativo',
      icon: '❓',
      type: 'quiz',
      description: 'Quiz para qualificar leads',
      isActive: false,
    },
  },
  {
    id: '3',
    type: 'funnelComponent',
    position: { x: 700, y: 100 },
    data: {
      label: 'Página de Vendas',
      icon: '💰',
      type: 'sales-page',
      description: 'Apresentação da oferta principal',
      isActive: false,
    },
  },
  {
    id: '4',
    type: 'funnelComponent',
    position: { x: 400, y: 300 },
    data: {
      label: 'Sequência de E-mails',
      icon: '📧',
      type: 'email-sequence',
      description: 'Nutrição automática de leads',
      isActive: false,
    },
  },
];

// Arestas iniciais de exemplo
const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'animatedSvg',
    data: {
      label: 'Clique CTa',
      color: '#10B981',
      animated: true,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#10B981',
    },
  },
];

// Regras de validação de conexão
const isValidConnection = (connection: Connection): boolean => {
  if (!connection.source || !connection.target) return false;
  if (connection.source === connection.target) return false;

  // Regras específicas de tipo de componente
  const connectionRules: Record<string, string[]> = {
    'landing-page': ['quiz', 'opt-in-page', 'email-sequence'],
    'quiz': ['sales-page', 'email-sequence', 'thank-you-page'],
    'sales-page': ['checkout', 'thank-you-page'],
    'email-sequence': ['sales-page', 'landing-page'],
  };

  // Aqui você poderia implementar validação mais específica
  // baseada nos dados dos nós
  return true;
};

const ExemploConexoes: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Função para lidar com novas conexões
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      console.log('🔗 Nova conexão:', params);
      
      if (!isValidConnection(params as Connection)) {
        console.warn('❌ Conexão inválida bloqueada');
        return;
      }

      const newEdge = {
        ...params,
        type: 'animatedSvg',
        data: {
          label: 'Lead',
          color: '#3B82F6',
          animated: true,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3B82F6',
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Salvar estado no localStorage
  const saveFlow = useCallback(() => {
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('react-flow-funnel', JSON.stringify(flowData));
    console.log('💾 Fluxo salvo no localStorage');
    alert('Fluxo salvo com sucesso!');
  }, [nodes, edges]);

  // Carregar estado do localStorage
  const loadFlow = useCallback(() => {
    try {
      const savedFlow = localStorage.getItem('react-flow-funnel');
      if (savedFlow) {
        const flowData = JSON.parse(savedFlow);
        setNodes(flowData.nodes || []);
        setEdges(flowData.edges || []);
        console.log('📂 Fluxo carregado do localStorage');
        alert('Fluxo carregado com sucesso!');
      } else {
        alert('Nenhum fluxo salvo encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar fluxo:', error);
      alert('Erro ao carregar fluxo');
    }
  }, [setNodes, setEdges]);

  // Limpar fluxo
  const clearFlow = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar o fluxo?')) {
      setNodes([]);
      setEdges([]);
      localStorage.removeItem('react-flow-funnel');
      console.log('🗑️ Fluxo limpo');
    }
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-screen bg-gray-900">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={saveFlow}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          💾 Salvar
        </button>
        <button
          onClick={loadFlow}
          className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
        >
          📂 Carregar
        </button>
        <button
          onClick={clearFlow}
          className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          🗑️ Limpar
        </button>
      </div>

      {/* Instruções */}
      <div className="absolute top-4 right-4 z-10 bg-gray-800 text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold mb-2">Como usar:</h3>
        <ul className="text-sm space-y-1">
          <li>• Arraste dos pontos azuis (entrada) para verdes (saída)</li>
          <li>• Delete: tecla Delete ou Backspace</li>
          <li>• Zoom: scroll do mouse</li>
          <li>• Pan: arrastar o canvas</li>
        </ul>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineStyle={{ 
          stroke: '#3B82F6', 
          strokeWidth: 2,
          strokeDasharray: '5,5' 
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={2}
        fitView
        attributionPosition="bottom-right"
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode="Shift"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#374151"
        />
        <Controls className="!bg-gray-800 !border-gray-600" />
        <MiniMap 
          className="!bg-gray-800 !border-gray-600"
          nodeStrokeColor="#374151"
          nodeColor="#1F2937"
          nodeBorderRadius={8}
        />
      </ReactFlow>
    </div>
  );
};

// Componente wrapper com ReactFlowProvider
export const ExemploConexoesWrapper: React.FC = () => {
  return (
    <ReactFlowProvider>
      <ExemploConexoes />
    </ReactFlowProvider>
  );
};

export default ExemploConexoesWrapper; 