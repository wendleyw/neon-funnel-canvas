
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const FunnelComponentNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5, background: '#f9f9f9' }}>
      <Handle type="target" position={Position.Left} id="a" />
      <strong>{data.title}</strong>
      {data.description && <p>{data.description}</p>}
      <Handle type="source" position={Position.Right} id="b" />
    </div>
  );
};
