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

import { FunnelComponent, Connection as FunnelConnection, ComponentTemplate } from '../types/funnel';
import { 
  ReactFlowNode, 
  ReactFlowEdge, 
  convertFunnelComponentToNode, 
  convertConnectionToEdge,
  convertNodeToFunnelComponent,
  convertEdgeToConnection 
} from '../types/reactflow';
import CustomNode from './ReactFlow/CustomNode';
import { FunnelComponentNode } from './ReactFlow/FunnelComponentNode';
import { AnimatedNodeEdge } from './ReactFlow/AnimatedNodeEdge';
import { AnimatedSVGEdge } from './ReactFlow/AnimatedSVGEdge';
import { useReactFlowHelpers } from '../hooks/useReactFlowHelpers';

interface ReactFlowCanvasProps {
  components: FunnelComponent[];
  connections: FunnelConnection[];
  onComponentAdd: (component: FunnelComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
  onConnectionAdd: (connection: FunnelConnection) => void;
  onConnectionDelete: (connectionId: string) => void;
  onConnectionUpdate?: (connectionId: string, updates: Partial<FunnelConnection>) => void;
}

// Connection validation helper
const isValidConnection = (connection: Connection, nodeMap: Map<string, FunnelComponent>) => {
  if (!connection.source || !connection.target) return false;
  
  const sourceNode = nodeMap.get(connection.source);
  const targetNode = nodeMap.get(connection.target);
  
  if (!sourceNode || !targetNode) return false;
  
  // Prevent self-connections
  if (connection.source === connection.target) return false;
  
  // Define connection rules based on component types
  const connectionRules: Record<string, { canConnectTo: string[] }> = {
    'landing-page': { canConnectTo: ['quiz', 'form', 'email-sequence', 'webinar-live', 'opt-in-page', 'sales-page'] },
    'quiz': { canConnectTo: ['sales-page', 'opt-in-page', 'email-sequence', 'thank-you-page'] },
    'form': { canConnectTo: ['thank-you-page', 'email-sequence', 'sales-page'] },
    'email-sequence': { canConnectTo: ['sales-page', 'webinar-live', 'landing-page', 'checkout'] },
    'sales-page': { canConnectTo: ['checkout', 'thank-you-page'] },
    'checkout': { canConnectTo: ['thank-you-page'] },
    'webinar-live': { canConnectTo: ['sales-page', 'opt-in-page', 'checkout'] },
    'webinar-replay': { canConnectTo: ['sales-page', 'opt-in-page', 'checkout'] },
    'opt-in-page': { canConnectTo: ['form', 'email-sequence', 'download-page', 'thank-you-page'] },
    'download-page': { canConnectTo: ['thank-you-page'] },
    'calendar-page': { canConnectTo: ['thank-you-page', 'sales-page'] }
  };
  
  const sourceRules = connectionRules[sourceNode.type];
  if (sourceRules && !sourceRules.canConnectTo.includes(targetNode.type)) {
    console.warn(`❌ Invalid connection: ${sourceNode.type} cannot connect to ${targetNode.type}`);
    return false;
  }
  
  return true;
};

// Enhanced edge styles based on connection type
const getEdgeStyle = (sourceType: string, targetType: string) => {
  // Define different edge styles based on component types
  const edgeStyles: Record<string, { color: string; strokeWidth: number; type: string }> = {
    'default': { color: '#10B981', strokeWidth: 2, type: 'smoothstep' },
    'conversion': { color: '#EF4444', strokeWidth: 3, type: 'smoothstep' }, // Sales flow
    'nurturing': { color: '#F59E0B', strokeWidth: 2, type: 'step' }, // Email sequences
    'capture': { color: '#8B5CF6', strokeWidth: 2, type: 'smoothstep' }, // Lead capture
    'completion': { color: '#10B981', strokeWidth: 2, type: 'straight' } // Final steps
  };
  
  // Determine edge type based on connection
  let edgeType = 'default';
  if (sourceType.includes('sales') || targetType.includes('checkout')) {
    edgeType = 'conversion';
  } else if (sourceType.includes('email') || targetType.includes('email')) {
    edgeType = 'nurturing';
  } else if (sourceType.includes('opt-in') || sourceType.includes('form')) {
    edgeType = 'capture';
  } else if (targetType.includes('thank-you')) {
    edgeType = 'completion';
  }
  
  return edgeStyles[edgeType];
};

// Wrapper component to add debug to CustomNode
const DebugCustomNode: React.FC<any> = (props) => {
  return React.createElement(CustomNode, props);
};

// Define os tipos de nó e edge customizados fora do componente para evitar recriação
const nodeTypes: NodeTypes = {
  custom: DebugCustomNode,
  funnelComponent: FunnelComponentNode,
};

const edgeTypes: EdgeTypes = {
  animatedNode: AnimatedNodeEdge,
  animatedSvg: AnimatedSVGEdge,
};

const ReactFlowCanvas: React.FC<ReactFlowCanvasProps> = ({
  components,
  connections,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete,
  onConnectionAdd,
  onConnectionDelete,
}) => {
  
  const reactFlowInstance = useReactFlow();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  
  // Use the enhanced helpers hook
  const helpers = useReactFlowHelpers({ 
    components, 
    connections, 
    onComponentUpdate 
  });
  
  // Create a map for quick node lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, FunnelComponent>();
    components.forEach(comp => map.set(comp.id, comp));
    return map;
  }, [components]);

  // Helper function to get connection label based on component types - MOVED HERE
  const getConnectionLabel = useCallback((sourceType?: string, targetType?: string): string => {
    if (!sourceType || !targetType) return 'Lead';
    
    const labelMap: Record<string, Record<string, string>> = {
      'landing-page': {
        'quiz': 'Visitante',
        'opt-in-page': 'Clique CTA',
        'sales-page': 'Lead Quente',
        'email-sequence': 'Subscriber'
      },
      'quiz': {
        'sales-page': 'Lead Qualificado',
        'thank-you-page': 'Quiz Completo',
        'email-sequence': 'Subscriber'
      },
      'sales-page': {
        'checkout': 'Interesse',
        'thank-you-page': 'Cliente'
      },
      'email-sequence': {
        'sales-page': 'Lead Nutrido',
        'landing-page': 'Retargeting'
      },
      'checkout': {
        'thank-you-page': 'Compra'
      }
    };
    
    return labelMap[sourceType]?.[targetType] || 'Lead';
  }, []);
  
  // Set up global connection callback
  useEffect(() => {
    (window as any).__onConnectionAdd = onConnectionAdd;
    (window as any).__onComponentDelete = onComponentDelete;
    (window as any).__onComponentUpdate = onComponentUpdate;
    return () => {
      delete (window as any).__onConnectionAdd;
      delete (window as any).__onComponentDelete;
      delete (window as any).__onComponentUpdate;
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
    }).filter(Boolean); // Remove null entries
    
    return nodes;
  }, [components, highlightedNodeId]);
  
  const initialEdges: ReactFlowEdge[] = useMemo(() => {
    const edges = connections.map(connection => {
      const edge = convertConnectionToEdge(connection);
      
      // Get source and target components for styling
      const sourceComp = nodeMap.get(connection.from);
      const targetComp = nodeMap.get(connection.to);
      
      if (sourceComp && targetComp) {
        const edgeStyle = getEdgeStyle(sourceComp.type, targetComp.type);
        return {
          ...edge,
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
          // Add better path options
          pathOptions: {
            offset: 20,
            borderRadius: 10,
          },
        };
      }
      
      return {
        ...edge,
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
        pathOptions: {
          offset: 20,
          borderRadius: 10,
        },
      };
    });
    return edges;
  }, [connections, nodeMap]);

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
  }, [initialNodes, components, setNodes]); // Watch both initialNodes and components

  // Also sync when nodes length changes
  useEffect(() => {
  }, [nodes.length]);

  // Drag & Drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
    
    // Enhanced debugging
    console.log('🔍 DragOver Debug:', {
      hasDataTransfer: !!event.dataTransfer,
      types: event.dataTransfer?.types || [],
      effectAllowed: event.dataTransfer?.effectAllowed,
      dropEffect: event.dataTransfer?.dropEffect,
      files: event.dataTransfer?.files?.length || 0
    });
  }, []);

  const onDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
    
    // Log more details
    console.log('🔍 DragEnter Debug:', {
      target: event.target,
      currentTarget: event.currentTarget,
      hasDataTransfer: !!event.dataTransfer
    });
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    console.log('🎯 onDragLeave - React Flow - ENTRY');
    
    // Better leave detection: check if we're actually leaving the target
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
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
        
        toast.error('Erro: Nenhum componente encontrado no drag. Verifique se você está arrastando de um item da sidebar.');
        return;
      }
      
      const template: ComponentTemplate = JSON.parse(templateData);

      // Verificar se o template tem todos os campos necessários
      if (!template.type || !template.label) {
        console.error('❌ Template inválido:', template);
        toast.error('Template inválido: faltam campos obrigatórios');
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
      
      toast.success(`✅ ${template.label} adicionado!`, {
        description: `Posição: (${Math.round(position.x)}, ${Math.round(position.y)}) - ${components.length + 1} componentes total - Distância do centro: ${Math.round(componentDistance)}px`,
        duration: 10000,
        action: {
          label: "🎯 Focar Agora",
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
      toast.error('Erro ao adicionar componente. Verifique o console para mais detalhes.');
    }
  }, [reactFlowInstance, onComponentAdd]);

  // Helper function to calculate the best connection points based on component positions
  const calculateBestConnectionPoints = useCallback((sourceNodeId: string, targetNodeId: string) => {
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    const targetNode = nodes.find(n => n.id === targetNodeId);
    
    if (!sourceNode || !targetNode) {
      return { sourceHandle: 'right-source', targetHandle: 'left-target' };
    }
    
    const sourcePos = sourceNode.position;
    const targetPos = targetNode.position;
    
    // Calculate relative position
    const deltaX = targetPos.x - sourcePos.x;
    const deltaY = targetPos.y - sourcePos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Calculate angle in radians
    const angle = Math.atan2(deltaY, deltaX);
    const degrees = angle * 180 / Math.PI;
    
    // Determine the best connection points based on angle
    let sourceHandle = 'right-source';
    let targetHandle = 'left-target';
    
    // Normalize angle to 0-360 degrees
    const normalizedDegrees = degrees < 0 ? degrees + 360 : degrees;
    
    if (normalizedDegrees >= 315 || normalizedDegrees < 45) {
      // Target is to the right
      sourceHandle = 'right-source';
      targetHandle = 'left-target';
    } else if (normalizedDegrees >= 45 && normalizedDegrees < 135) {
      // Target is below
      sourceHandle = 'bottom-source';
      targetHandle = 'top-target';
    } else if (normalizedDegrees >= 135 && normalizedDegrees < 225) {
      // Target is to the left
      sourceHandle = 'left-source';
      targetHandle = 'right-target';
    } else if (normalizedDegrees >= 225 && normalizedDegrees < 315) {
      // Target is above
      sourceHandle = 'top-source';
      targetHandle = 'bottom-target';
    }
    
    console.log(`🧭 Connection routing: ${sourceNodeId} → ${targetNodeId}`, {
      deltaX,
      deltaY,
      distance: Math.round(distance),
      degrees: Math.round(normalizedDegrees),
      sourceHandle,
      targetHandle
    });
    
    return { sourceHandle, targetHandle };
  }, [nodes]);

  // Enhanced connection handler with automatic routing
  const onConnect = useCallback((params: Connection | Edge) => {
    setIsConnecting(true);
    
    console.log('🔗 ===== NEW CONNECTION ATTEMPT =====');
    console.log('🔗 Connection params:', params);
    console.log('🔗 Source:', params.source);
    console.log('🔗 Target:', params.target);
    console.log('🔗 Source Handle:', params.sourceHandle);
    console.log('🔗 Target Handle:', params.targetHandle);
    
    // Enhanced validation
    if (!params.source || !params.target) {
      console.warn('❌ Invalid connection: missing source or target');
      setIsConnecting(false);
      return;
    }
    
    if (params.source === params.target) {
      console.warn('❌ Invalid connection: cannot connect to self');
      toast.error('❌ Não é possível conectar um componente a si mesmo');
      setIsConnecting(false);
      return;
    }
    
    // Check if connection already exists
    const existingConnection = connections.find(
      conn => conn.from === params.source && conn.to === params.target
    );
    
    if (existingConnection) {
      console.warn('❌ Connection already exists');
      toast.error('❌ Conexão já existe entre estes componentes');
      setIsConnecting(false);
      return;
    }
    
    // Validate connection using helpers (if available)
    if (helpers && !helpers.validateConnection(params as Connection)) {
      console.warn('❌ Invalid connection blocked by validation rules');
      toast.error('❌ Conexão inválida entre estes tipos de componente');
      setIsConnecting(false);
      return;
    }
    
    // Get components for enhanced styling and context
    const sourceComp = nodeMap.get(params.source!);
    const targetComp = nodeMap.get(params.target!);
    
    console.log('🔗 Source component:', sourceComp?.data.title, `(${sourceComp?.type})`);
    console.log('🔗 Target component:', targetComp?.data.title, `(${targetComp?.type})`);
    
    // Calculate optimal connection points only if not already specified
    let sourceHandle = params.sourceHandle;
    let targetHandle = params.targetHandle;
    
    if (!sourceHandle || !targetHandle) {
      const optimalHandles = calculateBestConnectionPoints(params.source!, params.target!);
      sourceHandle = sourceHandle || optimalHandles.sourceHandle;
      targetHandle = targetHandle || optimalHandles.targetHandle;
      console.log('🧭 Using calculated optimal handles:', { sourceHandle, targetHandle });
    } else {
      console.log('🎯 Using provided handles:', { sourceHandle, targetHandle });
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
    
    console.log('✅ Creating new edge:', newEdge);
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
    
    // Success feedback
    toast.success(`🔗 Conexão criada!`, {
      description: `${sourceComp?.data.title} → ${targetComp?.data.title}`,
      duration: 3000,
    });
    
    setIsConnecting(false);
    console.log('🔗 ===== CONNECTION COMPLETED =====');
  }, [helpers, nodeMap, onConnectionAdd, setEdges, connections, getConnectionLabel, calculateBestConnectionPoints]);

  // Connection start handler
  const onConnectStart = useCallback(() => {
    setIsConnecting(true);
    console.log('🔗 Connection started');
  }, []);

  // Connection end handler
  const onConnectEnd = useCallback(() => {
    setIsConnecting(false);
    console.log('🔗 Connection ended');
  }, []);

  // Enhanced delete handlers
  const onNodesDelete = useCallback((deletedNodes: Node[]) => {
    deletedNodes.forEach(node => {
      console.log('🗑️ Deleting node:', node.id);
      onComponentDelete(node.id);
    });
  }, [onComponentDelete]);

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    deletedEdges.forEach(edge => {
      console.log('🗑️ Deleting edge:', edge.id);
      onConnectionDelete(edge.id);
    });
  }, [onConnectionDelete]);

  // Enhanced node update handler
  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('📍 Node moved:', node.id, node.position);
    onComponentUpdate(node.id, { position: node.position });
  }, [onComponentUpdate]);

  // Enhanced drag tracking for debugging
  useEffect(() => {
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
  }, []);

  return (
    <div 
      className={`w-full h-full transition-all duration-200 ${isDragOver ? 'bg-blue-950/20' : ''} relative`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      {/* Enhanced drag over indicator */}
      {isDragOver && (
        <div className="absolute inset-4 border-2 border-dashed border-blue-500 rounded-lg bg-blue-500/5 pointer-events-none z-10 flex items-center justify-center">
          <div className="text-blue-400 text-lg font-medium">
            📦 Solte o componente aqui!
          </div>
        </div>
      )}
      
      {/* Connection indicator */}
      {isConnecting && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-20 border border-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Conectando componentes...</span>
          </div>
        </div>
      )}

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

        {/* Connection instructions overlay */}
        {isConnecting && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-lg z-30 border border-gray-600 max-w-md">
            <h3 className="font-semibold mb-3 text-center text-blue-400">🔗 Criando Conexão</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Pontos azuis = Entrada (Target)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Pontos verdes = Saída (Source)</span>
              </div>
              <div className="text-center mt-3 pt-3 border-t border-gray-600">
                <span className="text-gray-400">Arraste do verde para o azul</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced connection success message */}
        {connections.length > 0 && (
          <div className="absolute bottom-4 left-4 bg-gray-800 text-white p-3 rounded-lg text-sm border border-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{connections.length} conexão{connections.length !== 1 ? 'ões' : ''} ativa{connections.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </ReactFlow>
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