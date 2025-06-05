import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeProps,
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
  NodeTypes,
  EdgeTypes,
  ConnectionLineType,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { FunnelComponent, Connection as FunnelConnection, ComponentTemplate } from '../types/funnel';
import { 
  ReactFlowNode, 
  ReactFlowEdge, 
  convertFunnelComponentToNode, 
  convertConnectionToEdge,
  convertNodeToFunnelComponent,
  convertEdgeToConnection 
} from '../types/reactflow';
import { getComponentDimensions } from '../utils/connectionUtils';
import CustomNode from './ReactFlow/CustomNode';
import { FunnelComponentNode } from './ReactFlow/FunnelComponentNode';
import { AnimatedNodeEdge } from './ReactFlow/AnimatedNodeEdge';
import { AnimatedSVGEdge } from './ReactFlow/AnimatedSVGEdge';
import { useReactFlowHelpers } from '../hooks/useReactFlowHelpers';
import { 
  isValidConnection, 
  getEdgeStyle, 
  getConnectionLabel, 
  calculateBestConnectionPoints,
  generateRandomOffset 
} from '../utils/reactFlowHelpers';

/**
 * Props interface for the ReactFlow Canvas component
 */
interface ReactFlowCanvasProps {
  components: FunnelComponent[];
  connections: FunnelConnection[];
  onComponentAdd: (component: FunnelComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
  onConnectionAdd: (connection: FunnelConnection) => void;
  onConnectionDelete: (connectionId: string) => void;
  onConnectionUpdate?: (connectionId: string, updates: Partial<FunnelConnection>) => void;
  enableConnectionValidation?: boolean;
}

/**
 * Edge context menu state interface
 */
interface EdgeContextMenuState {
  visible: boolean;
  edge: ReactFlowEdge | null;
  x: number;
  y: number;
}

/**
 * Wrapper component to add debug capabilities to CustomNode
 */
const DebugCustomNode: React.FC<NodeProps> = (props) => {
  return React.createElement(CustomNode, props);
};

/**
 * Define custom node and edge types OUTSIDE component to prevent recreation
 * This fixes the React Flow warning about recreating nodeTypes/edgeTypes
 */
const nodeTypes: NodeTypes = {
  custom: DebugCustomNode,
  funnelComponent: FunnelComponentNode,
};

const edgeTypes: EdgeTypes = {
  animatedNode: AnimatedNodeEdge,
  animatedSvg: AnimatedSVGEdge,
};

/**
 * Main ReactFlow Canvas component for the funnel builder
 * This component manages the visual representation of funnel components and their connections
 */
const ReactFlowCanvas: React.FC<ReactFlowCanvasProps> = ({
  components,
  connections,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete,
  onConnectionAdd,
  onConnectionDelete,
  enableConnectionValidation = true,
}) => {
  
  const reactFlowInstance = useReactFlow();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  
  // Edge context menu state
  const [edgeContextMenu, setEdgeContextMenu] = useState<EdgeContextMenuState>({
    visible: false,
    edge: null,
    x: 0,
    y: 0
  });
  
  // Use the enhanced helpers hook for React Flow operations
  const helpers = useReactFlowHelpers({ 
    components, 
    connections, 
    onComponentUpdate 
  });
  
  /**
   * Create a map for quick node lookup - memoized for performance
   */
  const nodeMap = useMemo(() => {
    const map = new Map<string, FunnelComponent>();
    components.forEach(comp => map.set(comp.id, comp));
    return map;
  }, [components]);

  /**
   * Set up global connection callbacks for external use
   */
  useEffect(() => {
    const globalWindow = window as typeof window & {
      __onConnectionAdd?: (connection: FunnelConnection) => void;
      __onComponentDelete?: (id: string) => void;
      __onComponentUpdate?: (id: string, updates: Partial<FunnelComponent>) => void;
    };
    
    globalWindow.__onConnectionAdd = onConnectionAdd;
    globalWindow.__onComponentDelete = onComponentDelete;
    globalWindow.__onComponentUpdate = onComponentUpdate;
    
    return () => {
      delete globalWindow.__onConnectionAdd;
      delete globalWindow.__onComponentDelete;
      delete globalWindow.__onComponentUpdate;
    };
  }, [onConnectionAdd, onComponentDelete, onComponentUpdate]);

  // Converter dados do funnel para React Flow
  const initialNodes: ReactFlowNode[] = useMemo(() => {
    const nodes = components.map((component, index) => {
      try {
        const node = convertFunnelComponentToNode(component);
        // Modificar o tipo para usar nosso nó customizado
        const customNode = {
          ...node,
          type: 'custom',
          data: {
            ...node.data,
            title: component.data.title,
            description: component.data.description,
            status: component.data.status,
            originalType: component.type, // Preservar o tipo original para o template
            isHighlighted: highlightedNodeId === component.id, // Adicionar info de destaque
          }
        };
        
        return customNode;
      } catch (error) {
        console.error(`Failed to convert component ${component.id}:`, error);
        return null;
      }
    }).filter(Boolean) as ReactFlowNode[]; // Remove null entries and assert type
    
    return nodes;
  }, [components, highlightedNodeId]);
  
  const initialEdges: ReactFlowEdge[] = useMemo(() => {
    const edges = connections.map(connection => {
      const edge = convertConnectionToEdge(connection);
      
      // Get source and target components for styling
      const sourceComp = nodeMap.get(connection.from);
      const targetComp = nodeMap.get(connection.to);
      
      // FORCE recalculation of handles for existing connections
      const recalculatedHandles = calculateBestConnectionPoints(
        connection.from, 
        connection.to, 
        reactFlowInstance.getNodes, 
        nodeMap
      );
      
      // Only log during development and when there are actual changes
      if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
        console.log(`🔄 Recalculating handles for edge: ${connection.id}`, {
          from: connection.from,
          to: connection.to,
          handles: recalculatedHandles,
          sourceType: sourceComp?.type,
          targetType: targetComp?.type
        });
      }
      
      if (sourceComp && targetComp) {
        const edgeStyle = getEdgeStyle(sourceComp.type, targetComp.type);
        return {
          ...edge,
          // FORCE use recalculated handles
          sourceHandle: recalculatedHandles.sourceHandle,
          targetHandle: recalculatedHandles.targetHandle,
          type: 'animatedNode' as const, // Use our animated edge type
          animated: true,
          data: {
            ...edge.data,
            label: getConnectionLabel(sourceComp.type, targetComp.type),
          },
          style: { 
            stroke: edgeStyle.color, 
            strokeWidth: edgeStyle.strokeWidth,
            strokeDasharray: undefined, // Solid line
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeStyle.color,
            width: 20,
            height: 20,
          },
          // Enhanced label styling for "Lead" connections
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
          // Add better path options
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
        // FORCE use recalculated handles even for fallback
        sourceHandle: fallbackHandles.sourceHandle,
        targetHandle: fallbackHandles.targetHandle,
        type: 'animatedNode' as const, // Use our animated edge type
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
        // Enhanced label styling for default "Lead" connections
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
    
    // Only log in development mode when needed
    if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
      console.log('🔄 Initial edges with recalculated handles:', edges);
    }
    return edges;
  }, [connections, nodeMap, calculateBestConnectionPoints, getConnectionLabel]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // CRITICAL FIX: Sync nodes with components state changes
  useEffect(() => {
    // Force update nodes when components change
    if (initialNodes.length !== nodes.length) {
      setNodes(initialNodes);
    } else {
      // Even if counts match, check if the actual nodes are different
      const currentNodeIds = new Set(nodes.map(n => n.id));
      const expectedNodeIds = new Set(initialNodes.map(n => n.id));
      
      const missingInCurrent = initialNodes.filter(n => !currentNodeIds.has(n.id));
      const extraInCurrent = nodes.filter(n => !expectedNodeIds.has(n.id));
      
      if (missingInCurrent.length > 0 || extraInCurrent.length > 0) {
        setNodes(initialNodes);
      }
    }
  }, [initialNodes, components, nodes, setNodes]); // Include missing dependencies

  // Drag & Drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
    
    // Reduced debugging - only log when needed
    if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
      console.log('🔍 DragOver Debug:', {
        hasDataTransfer: !!event.dataTransfer,
        types: event.dataTransfer?.types || [],
        effectAllowed: event.dataTransfer?.effectAllowed,
        dropEffect: event.dataTransfer?.dropEffect,
        files: event.dataTransfer?.files?.length || 0
      });
    }
  }, []);

  const onDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
    
    // Reduced debugging - only log when needed
    if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
      console.log('🔍 DragEnter Debug:', {
        target: event.target,
        currentTarget: event.currentTarget,
        hasDataTransfer: !!event.dataTransfer
      });
    }
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    // Reduce excessive logging
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    // Only set dragOver to false when actually leaving the component
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    try {
      const templateData = event.dataTransfer.getData('application/json');
      
      if (!templateData) {
        // Try other data formats
        const textData = event.dataTransfer.getData('text/plain');
        
        // Try to get all available data
        for (const type of event.dataTransfer.types) {
          const data = event.dataTransfer.getData(type);
        }
        
        toast.error('Error: No component found in drag. Please ensure you are dragging from an item in the sidebar.');
        return;
      }
      
      const template: ComponentTemplate = JSON.parse(templateData);

      // Verificar se o template tem todos os campos necessários
      if (!template.type || !template.label) {
        console.error('❌ Invalid template:', template);
        toast.error('Invalid template: missing required fields');
        return;
      }

      // IMPROVED POSITIONING: Use a more reliable approach for visible positioning
      const viewport = reactFlowInstance.getViewport();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      
      // SIMPLE APPROACH: Always position at the center of the current view
      // Calculate the actual center of what the user can see
      const viewportCenterX = (-viewport.x + reactFlowBounds.width / 2) / viewport.zoom;
      const viewportCenterY = (-viewport.y + reactFlowBounds.height / 2) / viewport.zoom;
      
      // Add small random offset to avoid overlapping if multiple components are added
      const randomOffset = () => (Math.random() - 0.5) * 50; // ±25px offset
      
      const position = {
        x: viewportCenterX + randomOffset(),
        y: viewportCenterY + randomOffset()
      };

      const newComponent: FunnelComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: template.type as FunnelComponent['type'],
        position: position,
        connections: [],
        data: {
          title: template.defaultProps?.title || template.label,
          description: template.defaultProps?.description || '',
          image: template.defaultProps?.image || '',
          url: template.defaultProps?.url || '',
          status: template.defaultProps?.status || 'draft',
          properties: template.defaultProps?.properties || {}
        }
      };

