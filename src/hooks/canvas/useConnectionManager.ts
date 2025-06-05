import { useCallback, useState, useEffect } from 'react';
import { Connection, Edge, MarkerType, useReactFlow } from 'reactflow';
import { 
  FunnelComponent, 
  Connection as FunnelConnection 
} from '../../types/funnel';
import { ReactFlowEdge } from '../../types/reactflow';
import { 
  getEdgeStyle, 
  getConnectionLabel, 
  calculateBestConnectionPoints 
} from '../../utils/reactFlowHelpers';

interface UseConnectionManagerProps {
  connections: FunnelConnection[];
  nodeMap: Map<string, FunnelComponent>;
  onConnectionAdd: (connection: FunnelConnection) => void;
  onConnectionDelete: (connectionId: string) => void;
  enableConnectionValidation?: boolean;
  helpers?: any; // useReactFlowHelpers instance
}

interface UseConnectionManagerReturn {
  isConnecting: boolean;
  onConnect: (params: Connection | Edge) => void;
  onConnectStart: (event: React.MouseEvent | React.TouchEvent, data: any) => void;
  onConnectEnd: (event: MouseEvent | TouchEvent) => void;
  onEdgeClick: (event: React.MouseEvent, edge: ReactFlowEdge) => void;
  onNodeClick: (event: React.MouseEvent, node: any) => void;
  edgeContextMenu: {
    visible: boolean;
    edge: ReactFlowEdge | null;
    x: number;
    y: number;
  };
  handleDeleteEdge: (edge: ReactFlowEdge) => void;
  handleCanvasClick: () => void;
  setEdges: React.Dispatch<React.SetStateAction<any[]>>;
}

/**
 * Custom hook for managing ReactFlow connections
 * Handles connection creation, validation, and edge interactions
 */
