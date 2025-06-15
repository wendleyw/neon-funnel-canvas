import { useCallback, useMemo } from 'react';
import { Node, Edge, Connection, useReactFlow } from 'reactflow';
import { FunnelComponent, Connection as FunnelConnection } from '../../../types/funnel';

interface UseReactFlowHelpersProps {
  components: FunnelComponent[];
  connections: FunnelConnection[];
  onComponentUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
}

interface GroupingOptions {
  groupId: string;
  groupLabel: string;
  backgroundColor?: string;
  borderColor?: string;
}

export const useReactFlowHelpers = ({ components, connections, onComponentUpdate }: UseReactFlowHelpersProps) => {
  const reactFlowInstance = useReactFlow();

  // Create a map for quick node lookup
  const nodeMap = useMemo(() => {
    const map = new Map<string, FunnelComponent>();
    components.forEach(comp => map.set(comp.id, comp));
    return map;
  }, [components]);

  // Connection validation with enhanced rules
  const validateConnection = useCallback((connection: Connection): boolean => {
    if (!connection.source || !connection.target) return false;
    
    const sourceNode = nodeMap.get(connection.source);
    const targetNode = nodeMap.get(connection.target);
    
    if (!sourceNode || !targetNode) return false;
    
    // Prevent self-connections
    if (connection.source === connection.target) return false;
    
    // Check for existing connections to prevent duplicates
    const existingConnection = connections.find(conn => 
      conn.from === connection.source && conn.to === connection.target
    );
    
    if (existingConnection) {
      console.warn('Connection already exists between these components');
      return false;
    }
    
    // Advanced connection rules based on marketing funnel logic
    const connectionRules: Record<string, { 
      maxOutputs?: number; 
      maxInputs?: number; 
      canConnectTo: string[];
      preventConnectionTo?: string[];
    }> = {
      'landing-page': { 
        maxOutputs: 3,
        canConnectTo: ['quiz', 'form', 'email-sequence', 'webinar-live', 'opt-in-page', 'sales-page'] 
      },
      'quiz': { 
        maxInputs: 2,
        maxOutputs: 2,
        canConnectTo: ['sales-page', 'opt-in-page', 'email-sequence', 'thank-you-page'] 
      },
      'form': { 
        maxInputs: 3,
        maxOutputs: 2,
        canConnectTo: ['thank-you-page', 'email-sequence', 'sales-page'] 
      },
      'email-sequence': { 
        maxInputs: 5,
        maxOutputs: 3,
        canConnectTo: ['sales-page', 'webinar-live', 'landing-page', 'checkout'] 
      },
      'sales-page': { 
        maxInputs: 3,
        maxOutputs: 2,
        canConnectTo: ['checkout', 'thank-you-page'],
        preventConnectionTo: ['landing-page'] // Sales pages shouldn't connect back to landing
      },
      'checkout': { 
        maxInputs: 2,
        maxOutputs: 1,
        canConnectTo: ['thank-you-page'] 
      },
      'thank-you-page': { 
        maxInputs: 5,
        maxOutputs: 0, // Final destination
        canConnectTo: [] 
      },
      'webinar-live': { 
        maxOutputs: 2,
        canConnectTo: ['sales-page', 'opt-in-page', 'checkout'] 
      },
      'opt-in-page': { 
        maxOutputs: 3,
        canConnectTo: ['form', 'email-sequence', 'download-page', 'thank-you-page'] 
      }
    };
    
    const sourceRules = connectionRules[sourceNode.type];
    if (sourceRules) {
      // Check if connection is explicitly prevented
      if (sourceRules.preventConnectionTo?.includes(targetNode.type)) {
        console.warn(`❌ Prevented connection: ${sourceNode.type} should not connect to ${targetNode.type}`);
        return false;
      }
      
      // Check if target type is allowed
      if (!sourceRules.canConnectTo.includes(targetNode.type)) {
        console.warn(`❌ Invalid connection: ${sourceNode.type} cannot connect to ${targetNode.type}`);
        return false;
      }
      
      // Check output limits
      if (sourceRules.maxOutputs) {
        const currentOutputs = connections.filter(conn => conn.from === sourceNode.id).length;
        if (currentOutputs >= sourceRules.maxOutputs) {
          console.warn(`❌ Output limit reached: ${sourceNode.type} can only have ${sourceRules.maxOutputs} outputs`);
          return false;
        }
      }
    }
    
    const targetRules = connectionRules[targetNode.type];
    if (targetRules?.maxInputs) {
      const currentInputs = connections.filter(conn => conn.to === targetNode.id).length;
      if (currentInputs >= targetRules.maxInputs) {
        console.warn(`❌ Input limit reached: ${targetNode.type} can only have ${targetRules.maxInputs} inputs`);
        return false;
      }
    }
    
    return true;
  }, [nodeMap, connections]);

  // Auto-layout functionality
  const autoLayoutNodes = useCallback((layoutType: 'horizontal' | 'vertical' | 'radial' = 'horizontal') => {
    if (!reactFlowInstance) return;
    
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    
    // Simple auto-layout logic
    let layoutedNodes: Node[] = [];
    
    switch (layoutType) {
      case 'horizontal':
        layoutedNodes = nodes.map((node, index) => ({
          ...node,
          position: { x: index * 300, y: 100 }
        }));
        break;
      
      case 'vertical':
        layoutedNodes = nodes.map((node, index) => ({
          ...node,
          position: { x: 100, y: index * 200 }
        }));
        break;
        
      case 'radial':
        const centerX = 400;
        const centerY = 300;
        const radius = 200;
        layoutedNodes = nodes.map((node, index) => {
          const angle = (index / nodes.length) * 2 * Math.PI;
          return {
            ...node,
            position: {
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle)
            }
          };
        });
        break;
    }
    
    reactFlowInstance.setNodes(layoutedNodes);
    
    // Update component positions
    layoutedNodes.forEach(node => {
      onComponentUpdate(node.id, { position: node.position });
    });
    
    // Fit view after layout
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.1 });
    }, 100);
  }, [reactFlowInstance, onComponentUpdate]);

  // Group selection functionality
  const groupSelectedNodes = useCallback((options: GroupingOptions) => {
    if (!reactFlowInstance) return;
    
    const selectedNodes = reactFlowInstance.getNodes().filter(node => node.selected);
    
    if (selectedNodes.length < 2) {
      console.warn('Select at least 2 nodes to create a group');
      return;
    }
    
    // Calculate group bounds
    const bounds = selectedNodes.reduce((acc, node) => {
      const nodeWidth = node.width || 256;
      const nodeHeight = node.height || 180;
      return {
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + nodeWidth),
        maxY: Math.max(acc.maxY, node.position.y + nodeHeight)
      };
    }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
    
    // Create group node
    const groupNode: Node = {
      id: options.groupId,
      type: 'group',
      position: { x: bounds.minX - 20, y: bounds.minY - 40 },
      data: { 
        label: options.groupLabel,
        backgroundColor: options.backgroundColor || '#1F2937',
        borderColor: options.borderColor || '#374151'
      },
      style: {
        width: bounds.maxX - bounds.minX + 40,
        height: bounds.maxY - bounds.minY + 60,
        backgroundColor: options.backgroundColor || '#1F293780',
        border: `2px solid ${options.borderColor || '#374151'}`,
        borderRadius: '8px',
        zIndex: -1
      }
    };
    
    // Update selected nodes to be part of the group
    const updatedNodes = selectedNodes.map(node => ({
      ...node,
      parentNode: options.groupId,
      extent: 'parent' as const,
      position: {
        x: node.position.x - bounds.minX + 20,
        y: node.position.y - bounds.minY + 40
      }
    }));
    
    const allNodes = reactFlowInstance.getNodes();
    const newNodes = [
      ...allNodes.filter(node => !selectedNodes.find(selected => selected.id === node.id)),
      groupNode,
      ...updatedNodes
    ];
    
    reactFlowInstance.setNodes(newNodes);
    
    console.log(`✅ Created group "${options.groupLabel}" with ${selectedNodes.length} components`);
  }, [reactFlowInstance]);

  // Ungroup functionality
  const ungroupNodes = useCallback((groupId: string) => {
    if (!reactFlowInstance) return;
    
    const nodes = reactFlowInstance.getNodes();
    const groupNode = nodes.find(node => node.id === groupId);
    const childNodes = nodes.filter(node => node.parentNode === groupId);
    
    if (!groupNode || childNodes.length === 0) return;
    
    // Update child nodes to remove parent relationship
    const updatedChildNodes = childNodes.map(node => ({
      ...node,
      parentNode: undefined,
      extent: undefined,
      position: {
        x: node.position.x + groupNode.position.x,
        y: node.position.y + groupNode.position.y
      }
    }));
    
    // Remove group node and update children
    const newNodes = [
      ...nodes.filter(node => node.id !== groupId && !childNodes.find(child => child.id === node.id)),
      ...updatedChildNodes
    ];
    
    reactFlowInstance.setNodes(newNodes);
    
    console.log(`✅ Ungrouped ${childNodes.length} components from group`);
  }, [reactFlowInstance]);

  // Find shortest path between two nodes
  const findShortestPath = useCallback((sourceId: string, targetId: string): string[] => {
    const edges = reactFlowInstance?.getEdges() || [];
    
    // Build adjacency list
    const graph: Record<string, string[]> = {};
    edges.forEach(edge => {
      if (!graph[edge.source]) graph[edge.source] = [];
      graph[edge.source].push(edge.target);
    });
    
    // BFS to find shortest path
    const queue: { nodeId: string; path: string[] }[] = [{ nodeId: sourceId, path: [sourceId] }];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;
      
      if (nodeId === targetId) {
        return path;
      }
      
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);
      
      const neighbors = graph[nodeId] || [];
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          queue.push({ nodeId: neighbor, path: [...path, neighbor] });
        }
      });
    }
    
    return []; // No path found
  }, [reactFlowInstance]);

  // Highlight path between nodes
  const highlightPath = useCallback((path: string[]) => {
    if (!reactFlowInstance || path.length < 2) return;
    
    const edges = reactFlowInstance.getEdges();
    const updatedEdges = edges.map(edge => {
      const isInPath = path.some((nodeId, index) => 
        index > 0 && path[index - 1] === edge.source && nodeId === edge.target
      );
      
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: isInPath ? '#F59E0B' : edge.style?.stroke || '#10B981',
          strokeWidth: isInPath ? 4 : edge.style?.strokeWidth || 2
        },
        animated: isInPath
      };
    });
    
    reactFlowInstance.setEdges(updatedEdges);
    
    // Reset highlight after 3 seconds
    setTimeout(() => {
      const resetEdges = updatedEdges.map(edge => ({
        ...edge,
        style: {
          ...edge.style,
          stroke: edge.style?.stroke || '#10B981',
          strokeWidth: 2
        },
        animated: edge.animated
      }));
      reactFlowInstance.setEdges(resetEdges);
    }, 3000);
  }, [reactFlowInstance]);

  return {
    validateConnection,
    autoLayoutNodes,
    groupSelectedNodes,
    ungroupNodes,
    findShortestPath,
    highlightPath,
    nodeMap
  };
};
