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
import { toast } from 'sonner';

import { FunnelComponentNode } from './FunnelComponentNode';
import { AnimatedSVGEdge } from './AnimatedSVGEdge';

// Custom node types
const nodeTypes: NodeTypes = {
  funnelComponent: FunnelComponentNode,
};

// Custom edge types
const edgeTypes: EdgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};

// Example initial nodes
const initialNodes = [
  {
    id: '1',
    type: 'funnelComponent',
    position: { x: 100, y: 100 },
    data: {
      label: 'Landing Page',
      icon: '🚀',
      type: 'landing-page',
      description: 'Initial lead capture page',
      isActive: true,
    },
  },
  {
    id: '2',
    type: 'funnelComponent',
    position: { x: 400, y: 100 },
    data: {
      label: 'Interactive Quiz',
      icon: '❓',
      type: 'quiz',
      description: 'Quiz to qualify leads',
      isActive: false,
    },
  },
  {
    id: '3',
    type: 'funnelComponent',
    position: { x: 700, y: 100 },
    data: {
      label: 'Sales Page',
      icon: '📈',
      type: 'sales-page',
      description: 'Presentation of the main offer',
      isActive: false,
    },
  },
  {
    id: '4',
    type: 'funnelComponent',
    position: { x: 400, y: 300 },
    data: {
      label: 'Email Sequence',
      icon: '📧',
      type: 'email-sequence',
      description: 'Automated lead nurturing',
      isActive: false,
    },
  },
];

// Example initial edges
const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'animatedSvg',
    data: {
      label: 'CTA Click',
      color: '#10B981',
      animated: true,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#10B981',
    },
  },
];

// Connection validation rules
const isValidConnection = (connection: Connection | Edge): boolean => {
    // Example: Allow connections only from source handle 'a' to target handle 'b'
    // return connection.sourceHandle === 'a' && connection.targetHandle === 'b';

    // Example: Disallow connections to self
    if (connection.source === connection.target) {
      return false;
    }

    // Example: Only allow one connection from a specific source node
    // const existingEdges = edges.filter(edge => edge.source === connection.source);
    // if (existingEdges.length >= 1) return false;

    return true; // Default: allow all connections
  }
;

const ConnectionExamples: React.FC = () => { // Renamed component
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handler for new connections
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      console.log('Attempting to connect:', params);
      if (isValidConnection(params)) {
        console.log('🔗 New connection:', params);
        
        const defaultEdgeData = {
          label: 'Lead',
          color: '#3B82F6',
          animated: true,
        };

        const edgeData = (params as Edge).data ? (params as Edge).data : defaultEdgeData;

        const newEdge = {
          ...params, 
          type: 'animatedSvg', 
          data: {
            label: edgeData.label || defaultEdgeData.label,
            color: edgeData.color || defaultEdgeData.color,
            animated: edgeData.animated !== undefined ? edgeData.animated : defaultEdgeData.animated,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeData.color || defaultEdgeData.color,
          },
        };
        setEdges((eds) => addEdge(newEdge, eds));
      } else {
        console.warn('❌ Invalid connection blocked', params);
      }
    },
    [setEdges] // Removed isValidConnection as it's a stable function now
  );

  // Save flow to localStorage
  const saveFlow = useCallback(() => {
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('react-flow-funnel', JSON.stringify(flowData));
    console.log('💾 Flow saved to localStorage');
    toast.success('Flow saved successfully!'); // Replaced alert
  }, [nodes, edges]);

  // Load flow from localStorage
  const loadFlow = useCallback(() => {
    try {
      const savedFlow = localStorage.getItem('react-flow-funnel');
      if (savedFlow) {
        const flowData = JSON.parse(savedFlow);
        setNodes(flowData.nodes || []);
        setEdges(flowData.edges || []);
        console.log('📂 Flow loaded from localStorage');
        toast.success('Flow loaded successfully!'); // Replaced alert
      } else {
        toast.info('No saved flow found.'); // Replaced alert
      }
    } catch (error) {
      console.error('Error loading flow:', error);
      toast.error('Error loading flow.'); // Replaced alert
    }
  }, [setNodes, setEdges]);

  // Clear flow
  const clearFlow = useCallback(() => {
    toast('Are you sure you want to clear the flow?', {
      duration: Infinity, // Keep toast visible until an action is taken
      action: {
        label: 'Confirm Clear',
        onClick: () => {
          setNodes([]);
          setEdges([]);
          localStorage.removeItem('react-flow-funnel');
          console.log('🗑️ Flow cleared');
          toast.success('Flow cleared successfully!');
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          toast.info('Clear operation cancelled.');
        },
      },
    });
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-screen bg-gray-900">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={saveFlow}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          💾 Save
        </button>
        <button
          onClick={loadFlow}
          className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
        >
          📂 Load
        </button>
        <button
          onClick={clearFlow}
          className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          🗑️ Clear
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-10 bg-gray-800 text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold mb-2">How to use:</h3>
        <ul className="text-sm space-y-1">
          <li>• Drag from blue points (input) to green points (output)</li>
          <li>• Delete: Delete or Backspace key</li>
          <li>• Zoom: Mouse scroll</li>
          <li>• Pan: Drag the canvas</li>
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

// Wrapper component with ReactFlowProvider
export const ConnectionExamplesWrapper: React.FC = () => { // Renamed wrapper
  return (
    <ReactFlowProvider>
      <ConnectionExamples />
    </ReactFlowProvider>
  );
};

export default ConnectionExamplesWrapper; // Exporting renamed wrapper 