export const useConnectionManager = ({
  connections,
  nodeMap,
  onConnectionAdd,
  onConnectionDelete,
  enableConnectionValidation = true,
  helpers
}: UseConnectionManagerProps): UseConnectionManagerReturn => {
  const reactFlowInstance = useReactFlow();
  const [isConnecting, setIsConnecting] = useState(false);
  const [edgeContextMenu, setEdgeContextMenu] = useState({
    visible: false,
    edge: null as ReactFlowEdge | null,
    x: 0,
    y: 0
  });

  // Enhanced connection handler
  const onConnect = useCallback((params: Connection | Edge) => {
    setIsConnecting(true);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 New connection:', params.source, '→', params.target);
    }
    
    // Validation
    if (!params.source || !params.target) {
      console.warn('❌ Invalid connection: missing source or target');
      setIsConnecting(false);
      return;
    }
    
    if (params.source === params.target) {
      console.warn('❌ Invalid connection: cannot connect to self');
      setIsConnecting(false);
      return;
    }
    
    // Check if connection already exists
    const existingConnection = connections.find(
      conn => conn.from === params.source && conn.to === params.target
    );
    
    if (existingConnection) {
      console.warn('❌ Connection already exists');
      setIsConnecting(false);
      return;
    }
    
    // Validate with helpers if available
    if (enableConnectionValidation && helpers && !helpers.validateConnection(params as Connection)) {
      console.warn('❌ Invalid connection blocked by validation rules');
      setIsConnecting(false);
      return;
    }
    
    // Get components for styling
    const sourceComp = nodeMap.get(params.source!);
    const targetComp = nodeMap.get(params.target!);
    
    // Calculate optimal handles
    let optimalHandles;
    if (params.sourceHandle === null || params.targetHandle === null) {
      optimalHandles = calculateBestConnectionPoints(
        params.source!, 
        params.target!, 
        reactFlowInstance.getNodes, 
        nodeMap
      );
    } else {
      optimalHandles = {
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle
      };
    }
    
    const sourceHandle = optimalHandles.sourceHandle;
    const targetHandle = optimalHandles.targetHandle;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🧭 Using optimal handles:', { 
        sourceHandle, 
        targetHandle, 
        method: params.sourceHandle === null ? 'CALCULATED' : 'PROVIDED'
      });
    }
    
    const edgeStyle = sourceComp && targetComp ? getEdgeStyle(sourceComp.type, targetComp.type) : { 
      color: '#3B82F6', 
      strokeWidth: 2, 
      type: 'smoothstep' 
    };
    
    // Create new edge
    const newEdge = {
      id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      source: params.source!,
      target: params.target!,
      sourceHandle: sourceHandle,
      targetHandle: targetHandle,
      type: 'animatedNode' as const,
      animated: true,
      data: {
        label: getConnectionLabel(sourceComp?.type, targetComp?.type),
        color: edgeStyle.color,
        animated: true,
        sourceComponent: sourceComp?.data.title,
        targetComponent: targetComp?.data.title,
        routing: { sourceHandle, targetHandle },
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
    };
    
    // Add to ReactFlow
    const edges = reactFlowInstance.getEdges();
    reactFlowInstance.setEdges([...edges, newEdge]);
    
    // Convert to funnel connection
    const funnelConnection: FunnelConnection = {
      id: newEdge.id,
      from: newEdge.source,
      to: newEdge.target,
      type: 'success',
      color: edgeStyle.color,
      animated: true,
      connectionData: {
        condition: newEdge.data.label,
        dataType: `${newEdge.data.sourceComponent} → ${newEdge.data.targetComponent}`,
      }
    };
    
    onConnectionAdd(funnelConnection);
    setIsConnecting(false);
    
    console.log('✅ Connection completed:', funnelConnection.id);
  }, [
    connections, 
    nodeMap, 
    onConnectionAdd, 
    reactFlowInstance, 
    enableConnectionValidation, 
    helpers
  ]);

  // Connection start handler
  const onConnectStart = useCallback((
    event: React.MouseEvent | React.TouchEvent, 
    { nodeId, handleId, handleType }: { nodeId: string; handleId: string | null; handleType: string }
  ) => {
    setIsConnecting(true);
    
    // Store connection state globally
    (window as any).__reactflow__connection_in_progress = {
      nodeId,
      handleId,
      handleType,
      startTime: Date.now()
    };
    
    console.log('🔗 Connection started from node:', nodeId, 'handle:', handleId);
  }, []);

  // Connection end handler
  const onConnectEnd = useCallback((event: MouseEvent | TouchEvent) => {
    const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;
    
    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
    if (!reactFlowBounds) {
      setIsConnecting(false);
      return;
    }
    
    const position = reactFlowInstance.project({
      x: clientX - reactFlowBounds.left,
      y: clientY - reactFlowBounds.top,
    });
    
    const intersectingNodes = reactFlowInstance.getIntersectingNodes({
      x: position.x - 50,
      y: position.y - 50,
      width: 100,
      height: 100,
    });
    
    if (intersectingNodes.length > 0) {
      const targetNode = intersectingNodes[0];
      const connectionInProgress = (window as any).__reactflow__connection_in_progress;
      
      if (connectionInProgress && connectionInProgress.nodeId !== targetNode.id) {
        const sourceNodeId = connectionInProgress.nodeId;
        const targetNodeId = targetNode.id;
        
        console.log('🔗 Creating connection from drop:', sourceNodeId, '→', targetNodeId);
        
        onConnect({
          source: sourceNodeId,
          target: targetNodeId,
          sourceHandle: null,
          targetHandle: null,
        });
      }
    }
    
    setIsConnecting(false);
    delete (window as any).__reactflow__connection_in_progress;
  }, [reactFlowInstance, onConnect]);

  // Edge click handler
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: ReactFlowEdge) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Edge clicked:', edge.id, 'Label:', edge.data?.label);
    }
    
    setEdgeContextMenu({
      visible: true,
      edge: edge,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  // Node click handler for edge connections
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    event.stopPropagation();
    
    const globalWindow = window as typeof window & {
      __edgeConnectionMode?: {
        enabled: boolean;
        targetEdge?: ReactFlowEdge;
      };
    };
    
    const edgeConnectionMode = globalWindow.__edgeConnectionMode;
    if (edgeConnectionMode?.enabled && edgeConnectionMode.targetEdge) {
      console.log('🔗 Creating connection to edge:', edgeConnectionMode.targetEdge.id);
      
      const targetEdge = edgeConnectionMode.targetEdge;
      const sourceComp = nodeMap.get(node.id);
      
      if (sourceComp) {
        const newConnection: FunnelConnection = {
          id: `edge-to-${node.id}-${Date.now()}`,
          from: node.id,
          to: targetEdge.target!,
          type: 'success',
          color: '#10B981',
          animated: true,
          connectionData: {
            condition: `Via ${targetEdge.data?.label || 'Lead'}`,
            dataType: `${sourceComp.data.title} → ${targetEdge.data?.label || 'Lead'} → Target`
          }
        };
        
        onConnectionAdd(newConnection);
        globalWindow.__edgeConnectionMode = { enabled: false };
      }
    }
  }, [nodeMap, onConnectionAdd]);

  // Handle delete edge
  const handleDeleteEdge = useCallback((edge: ReactFlowEdge) => {
    console.log('🗑️ Deleting edge:', edge.id);
    
    const connection = connections.find(conn => conn.id === edge.id);
    
    if (connection) {
      onConnectionDelete(connection.id);
      
      // Remove from ReactFlow edges
      const edges = reactFlowInstance.getEdges();
      reactFlowInstance.setEdges(edges.filter((e) => e.id !== edge.id));
      
      setEdgeContextMenu({ visible: false, edge: null, x: 0, y: 0 });
      console.log('✅ Edge deleted successfully:', edge.id);
    } else {
      console.warn('❌ Connection not found for edge:', edge.id);
    }
  }, [connections, onConnectionDelete, reactFlowInstance]);

  // Close context menu when clicking canvas
  const handleCanvasClick = useCallback(() => {
    if (edgeContextMenu.visible) {
      setEdgeContextMenu({ visible: false, edge: null, x: 0, y: 0 });
    }
  }, [edgeContextMenu.visible]);

  // ESC key handler to cancel connections
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isConnecting) {
        setIsConnecting(false);
        console.log('🔗 Connection cancelled with ESC');
      }
      if (event.key === 'Escape' && edgeContextMenu.visible) {
        setEdgeContextMenu({ visible: false, edge: null, x: 0, y: 0 });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isConnecting, edgeContextMenu.visible]);

  return {
    isConnecting,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onEdgeClick,
    onNodeClick,
    edgeContextMenu,
    handleDeleteEdge,
    handleCanvasClick,
    setEdges: reactFlowInstance.setEdges
  };
}; 