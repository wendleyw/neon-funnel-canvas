import React, { useCallback, useMemo, useState, useEffect } from 'react';
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

import { FunnelComponent, Connection as FunnelConnection, ComponentTemplate } from '../../../types/funnel';
import { 
  ReactFlowNode, 
  ReactFlowEdge, 
  convertFunnelComponentToNode, 
  convertConnectionToEdge
} from '../../../types/reactflow';
import CustomNode from './ReactFlow/CustomNode';
import { FunnelComponentNode } from './ReactFlow/FunnelComponentNode';
import { AnimatedNodeEdge } from './ReactFlow/AnimatedNodeEdge';
import { AnimatedSVGEdge } from './ReactFlow/AnimatedSVGEdge';
import { useTaskManager } from '@/features/shared/hooks/useTaskManager';

// Task-based interface
interface TaskBasedReactFlowCanvasProps {
  components: FunnelComponent[];
  connections: FunnelConnection[];
  onComponentAdd: (component: FunnelComponent) => void;
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onComponentDelete: (id: string) => void;
  onConnectionAdd: (connection: FunnelConnection) => void;
  onConnectionDelete: (connectionId: string) => void;
  enableConnectionValidation?: boolean;
  workspaceId?: string;
  projectId?: string;
  userId?: string;
}

