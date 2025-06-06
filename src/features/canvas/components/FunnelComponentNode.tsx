import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface FunnelComponentNodeData {
  label: string;
  icon: string;
  type: string;
  description?: string;
  isActive?: boolean;
}

export const FunnelComponentNode: React.FC<NodeProps<FunnelComponentNodeData>> = ({ 
  data, 
  selected, 
  id 
}) => {
  const { label, icon, type, description, isActive = false } = data;

  return (
    <div className={`
      relative bg-gray-800 border-2 rounded-lg p-4 min-w-48 max-w-64 shadow-lg transition-all duration-200
      ${selected ? 'border-blue-500 shadow-blue-500/20' : 'border-gray-600'}
      ${isActive ? 'ring-2 ring-green-500 ring-opacity-50' : ''}
      hover:border-gray-400 hover:shadow-xl
    `}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-blue-300"
        style={{ left: -6 }}
      />

      {/* Header with icon and title */}
      <div className="flex items-center gap-3 mb-2">
        <div className="text-2xl flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">
            {label}
          </h3>
          <p className="text-gray-400 text-xs capitalize">
            {type.replace('-', ' ')}
          </p>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-300 text-xs leading-relaxed mb-2">
          {description}
        </p>
      )}

      {/* Status indicator */}
      <div className="flex items-center gap-2 mt-3">
        <div className={`
          w-2 h-2 rounded-full transition-colors
          ${isActive ? 'bg-green-500' : 'bg-gray-500'}
        `} />
        <span className="text-xs text-gray-400">
          {isActive ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500 !border-2 !border-green-300"
        style={{ right: -6 }}
      />

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -inset-0.5 bg-blue-500 rounded-lg opacity-20 pointer-events-none" />
      )}
    </div>
  );
}; 