
import { Node, Edge } from 'reactflow';
import { FunnelComponent, Connection } from './funnel';

export type ReactFlowNode = Node<FunnelComponent['data'] & { originalType: string; isHighlighted?: boolean, title: string, description?: string, status: FunnelComponent['data']['status'] }>;
export type ReactFlowEdge = Edge;

export const convertFunnelComponentToNode = (component: FunnelComponent): ReactFlowNode => {
    return {
        id: component.id,
        position: component.position,
        data: {
            ...component.data,
            originalType: component.type,
        },
        type: 'custom'
    };
};

export const convertConnectionToEdge = (connection: Connection): ReactFlowEdge => {
    return {
        id: connection.id,
        source: connection.from,
        target: connection.to,
        type: 'animatedNode',
        animated: connection.animated,
        style: { stroke: connection.color || '#666' }
    };
};

export const convertNodeToFunnelComponent = (node: ReactFlowNode): FunnelComponent => {
    return {
        id: node.id,
        type: node.data.originalType || 'unknown',
        position: node.position,
        data: {
            title: node.data.title,
            description: node.data.description,
            status: node.data.status,
            properties: {}
        }
    };
};

export const convertEdgeToConnection = (edge: ReactFlowEdge): Connection => {
    return {
        id: edge.id,
        from: edge.source,
        to: edge.target,
        type: 'success',
        animated: edge.animated
    };
};
