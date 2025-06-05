import { Connection } from 'reactflow';
import { FunnelComponent } from '../types/funnel';
import { getComponentDimensions } from './connectionUtils';

/**
 * Connection validation helper - validates if a connection between two nodes is valid
 * @param connection - The connection to validate
 * @param nodeMap - Map of node IDs to FunnelComponent objects
 * @param enableValidation - Whether to enable validation rules
 * @returns boolean indicating if the connection is valid
 */
export const isValidConnection = (
  connection: Connection, 
  nodeMap: Map<string, FunnelComponent>, 
  enableValidation = true
): boolean => {
  if (!connection.source || !connection.target) {
    console.warn('❌ Invalid connection: Missing source or target');
    return false;
  }
  
  const sourceNode = nodeMap.get(connection.source);
  const targetNode = nodeMap.get(connection.target);
  
  if (!sourceNode || !targetNode) {
    console.warn('❌ Invalid connection: Source or target node not found');
    return false;
  }
  
  // Prevent self-connections
  if (connection.source === connection.target) {
    console.warn('❌ Invalid connection: Self-connections not allowed');
    return false;
  }
  
  // Skip validation if disabled - allow any connection
  if (!enableValidation) {
    console.log('✅ Connection validation disabled - allowing connection');
    return true;
  }
  
  // Define connection rules based on component types
  const connectionRules: Record<string, { canConnectTo: string[] }> = {
    'landing-page': { 
      canConnectTo: ['quiz', 'form', 'email-sequence', 'webinar-live', 'opt-in-page', 'sales-page'] 
    },
    'quiz': { 
      canConnectTo: ['sales-page', 'opt-in-page', 'email-sequence', 'thank-you-page'] 
    },
    'form': { 
      canConnectTo: ['thank-you-page', 'email-sequence', 'sales-page'] 
    },
    'email-sequence': { 
      canConnectTo: ['sales-page', 'webinar-live', 'landing-page', 'checkout'] 
    },
    'sales-page': { 
      canConnectTo: ['checkout', 'thank-you-page'] 
    },
    'checkout': { 
      canConnectTo: ['thank-you-page'] 
    },
    'webinar-live': { 
      canConnectTo: ['sales-page', 'opt-in-page', 'checkout'] 
    },
    'webinar-replay': { 
      canConnectTo: ['sales-page', 'opt-in-page', 'checkout'] 
    },
    'opt-in-page': { 
      canConnectTo: ['form', 'email-sequence', 'download-page', 'thank-you-page'] 
    },
    'download-page': { 
      canConnectTo: ['thank-you-page'] 
    },
    'calendar-page': { 
      canConnectTo: ['thank-you-page', 'sales-page'] 
    }
  };
  
  const sourceRules = connectionRules[sourceNode.type];
  if (sourceRules && !sourceRules.canConnectTo.includes(targetNode.type)) {
    console.warn(`❌ Invalid connection: ${sourceNode.type} cannot connect to ${targetNode.type}`);
    return false;
  }
  
  console.log(`✅ Valid connection: ${sourceNode.type} can connect to ${targetNode.type}`);
  return true;
};

/**
 * Enhanced edge styles based on connection type
 * @param sourceType - Type of the source component
 * @param targetType - Type of the target component
 * @returns Edge style configuration
 */
