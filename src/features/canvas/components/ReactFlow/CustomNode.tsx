
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const CustomNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5, background: 'white' }}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label || 'Custom Node'}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
