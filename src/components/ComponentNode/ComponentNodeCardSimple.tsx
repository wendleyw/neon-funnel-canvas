import React from 'react';
import { FunnelComponent, ComponentTemplate } from '../../types/funnel';
import { 
  Edit2, 
  Trash2, 
  Link, 
  Copy, 
  Play,
  Pause,
  Settings,
  Zap
} from 'lucide-react';

interface ComponentNodeCardSimpleProps {
  component: FunnelComponent;
  template: ComponentTemplate;
  isSelected: boolean;
  isConnecting: boolean;
  canConnect: boolean;
  onEditClick: (e?: React.MouseEvent) => void;
  onDeleteClick: (e?: React.MouseEvent) => void;
  onConnectionClick: (e?: React.MouseEvent) => void;
  onDuplicateClick?: (e?: React.MouseEvent) => void;
}

export const ComponentNodeCardSimple: React.FC<ComponentNodeCardSimpleProps> = ({
  component,
  template,
  isSelected,
  isConnecting,
  canConnect,
  onEditClick,
  onDeleteClick,
  onConnectionClick,
  onDuplicateClick
}) => {

  // Get status info
  const getStatusInfo = () => {
    const status = component.data.status;
    switch (status) {
      case 'active':
        return { color: '#10B981', icon: Play, text: 'Active' };
      case 'inactive':
        return { color: '#F59E0B', icon: Pause, text: 'Inactive' };
      case 'draft':
        return { color: '#6B7280', icon: Settings, text: 'Draft' };
      case 'test':
        return { color: '#8B5CF6', icon: Zap, text: 'Test' };
      case 'published':
        return { color: '#10B981', icon: Play, text: 'Published' };
      default:
        return { color: '#8B5CF6', icon: Zap, text: 'Ready' };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="group relative">
      {/* Card Simplificado */}
      <div
        className={`
          relative w-64 bg-gray-900 rounded-lg shadow-lg border-2 overflow-hidden 
          transition-all duration-200 ease-out hover:shadow-xl hover:scale-105
          ${isSelected ? 'border-blue-500 shadow-blue-500/30 ring-2 ring-blue-500/20' : 'border-gray-700 hover:border-gray-600'}
          ${canConnect ? 'border-green-500 border-4 shadow-green-500/40 animate-pulse' : ''}
          ${isConnecting ? 'ring-2 ring-blue-500/50' : ''}
        `}
      >
        {/* Header Colorido */}
        <div 
          className="h-1 w-full"
          style={{ backgroundColor: template.color }}
        />

        {/* Conteúdo Principal */}
        <div className="p-4">
          {/* Ícone e Título */}
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-semibold border-2"
              style={{ 
                backgroundColor: `${template.color}20`,
                borderColor: `${template.color}40`,
                color: template.color
              }}
            >
              {template.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm leading-tight truncate">
                {component.data.title || template.label}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <StatusIcon className="w-3 h-3" style={{ color: statusInfo.color }} />
                  <span className="text-xs" style={{ color: statusInfo.color }}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview/Descrição */}
          {component.data.description && (
            <div className="mb-3">
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                {component.data.description}
              </p>
            </div>
          )}

          {/* Ações Simples (só visível no hover ou quando selecionado) */}
          <div className={`flex items-center justify-between transition-all duration-200 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <div className="flex items-center gap-1">
              <button
                onClick={onEditClick}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-md transition-all duration-200"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onConnectionClick}
                className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-gray-800 rounded-md transition-all duration-200"
                title="Connect"
              >
                <Link className="w-3.5 h-3.5" />
              </button>
              {onDuplicateClick && (
                <button
                  onClick={onDuplicateClick}
                  className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-gray-800 rounded-md transition-all duration-200"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <button
              onClick={onDeleteClick}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-md transition-all duration-200"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Connection Points (handles) */}
        {(isSelected || isConnecting) && (
          <>
            {/* Top handle */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-600 border-2 border-gray-400 rounded-full hover:bg-gray-500 transition-colors cursor-pointer" />
            
            {/* Right handle */}
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-gray-600 border-2 border-gray-400 rounded-full hover:bg-gray-500 transition-colors cursor-pointer" />
            
            {/* Bottom handle */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-600 border-2 border-gray-400 rounded-full hover:bg-gray-500 transition-colors cursor-pointer" />
            
            {/* Left handle */}
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-gray-600 border-2 border-gray-400 rounded-full hover:bg-gray-500 transition-colors cursor-pointer" />
          </>
        )}
      </div>
    </div>
  );
};

export default ComponentNodeCardSimple; 