
import React from 'react';
import { FunnelComponent } from '../types/funnel';

interface StatusBadgeProps {
  status: FunnelComponent['data']['status'];
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'sm' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return { 
          label: 'Rascunho', 
          className: 'bg-gray-600 text-gray-200' 
        };
      case 'active':
        return { 
          label: 'Ativo', 
          className: 'bg-green-600 text-green-100' 
        };
      case 'test':
        return { 
          label: 'Teste', 
          className: 'bg-yellow-600 text-yellow-100' 
        };
      case 'published':
        return { 
          label: 'Publicado', 
          className: 'bg-blue-600 text-blue-100' 
        };
      case 'inactive':
        return { 
          label: 'Inativo', 
          className: 'bg-red-600 text-red-100' 
        };
      default:
        return { 
          label: 'Desconhecido', 
          className: 'bg-gray-600 text-gray-200' 
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.className} ${sizeClasses}`}>
      {config.label}
    </span>
  );
};
