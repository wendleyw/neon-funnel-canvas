
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
