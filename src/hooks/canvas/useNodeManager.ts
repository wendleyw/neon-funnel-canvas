import { useMemo, useCallback, useEffect } from 'react';
import { Node, Edge, useReactFlow, useNodesState, useEdgesState } from 'reactflow';
import { 
  FunnelComponent, 
  Connection as FunnelConnection 
} from '../../types/funnel';
import { 
  ReactFlowNode, 
  ReactFlowEdge, 
  convertFunnelComponentToNode, 
  convertConnectionToEdge 
} from '../../types/reactflow';
import { 
  getEdgeStyle, 
  getConnectionLabel, 
  calculateBestConnectionPoints 
} from '../../utils/reactFlowHelpers';
import { MarkerType } from 'reactflow';

interface UseNodeManagerProps {
  components: FunnelComponent[];
  connections: FunnelConnection[];
  highlightedNodeId: string | null;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
  onConnectionDelete: (connectionId: string) => void;
}

interface UseNodeManagerReturn {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  nodeMap: Map<string, FunnelComponent>;
  setNodes: any;
  setEdges: any;
  onNodesChange: any;
  onEdgesChange: any;
  onNodesDelete: (deletedNodes: Node[]) => void;
  onEdgesDelete: (deletedEdges: Edge[]) => void;
  onNodeDragStop: (event: React.MouseEvent, node: Node) => void;
}

/**
 * Custom hook for managing ReactFlow nodes and edges
 * Handles node transformations, state management, and synchronization
 */