// Wrapper component to add debug to CustomNode
const DebugCustomNode: React.FC<NodeProps> = (props) => {
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

const TaskBasedReactFlowCanvas: React.FC<TaskBasedReactFlowCanvasProps> = ({
  components,
  connections,
  onComponentAdd,
  onComponentUpdate,
  onComponentDelete,
  onConnectionAdd,
  onConnectionDelete,
  enableConnectionValidation = true,
  workspaceId,
  projectId,
  userId
}) => {
  
  // Initialize task manager with context
  const { executeTask, isExecuting, getTaskStats } = useTaskManager({
    userId,
    workspaceId,
    projectId
  });
  
  const reactFlowInstance = useReactFlow();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  
  // Create a map for quick node lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, FunnelComponent>();
    components.forEach(comp => map.set(comp.id, comp));
    return map;
  }, [components]);

  // Converter dados do funnel para React Flow usando task system
  const initialNodes: ReactFlowNode[] = useMemo(() => {
    const nodes = components.map((component) => {
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
  
  const initialEdges: ReactFlowEdge[] = useMemo(() => {
    return connections.map(connection => {
      const edge = convertConnectionToEdge(connection);
      
      return {
        ...edge,
        type: 'animatedNode' as const,
        animated: true,
        style: { 
          stroke: connection.color || '#10B981', 
          strokeWidth: 2,
          strokeDasharray: undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: connection.color || '#10B981',
          width: 20,
          height: 20,
        },
      };
    });
  }, [connections]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // TASK-BASED: Handle drag and drop with task system
  const onDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    try {
      const templateData = event.dataTransfer.getData('application/json');
      
      if (!templateData) {
        await executeTask('ui.show-toast', {
          type: 'error' as const,
          message: 'Error: No component found in drag.',
          description: 'Please ensure you are dragging from an item in the sidebar.'
        });
        return;
      }
      
      const template: ComponentTemplate = JSON.parse(templateData);

      // TASK-BASED: Process drag and drop
      const viewport = reactFlowInstance.getViewport();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      
      const dropResult = await executeTask('canvas.process-drag-drop', {
        templateData,
        dropPosition: { x: event.clientX, y: event.clientY },
        viewportInfo: {
          zoom: viewport.zoom,
          x: viewport.x,
          y: viewport.y,
          bounds: reactFlowBounds
        }
      });

      if (!dropResult.success || !dropResult.data?.shouldCreateComponent) {
        await executeTask('ui.show-toast', {
          type: 'error' as const,
          message: 'Invalid template',
          description: 'Missing required fields in template'
        });
        return;
      }

      // TASK-BASED: Create component
      const createResult = await executeTask('component.create', {
        template,
        position: dropResult.data.dropPosition,
        workspaceId: workspaceId || 'default',
        projectId: projectId || 'default'
      });

      if (createResult.success && createResult.data) {
        onComponentAdd(createResult.data);
        
        // TASK-BASED: Center on new component
        await executeTask('canvas.center-on-node', {
          nodeId: createResult.data.id,
          zoomLevel: 1.2,
          duration: 800
        });

        // TASK-BASED: Highlight component
        const highlightResult = await executeTask('canvas.highlight-node', {
          nodeId: createResult.data.id,
          duration: 5000,
          highlightColor: '#EF4444'
        });
        
        if (highlightResult.success) {
          setHighlightedNodeId(createResult.data.id);
          setTimeout(() => setHighlightedNodeId(null), highlightResult.data?.duration || 5000);
        }

        // TASK-BASED: Show success toast
        await executeTask('ui.show-toast', {
          type: 'success' as const,
          message: `✅ ${template.label} added!`,
          description: `Component created at position (${Math.round(dropResult.data.dropPosition.x)}, ${Math.round(dropResult.data.dropPosition.y)})`
        });

        // TASK-BASED: Broadcast real-time update
        if (workspaceId && projectId) {
          await executeTask('realtime.broadcast', {
            eventType: 'component-added' as const,
            data: createResult.data,
            projectId
          });
        }
      }
      
    } catch (error) {
      console.error('❌ Error in drop handler:', error);
      await executeTask('ui.show-toast', {
        type: 'error' as const,
        message: 'Error adding component',
        description: 'Please check the console for more details.'
      });
    }
  }, [reactFlowInstance, components, onComponentAdd, workspaceId, projectId, executeTask]);

  // TASK-BASED: Enhanced connection handler
  const onConnect = useCallback(async (params: Connection | Edge) => {
    setIsConnecting(true);
    
    try {
      if (!params.source || !params.target) {
        // Removed toast notification for clean experience
        setIsConnecting(false);
        return;
      }

      if (params.source === params.target) {
        // Removed toast notification for clean experience
        setIsConnecting(false);
        return;
      }

      // TASK-BASED: Validate connection
      if (enableConnectionValidation) {
        const validationResult = await executeTask('connection.validate', {
          sourceComponentId: params.source,
          targetComponentId: params.target
        });

        if (!validationResult.success || !validationResult.data?.isValid) {
          // Removed toast notification for clean experience
          setIsConnecting(false);
          return;
        }
      }

      // TASK-BASED: Calculate optimal connection handles
      const sourceComp = nodeMap.get(params.source);
      const targetComp = nodeMap.get(params.target);
      
      const sourcePosition = sourceComp?.position || { x: 0, y: 0 };
      const targetPosition = targetComp?.position || { x: 0, y: 0 };

      const handlesResult = await executeTask('connection.recalculate-handles', {
        connectionId: `temp-${Date.now()}`,
        sourcePosition,
        targetPosition
      });

      // TASK-BASED: Create connection
      const createConnectionResult = await executeTask('connection.create', {
        sourceComponentId: params.source,
        targetComponentId: params.target,
        connectionType: 'success',
        connectionData: {
          condition: 'Lead',
          dataType: 'standard'
        }
      });

      if (createConnectionResult.success && createConnectionResult.data) {
        // Create ReactFlow edge
        const newEdge = {
          id: createConnectionResult.data.id,
          source: params.source,
          target: params.target,
          sourceHandle: handlesResult.data?.sourceHandle || 'right-source',
          targetHandle: handlesResult.data?.targetHandle || 'left-target',
          type: 'animatedNode' as const,
          animated: true,
          style: { 
            stroke: createConnectionResult.data.color, 
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: createConnectionResult.data.color,
            width: 20,
            height: 20,
          },
        };
        
        setEdges((eds) => addEdge(newEdge, eds));
        onConnectionAdd(createConnectionResult.data);

        // Removed toast notification for clean experience

        // TASK-BASED: Broadcast real-time update
        if (workspaceId && projectId) {
          await executeTask('realtime.broadcast', {
            eventType: 'connection-added' as const,
            data: createConnectionResult.data,
            projectId
          });
        }

        if (createConnectionResult.data.id === 'initial-task' || createConnectionResult.data.id === 'intuitive-task') {
          toast.success('🔗 Connection Created', {
            description: `From ${sourceComp?.data?.label} to ${targetComp?.data?.label}`,
          });
        } else {
          toast.success('🔗 Connection Created', {
            description: `From ${sourceComp?.data?.label} to ${targetComp?.data?.label}`,
          });
        }
      }
    } catch (error) {
      console.error('❌ Error in connection handler:', error);
      // Removed toast notification for clean experience
    }
    
    setIsConnecting(false);
  }, [executeTask, enableConnectionValidation, nodeMap, setEdges, onConnectionAdd, workspaceId, projectId]);

  // TASK-BASED: Enhanced node update handler
  const onNodeDragStop = useCallback(async (event: React.MouseEvent, node: Node) => {
    try {
      // TASK-BASED: Move component
      await executeTask('component.move', {
        componentId: node.id,
        newPosition: node.position
      });

      // Update the funnel component
      onComponentUpdate(node.id, { position: node.position });

      // TASK-BASED: Recalculate handles for all connected edges
      const connectedEdges = edges.filter(edge => 
        edge.source === node.id || edge.target === node.id
      );

      for (const edge of connectedEdges) {
        const sourceComp = nodeMap.get(edge.source);
        const targetComp = nodeMap.get(edge.target);
        
        if (sourceComp && targetComp) {
          const handlesResult = await executeTask('connection.recalculate-handles', {
            connectionId: edge.id,
            sourcePosition: sourceComp.position,
            targetPosition: targetComp.position
          });

          if (handlesResult.success && handlesResult.data) {
            setEdges((currentEdges) => 
              currentEdges.map((e) => 
                e.id === edge.id 
                  ? {
                      ...e,
                      sourceHandle: handlesResult.data!.sourceHandle,
                      targetHandle: handlesResult.data!.targetHandle,
                    }
                  : e
              )
            );
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in node drag stop:', error);
    }
  }, [executeTask, onComponentUpdate, edges, nodeMap, setEdges]);

  // Enhanced delete handlers using tasks
  const onNodesDelete = useCallback(async (deletedNodes: Node[]) => {
    for (const node of deletedNodes) {
      try {
        // TASK-BASED: Delete component
        const deleteResult = await executeTask('component.delete', {
          componentId: node.id
        });

        if (deleteResult.success) {
          onComponentDelete(node.id);
          
          // Removed toast notification for clean experience

          // TASK-BASED: Broadcast real-time update
          if (workspaceId && projectId) {
            await executeTask('realtime.broadcast', {
              eventType: 'component-deleted' as const,
              data: { componentId: node.id },
              projectId
            });
          }
        }
      } catch (error) {
        console.error('❌ Error deleting component:', error);
      }
    }
  }, [executeTask, onComponentDelete, workspaceId, projectId]);

  const onEdgesDelete = useCallback(async (deletedEdges: Edge[]) => {
    for (const edge of deletedEdges) {
      try {
        // TASK-BASED: Delete connection
        const deleteResult = await executeTask('connection.delete', {
          connectionId: edge.id
        });

        if (deleteResult.success) {
          onConnectionDelete(edge.id);
          
          // TASK-BASED: Show success toast
          await executeTask('ui.show-toast', {
            type: 'success' as const,
            message: '🗑️ Connection deleted',
            description: 'The connection was removed'
          });

          // TASK-BASED: Broadcast real-time update
          if (workspaceId && projectId) {
            await executeTask('realtime.broadcast', {
              eventType: 'connection-deleted' as const,
              data: { connectionId: edge.id },
              projectId
            });
          }
        }
      } catch (error) {
        console.error('❌ Error deleting edge:', error);
      }
    }
  }, [executeTask, onConnectionDelete, workspaceId, projectId]);

  // Drag over handlers (simplified)
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  // Connection start/end handlers
  const onConnectStart = useCallback(() => {
    setIsConnecting(true);
  }, []);

  const onConnectEnd = useCallback(() => {
    setIsConnecting(false);
  }, []);

  // Log task stats for debugging
  useEffect(() => {
    const stats = getTaskStats();
    console.log('📊 Canvas Task Stats:', stats);
  }, [getTaskStats]);

  return (
    <div 
      className={`w-full h-full transition-all duration-200 ${isDragOver ? 'bg-blue-950/20' : ''} relative`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      {/* Enhanced drag over indicator */}
      {isDragOver && (
        <div className="absolute inset-4 border-2 border-dashed border-blue-500 rounded-lg bg-blue-500/5 pointer-events-none z-10 flex items-center justify-center">
          <div className="text-blue-400 text-lg font-medium">
            📦 Drop component here!
          </div>
        </div>
      )}
      
      {/* Connection indicator */}
      {isConnecting && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-20 border border-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Connecting components...</span>
          </div>
        </div>
      )}

      {/* Task execution indicator */}
      {isExecuting && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-orange-800 text-white px-4 py-2 rounded-lg shadow-lg z-20 border border-orange-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Executing task...</span>
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
        panOnDrag={[1, 2]}
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
            <h3 className="font-semibold mb-3 text-center text-blue-400">🔗 Creating Connection</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Blue points = Input (Target) - drop here</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Green points = Output (Source) - drag from here</span>
              </div>
              <div className="text-center mt-3 pt-3 border-t border-gray-600">
                <span className="text-yellow-400">💡 Task system active</span>
              </div>
              <div className="text-center text-xs text-gray-400">
                ESC to cancel
              </div>
            </div>
          </div>
        )}
        
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
    </div>
  );
};

// Wrapper com Provider
export const TaskBasedReactFlowCanvasWrapper: React.FC<TaskBasedReactFlowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <TaskBasedReactFlowCanvas {...props} />
    </ReactFlowProvider>
  );
};

export default TaskBasedReactFlowCanvasWrapper;