export const getEdgeStyle = (sourceType: string, targetType: string) => {
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

/**
 * Get connection label based on component types
 * @param sourceType - Type of the source component
 * @param targetType - Type of the target component
 * @returns Human-readable connection label
 */
export const getConnectionLabel = (sourceType?: string, targetType?: string): string => {
  if (!sourceType || !targetType) {
    return 'Lead';
  }
  
  const labelMap: Record<string, Record<string, string>> = {
    'landing-page': {
      'quiz': 'Visitor',
      'opt-in-page': 'CTA Click',
      'sales-page': 'Warm Lead',
      'email-sequence': 'Subscriber'
    },
    'quiz': {
      'sales-page': 'Qualified Lead',
      'thank-you-page': 'Quiz Complete',
      'email-sequence': 'Subscriber'
    },
    'sales-page': {
      'checkout': 'Interest',
      'thank-you-page': 'Customer'
    },
    'email-sequence': {
      'sales-page': 'Nurtured Lead',
      'webinar-live': 'Registered',
      'checkout': 'Ready to Buy'
    },
    'checkout': {
      'thank-you-page': 'Purchase'
    },
    'webinar-live': {
      'sales-page': 'Engaged',
      'checkout': 'Hot Lead'
    },
    'opt-in-page': {
      'email-sequence': 'Subscriber',
      'download-page': 'Download'
    }
  };
  
  const sourceLabels = labelMap[sourceType];
  const label = sourceLabels?.[targetType] || 'Lead';
  
  // Disabled for cleaner console
  if (label !== 'Lead' && process.env.NODE_ENV === 'development' && false) {
    console.log(`🔗 Connection label: ${sourceType} -> ${targetType} = "${label}"`);
  }
  return label;
};

/**
 * Calculate the best connection points based on component positions
 * @param sourceNodeId - ID of the source node
 * @param targetNodeId - ID of the target node
 * @param getNodes - Function to get current nodes from React Flow
 * @param nodeMap - Map of node IDs to FunnelComponent objects
 * @returns Object with sourceHandle and targetHandle
 */
export const calculateBestConnectionPoints = (
  sourceNodeId: string, 
  targetNodeId: string,
  getNodes: () => any[],
  nodeMap: Map<string, FunnelComponent>
) => {
  // Get current nodes from React Flow
  const currentNodes = getNodes();
  const sourceNode = currentNodes.find(n => n.id === sourceNodeId);
  const targetNode = currentNodes.find(n => n.id === targetNodeId);
  
  if (!sourceNode || !targetNode) {
    // Completely disabled for cleaner console - only log in critical debugging scenarios
    return {
      sourceHandle: 'right-source',
      targetHandle: 'left-target'
    };
  }
  
  const sourcePos = sourceNode.position;
  const targetPos = targetNode.position;
  
  // Get actual component dimensions based on their types
  const sourceComp = nodeMap.get(sourceNodeId);
  const targetComp = nodeMap.get(targetNodeId);
  
  const sourceDims = sourceComp ? getComponentDimensions(sourceComp.type) : { width: 288, height: 200 };
  const targetDims = targetComp ? getComponentDimensions(targetComp.type) : { width: 288, height: 200 };
  
  // Calculate centers of the components using real dimensions
  const sourceCenterX = sourcePos.x + sourceDims.width / 2;
  const sourceCenterY = sourcePos.y + sourceDims.height / 2;
  const targetCenterX = targetPos.x + targetDims.width / 2;
  const targetCenterY = targetPos.y + targetDims.height / 2;
  
  // Calculate relative position
  const deltaX = targetCenterX - sourceCenterX;
  const deltaY = targetCenterY - sourceCenterY;
  
  // Disabled for cleaner console
  if (process.env.NODE_ENV === 'development' && false) {
    console.log(`🧭 Connection analysis: ${sourceNodeId} → ${targetNodeId}`, {
      sourceCenter: { x: sourceCenterX, y: sourceCenterY },
      targetCenter: { x: targetCenterX, y: targetCenterY },
      delta: { x: deltaX, y: deltaY },
      sourceDims,
      targetDims,
      sourceType: sourceComp?.type,
      targetType: targetComp?.type
    });
  }
  
  // Determine the primary direction based on the larger delta
  let sourceHandle: string;
  let targetHandle: string;
  
  // Check for very close components (avoid unnecessary routing)
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const isVeryClose = distance < Math.max(sourceDims.width, targetDims.width) * 0.8;
  
  if (isVeryClose) {
    // Reduced logging for close components
    if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
      console.log('🔍 Components are very close, using simple routing');
    }
    // For very close components, use simple left-to-right preference
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        sourceHandle = 'right-source';
        targetHandle = 'left-target';
      } else {
        sourceHandle = 'left-source';
        targetHandle = 'right-target';
      }
    } else {
      if (deltaY > 0) {
        sourceHandle = 'bottom-source';
        targetHandle = 'top-target';
      } else {
        sourceHandle = 'top-source';
        targetHandle = 'bottom-target';
      }
    }
  } else {
    // For distant components, use optimal routing based on direction and distance
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal routing preferred
      if (deltaX > 0) {
        // Target is to the right
        sourceHandle = 'right-source';
        targetHandle = 'left-target';
      } else {
        // Target is to the left
        sourceHandle = 'left-source';
        targetHandle = 'right-target';
      }
    } else {
      // Vertical routing preferred
      if (deltaY > 0) {
        // Target is below
        sourceHandle = 'bottom-source';
        targetHandle = 'top-target';
      } else {
        // Target is above
        sourceHandle = 'top-source';
        targetHandle = 'bottom-target';
      }
    }
  }

  // Only log results when explicitly debugging connections
  if (process.env.NODE_ENV === 'development' && false) { // Disabled for cleaner console
    console.log(`🧭 Final handles: ${sourceHandle} → ${targetHandle}`, {
      distance: distance.toFixed(1),
      isVeryClose,
      primaryDirection: Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
    });
  }

  return {
    sourceHandle,
    targetHandle
  };
};

/**
 * Generate a random offset for component positioning
 * @returns Random offset between -25 and 25 pixels
 */
export const generateRandomOffset = (): number => {
  return (Math.random() - 0.5) * 50; // ±25px offset
}; 