      onComponentAdd(newComponent);
      
      // ENHANCED: Ensure visibility with more robust strategies
      
      // Strategy 1: Wait for component to be added to state, then focus
      setTimeout(() => {
        try {
          const currentNodes = reactFlowInstance.getNodes();
          const newNode = currentNodes.find(n => n.id === newComponent.id);
          
          if (newNode) {
            reactFlowInstance.setCenter(newNode.position.x, newNode.position.y, { 
              zoom: 1.2, 
              duration: 800 
            });
          } else {
            reactFlowInstance.setCenter(position.x, position.y, { zoom: 1.2, duration: 800 });
          }
        } catch (error) {
          console.warn('Failed to center on new component:', error);
        }
      }, 200); // Increased delay to ensure state update

      // Strategy 2: FitView with proper node inclusion (fallback)
      setTimeout(() => {
        try {
          const currentNodes = reactFlowInstance.getNodes();
          
          if (currentNodes.length > 0) {
            reactFlowInstance.fitView({ 
              padding: 0.15, 
              includeHiddenNodes: true,
              duration: 1000,
              maxZoom: 1.5,
              minZoom: 0.1
            });
          }
        } catch (error) {
          console.warn('Failed to fit view:', error);
        }
      }, 800);

      // Strategy 3: Force viewport to include the new component area (ultimate fallback)
      setTimeout(() => {
        try {
          const viewport = reactFlowInstance.getViewport();
          const currentNodes = reactFlowInstance.getNodes();
          
          // Force center on the area where the component should be
          const targetX = position.x;
          const targetY = position.y;
          
          reactFlowInstance.setCenter(targetX, targetY, { 
            zoom: 1.0,
            duration: 600 
          });
        } catch (error) {
          console.warn('Failed to force center:', error);
        }
      }, 1500);