export const useNodeManager = ({
  components,
  connections,
  highlightedNodeId,
  onComponentUpdate,
  onComponentDelete,
  onConnectionDelete
}: UseNodeManagerProps): UseNodeManagerReturn => {
  const reactFlowInstance = useReactFlow();

  /**
   * Create a map for quick node lookup - memoized for performance
   */
  const nodeMap = useMemo(() => {
    const map = new Map<string, FunnelComponent>();
    components.forEach(comp => map.set(comp.id, comp));
    return map;
  }, [components]);

  /**
   * Transform funnel components to ReactFlow nodes
   */
  const initialNodes: ReactFlowNode[] = useMemo(() => {
    const nodes = components.map((component) => {
      try {
        const node = convertFunnelComponentToNode(component);
        // Modify to use custom node type
        const customNode = {
          ...node,
          type: 'custom',
          data: {
            ...node.data,
            title: component.data.title,
            description: component.data.description,
            status: component.data.status,
            originalType: component.type,
            isHighlighted: highlightedNodeId === component.id,
          }
        };
        
        return customNode;
      } catch (error) {
        console.error(`Failed to convert component ${component.id}:`, error);
        return null;
      }
    }).filter(Boolean) as ReactFlowNode[];
    
    return nodes;
  }, [components, highlightedNodeId]);

  /**
   * Transform funnel connections to ReactFlow edges
   */
  const initialEdges: ReactFlowEdge[] = useMemo(() => {
    const edges = connections.map(connection => {
      const edge = convertConnectionToEdge(connection);
      
      // Get source and target components for styling
      const sourceComp = nodeMap.get(connection.from);
      const targetComp = nodeMap.get(connection.to);
      
      // Calculate optimal connection points
      const recalculatedHandles = calculateBestConnectionPoints(
        connection.from, 
        connection.to, 
        reactFlowInstance.getNodes, 
        nodeMap
      );
      
      if (sourceComp && targetComp) {
        const edgeStyle = getEdgeStyle(sourceComp.type, targetComp.type);
        return {
          ...edge,
          sourceHandle: recalculatedHandles.sourceHandle,
          targetHandle: recalculatedHandles.targetHandle,
          type: 'animatedNode' as const,
          animated: true,
          data: {
            ...edge.data,
            label: getConnectionLabel(sourceComp.type, targetComp.type),
          },
          style: { 
            stroke: edgeStyle.color, 
            strokeWidth: edgeStyle.strokeWidth,
            strokeDasharray: undefined,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeStyle.color,
            width: 20,
            height: 20,
          },
          labelStyle: {
            background: getConnectionLabel(sourceComp.type, targetComp.type) === 'Lead' ? '#10B981' : '#374151',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '20px',
            border: getConnectionLabel(sourceComp.type, targetComp.type) === 'Lead' ? '2px solid #34D399' : '1px solid #6B7280',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: getConnectionLabel(sourceComp.type, targetComp.type) === 'Lead' ? '0 4px 6px rgba(16, 185, 129, 0.3)' : 'none'
          },
          labelBgStyle: {
            fill: 'transparent'
          },
          pathOptions: {
            offset: 20,
            borderRadius: 10,
          },
        };
      }
      
      // Fallback for connections without component data
      const fallbackHandles = calculateBestConnectionPoints(
        connection.from, 
        connection.to, 
        reactFlowInstance.getNodes, 
        nodeMap
      );
      
      return {
        ...edge,
        sourceHandle: fallbackHandles.sourceHandle,
        targetHandle: fallbackHandles.targetHandle,
        type: 'animatedNode' as const,
        animated: true,
        data: {
          ...edge.data,
          label: 'Lead',
        },
        style: { 
          stroke: '#10B981', 
          strokeWidth: 3 
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#10B981',
          width: 20,
          height: 20,
        },
        labelStyle: {
          background: '#10B981',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '2px solid #34D399',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
        },
        labelBgStyle: {
          fill: 'transparent'
        },
        pathOptions: {
          offset: 20,
          borderRadius: 10,
        },
      };
    });
    
    return edges;
  }, [connections, nodeMap, reactFlowInstance]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  /**
   * Sync nodes with components state changes
   */
  useEffect(() => {
    if (initialNodes.length !== nodes.length) {
      setNodes(initialNodes);
    } else {
      // Check if the actual nodes are different
      const currentNodeIds = new Set(nodes.map(n => n.id));
      const expectedNodeIds = new Set(initialNodes.map(n => n.id));
      
      const missingInCurrent = initialNodes.filter(n => !currentNodeIds.has(n.id));
      const extraInCurrent = nodes.filter(n => !expectedNodeIds.has(n.id));
      
      if (missingInCurrent.length > 0 || extraInCurrent.length > 0) {
        setNodes(initialNodes);
      }
    }
  }, [initialNodes, components, nodes, setNodes]);

  /**
   * Handle node deletion
   */
  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    deletedNodes.forEach(node => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🗑️ Deleting node:', node.id);
      }
      onComponentDelete(node.id);
    });
  }, [onComponentDelete]);

  /**
   * Handle edge deletion
   */
  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    deletedEdges.forEach(edge => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🗑️ Deleting edge:', edge.id);
      }
      onConnectionDelete(edge.id);
    });
  }, [onConnectionDelete]);

  /**
   * Handle node drag stop - update position and recalculate edges
   */
  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    if (process.env.NODE_ENV === 'development' && false) {
      console.log('📍 Node moved:', node.id, node.position);
    }
    
    onComponentUpdate(node.id, { position: node.position });
    
    // Update edges that connect to this node to use optimal handles
    setEdges((currentEdges) => {
      const updatedEdges = currentEdges.map((edge) => {
        // Check if this edge involves the moved node
        if (edge.source === node.id || edge.target === node.id) {
          if (process.env.NODE_ENV === 'development' && false) {
            console.log(`🔄 Updating edge handles for moved node: ${edge.id}`);
          }
          
          // Recalculate optimal handles for this connection
          const optimalHandles = calculateBestConnectionPoints(
            edge.source, 
            edge.target, 
            reactFlowInstance.getNodes, 
            nodeMap
          );
          
          return {
            ...edge,
            sourceHandle: optimalHandles.sourceHandle,
            targetHandle: optimalHandles.targetHandle,
          };
        }
        return edge;
      });
      
      return updatedEdges;
    });
  }, [onComponentUpdate, setEdges, reactFlowInstance, nodeMap]);

  return {
    nodes: nodes as ReactFlowNode[],
    edges: edges as ReactFlowEdge[],
    nodeMap,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onNodesDelete,
    onEdgesDelete,
    onNodeDragStop
  };
}; 