      // Add visual indicator (red border) to help identify the new component
      setHighlightedNodeId(newComponent.id);
      setTimeout(() => {
        setHighlightedNodeId(null);
      }, 5000);

      // Enhanced toast with multiple action buttons and immediate visibility confirmation
      const componentDistance = Math.sqrt(
        Math.pow(position.x - viewportCenterX, 2) + Math.pow(position.y - viewportCenterY, 2)
      );
      
      toast.success(`✅ ${template.label} added!`, {
        description: `Position: (${Math.round(position.x)}, ${Math.round(position.y)}) - ${components.length + 1} components total - Distance from center: ${Math.round(componentDistance)}px`,
        duration: 10000,
        action: {
          label: "🎯 Focus Now",
          onClick: () => {
            console.log('🎯 Manual focus triggered for component:', newComponent.id);
            // Force immediate focus with larger zoom for better visibility
            reactFlowInstance.setCenter(position.x, position.y, { 
              zoom: 1.8, 
              duration: 500 
            });
            setHighlightedNodeId(newComponent.id);
            setTimeout(() => setHighlightedNodeId(null), 5000);
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Error in drop handler:', error);
      toast.error('Error adding component. Please check the console for more details.');
    }
  }, [reactFlowInstance, onComponentAdd, components.length]); // Include missing dependency

  // Enhanced connection handler with automatic routing
  const onConnect = useCallback((params: Connection | Edge) => {
    setIsConnecting(true);
    
    // Reduced logging - only essential information
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 New connection:', params.source, '→', params.target);
    }
    
    // Enhanced validation
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
    
    // Validate connection using helpers (if validation is enabled)
    if (enableConnectionValidation && helpers && !helpers.validateConnection(params as Connection)) {
      console.warn('❌ Invalid connection blocked by validation rules');
      setIsConnecting(false);
      return;
    }
    
    // Get components for enhanced styling and context
    const sourceComp = nodeMap.get(params.source!);
    const targetComp = nodeMap.get(params.target!);
    
    // ALWAYS calculate optimal connection points for better routing
    // If handles are null (from component drop), calculate them automatically
    let optimalHandles;
    if (params.sourceHandle === null || params.targetHandle === null) {
      optimalHandles = calculateBestConnectionPoints(
      params.source!, 
      params.target!, 
      reactFlowInstance.getNodes, 
      nodeMap
    );
    } else {
      // Use provided handles but still validate them
      optimalHandles = {
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle
      };
    }
    
    // Use calculated handles for better visual flow
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
    
    // Create enhanced edge with better styling and automatic routing
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
        routing: { sourceHandle, targetHandle }, // Store routing info
      },
      style: { 
        stroke: edgeStyle.color, 
        strokeWidth: edgeStyle.strokeWidth,
        strokeDasharray: undefined, // Remove dash for solid line
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edgeStyle.color,
        width: 20,
        height: 20,
      },
    };
    
    if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
      console.log('✅ Creating new edge with calculated handles:', newEdge);
    }
    setEdges((eds) => addEdge(newEdge, eds));
    
    // Converter de volta para o formato do sistema
    const funnelConnection: FunnelConnection = {
      id: newEdge.id,
      from: newEdge.source,
      to: newEdge.target,
      type: 'success',
      color: edgeStyle.color,
      animated: true,
      connectionData: {
        condition: newEdge.data.label, // Use condition field for the label
        dataType: `${newEdge.data.sourceComponent} → ${newEdge.data.targetComponent}`,
      }
    };
    
    console.log('✅ Adding funnel connection:', funnelConnection);
    onConnectionAdd(funnelConnection);
    
    // Removed toast notification for clean experience
    
    setIsConnecting(false);
    console.log('🔗 ===== CONNECTION COMPLETED =====');
  }, [helpers, nodeMap, onConnectionAdd, setEdges, connections, getConnectionLabel, calculateBestConnectionPoints, enableConnectionValidation]);

  // Enhanced connection end handler with component-wide connection support
  const onConnectEnd = useCallback((event: MouseEvent | TouchEvent) => {
    // Get the mouse/touch position
    const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;
    
    // Get the ReactFlow instance viewport
    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
    if (!reactFlowBounds) {
      setIsConnecting(false);
      return;
    }
    
    // Calculate position relative to ReactFlow canvas
    const position = reactFlowInstance.project({
      x: clientX - reactFlowBounds.left,
      y: clientY - reactFlowBounds.top,
    });
    
    // Find nodes that intersect with the drop position
    const intersectingNodes = reactFlowInstance.getIntersectingNodes({
      x: position.x - 50, // Small area around the cursor
      y: position.y - 50,
      width: 100,
      height: 100,
    });
    
    if (intersectingNodes.length > 0) {
      const targetNode = intersectingNodes[0];

      // Check if we have a connection in progress (from the connection state)
      const connectionInProgress = (window as any).__reactflow__connection_in_progress;
      
      if (connectionInProgress && connectionInProgress.nodeId !== targetNode.id) {
        // Create connection programmatically
        const sourceNodeId = connectionInProgress.nodeId;
        const targetNodeId = targetNode.id;
        
        console.log('🔗 Creating connection from drop:', sourceNodeId, '→', targetNodeId);
        
        // Use the existing onConnect handler
        onConnect({
          source: sourceNodeId,
          target: targetNodeId,
          sourceHandle: null, // Will be calculated automatically
          targetHandle: null, // Will be calculated automatically
        });
      }
    }
    
    setIsConnecting(false);
    console.log('🔗 Connection ended');
    
    // Clear connection state
    delete (window as any).__reactflow__connection_in_progress;
  }, [reactFlowInstance, onConnect]);

  // Enhanced connection start handler to track source node
  const onConnectStart = useCallback((event: React.MouseEvent | React.TouchEvent, { nodeId, handleId, handleType }: { nodeId: string; handleId: string | null; handleType: string }) => {
    setIsConnecting(true);
    
    // Store connection state globally for access in onConnectEnd
    (window as any).__reactflow__connection_in_progress = {
      nodeId,
      handleId,
      handleType,
      startTime: Date.now()
    };
    
    console.log('🔗 Connection started from node:', nodeId, 'handle:', handleId);
  }, []);

  // Add ESC key handler to cancel connections
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isConnecting) {
        setIsConnecting(false);
        console.log('🔗 Connection cancelled with ESC');
        // Removed toast notification for clean experience
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isConnecting]);

  // Enhanced delete handlers
  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    deletedNodes.forEach(node => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🗑️ Deleting node:', node.id);
      }
      onComponentDelete(node.id);
    });
  }, [onComponentDelete]);

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    deletedEdges.forEach(edge => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🗑️ Deleting edge:', edge.id);
      }
      onConnectionDelete(edge.id);
    });
  }, [onConnectionDelete]);

  // Enhanced node update handler
  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
      console.log('📍 Node moved:', node.id, node.position);
    }
    onComponentUpdate(node.id, { position: node.position });
    
    // FORCE update of all edges that connect to this node to use optimal handles
    setEdges((currentEdges) => {
      const updatedEdges = currentEdges.map((edge) => {
        // Check if this edge involves the moved node
        if (edge.source === node.id || edge.target === node.id) {
          if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
            console.log(`🔄 Updating edge handles for moved node: ${edge.id}`);
          }
          
          // Recalculate optimal handles for this connection
          const optimalHandles = calculateBestConnectionPoints(
            edge.source, 
            edge.target, 
            reactFlowInstance.getNodes, 
            nodeMap
          );
          
          if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
            console.log(`🧭 New handles for edge ${edge.id}:`, optimalHandles);
          }
          
          return {
            ...edge,
            sourceHandle: optimalHandles.sourceHandle,
            targetHandle: optimalHandles.targetHandle,
          };
        }
        return edge;
      });
      
      if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
        console.log('✅ Updated edges after node move:', updatedEdges);
      }
      return updatedEdges;
    });
  }, [onComponentUpdate, calculateBestConnectionPoints, setEdges]);

  // Enhanced drag tracking for debugging - DISABLED for cleaner console
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
      const handleGlobalDragStart = (e: DragEvent) => {
        console.log('🌍 Global dragstart:', e.target, e.dataTransfer?.types);
      };
      
      const handleGlobalDrag = (e: DragEvent) => {
        // Only log occasionally to avoid spam
        if (Math.random() < 0.01) {
          console.log('🌍 Global drag:', e.clientX, e.clientY);
        }
      };
      
      const handleGlobalDragEnd = (e: DragEvent) => {
        console.log('🌍 Global dragend:', e.target, 'Effect:', e.dataTransfer?.dropEffect);
        setIsDragOver(false); // Reset drag state
      };
      
      const handleGlobalDrop = (e: DragEvent) => {
        console.log('🌍 Global drop:', e.target, 'Data available:', !!e.dataTransfer?.getData('application/json'));
      };
      
      document.addEventListener('dragstart', handleGlobalDragStart);
      document.addEventListener('drag', handleGlobalDrag);
      document.addEventListener('dragend', handleGlobalDragEnd);
      document.addEventListener('drop', handleGlobalDrop);
      
      return () => {
        document.removeEventListener('dragstart', handleGlobalDragStart);
        document.removeEventListener('drag', handleGlobalDrag);
        document.removeEventListener('dragend', handleGlobalDragEnd);
        document.removeEventListener('drop', handleGlobalDrop);
      };
    }
  }, []);

  // Enhanced edge click handler with context menu for deletion
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: ReactFlowEdge) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Edge clicked:', edge.id, 'Label:', edge.data?.label);
    }
    
    // Get mouse coordinates relative to the viewport
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Show context menu at click position
    setEdgeContextMenu({
      visible: true,
      edge: edge,
      x: event.clientX, // Use global coordinates for proper positioning
      y: event.clientY,
    });
    
    if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
      console.log('🔗 Context menu opened for edge:', edge.id, 'at position:', { x: event.clientX, y: event.clientY });
    }
  }, []);

  // Handler to delete an edge
  const handleDeleteEdge = useCallback((edge: ReactFlowEdge) => {
    console.log('🗑️ Deleting edge:', edge.id);
    
    // Find the corresponding connection in the funnel data
    const connection = connections.find(conn => conn.id === edge.id);
    
    if (connection) {
      const sourceComp = nodeMap.get(edge.source);
      const targetComp = nodeMap.get(edge.target);
      
      console.log('✅ Deleting connection:', connection.id, 'from funnel data');
      onConnectionDelete(connection.id);
      
      // Also remove from ReactFlow edges
      setEdges((edges) => edges.filter((e) => e.id !== edge.id));
      
      // Close context menu
      setEdgeContextMenu({ visible: false, edge: null, x: 0, y: 0 });
      
      // Removed toast notification for clean experience
      
      console.log('✅ Edge deleted successfully:', edge.id);
    } else {
      console.warn('❌ Connection not found for edge:', edge.id);
      // Removed toast notification for clean experience
    }
  }, [connections, nodeMap, onConnectionDelete, setEdges]);

  // Close context menu when clicking outside
  const handleCanvasClick = useCallback(() => {
    if (edgeContextMenu.visible) {
      setEdgeContextMenu({ visible: false, edge: null, x: 0, y: 0 });
    }
  }, [edgeContextMenu.visible]);

  // Close context menu with ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && edgeContextMenu.visible) {
        setEdgeContextMenu({ visible: false, edge: null, x: 0, y: 0 });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [edgeContextMenu.visible]);

  // Enhanced node click handler to support edge connections
  const onNodeClick = useCallback((event: React.MouseEvent, node: ReactFlowNode) => {
    event.stopPropagation();
    if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
      console.log('🎯 Node clicked:', node.id);
    }
    
    // Check if we're in edge connection mode
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
        // Create a connection from the node to the target of the existing edge
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
        
        // Removed toast notification for clean experience
        
        // Disable edge connection mode
        globalWindow.__edgeConnectionMode = { enabled: false };
      }
    }
  }, [nodeMap, onConnectionAdd]);

  return (
    <div 
      className={`canvas-container w-full h-full transition-all duration-200 ${isDragOver ? 'bg-blue-950/20' : ''} relative`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      {/* Enhanced drag over indicator */}
      {isDragOver && (
        <div className="absolute inset-4 border-2 border-dashed border-blue-500 rounded-lg bg-blue-500/5 pointer-events-none z-10 flex items-center justify-center">
          <div className="text-blue-400 text-lg font-medium">
            📦 Drop the component here!
          </div>
        </div>
      )}
      
      {/* Connection indicator - REMOVED */}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ 
          stroke: '#3B82F6', 
          strokeWidth: 4,
          strokeDasharray: '5,5',
          opacity: 0.8,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode="Shift"
        selectionOnDrag={true}
        panOnDrag={[1, 2]} // Allow panning with left and middle mouse buttons
        selectNodesOnDrag={false}
        fitView
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false,
        }}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        onPaneClick={handleCanvasClick}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color="#374151"
          className="opacity-50"
        />
        
        <Controls 
          className="!bg-gray-800 !border-gray-600 !hidden"
          showZoom={false}
          showFitView={false}
          showInteractive={false}
          position="bottom-left"
        />
        
        <MiniMap 
          className="!bg-gray-800 !border-gray-600"
          nodeColor={(node) => {
            const template = nodeMap.get(node.id);
            if (template) {
              const templateMap: Record<string, string> = {
                'landing-page': '#3B82F6',
                'sales-page': '#DC2626',
                'quiz': '#8B5CF6',
                'form': '#10B981',
                'email-sequence': '#F59E0B',
                'checkout': '#EF4444',
                'default': '#6B7280'
              };
              return templateMap[template.type] || templateMap.default;
            }
            return '#6B7280';
          }}
          nodeStrokeWidth={2}
          pannable={true}
          zoomable={true}
          position="bottom-right"
        />

        {/* Connection instructions overlay - REMOVED */}
        
        {/* Enhanced connection success message */}
        {connections.length > 0 && (
          <div className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-lg text-sm border border-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{connections.length} active connection{connections.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </ReactFlow>

      {/* Edge Context Menu */}
      {edgeContextMenu.visible && edgeContextMenu.edge && (
        <div 
          className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 py-2 min-w-48"
          style={{
            left: edgeContextMenu.x,
            top: edgeContextMenu.y,
            transform: 'translate(-50%, -100%)', // Position menu above the click point
          }}
        >
          {/* Menu Header */}
          <div className="px-4 py-2 border-b border-gray-700">
            <div className="text-white text-sm font-medium">
              Connection: {edgeContextMenu.edge.data?.label || 'Lead'}
            </div>
            <div className="text-gray-400 text-xs">
              {nodeMap.get(edgeContextMenu.edge.source)?.data.title} → {nodeMap.get(edgeContextMenu.edge.target)?.data.title}
            </div>
          </div>
          
          {/* Menu Options */}
          <div className="py-1">
            <button
              onClick={() => handleDeleteEdge(edgeContextMenu.edge!)}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors flex items-center gap-2 text-sm"
            >
              <span>🗑️</span>
              <span>Delete Connection</span>
            </button>
            
            <button
              onClick={() => setEdgeContextMenu({ visible: false, edge: null, x: 0, y: 0 })}
              className="w-full text-left px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <span>❌</span>
              <span>Cancel</span>
            </button>
          </div>
          
          {/* Instructions */}
          <div className="px-4 py-2 border-t border-gray-700">
            <div className="text-gray-500 text-xs">
              💡 Tip: Press ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Wrapper com Provider
export const ReactFlowCanvasWrapper: React.FC<ReactFlowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <ReactFlowCanvas {...props} />
    </ReactFlowProvider>
  );
};

export default ReactFlowCanvasWrapper; 