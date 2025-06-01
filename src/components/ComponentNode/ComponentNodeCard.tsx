
import React from 'react';
import { ArrowRight, Settings, Trash2, MoreVertical } from 'lucide-react';
import { ComponentNodeHeader } from './ComponentNodeHeader';
import { ComponentNodeContent } from './ComponentNodeContent';
import { ComponentNodeConnectionPoints } from './ComponentNodeConnectionPoints';
import { FunnelComponent, ComponentTemplate } from '../../types/funnel';

interface ComponentNodeCardProps {
  component: FunnelComponent;
  template: ComponentTemplate;
  isSelected: boolean;
  isConnecting: boolean;
  canConnect: boolean;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onConnectionClick: (e: React.MouseEvent) => void;
  onDuplicateClick: (e: React.MouseEvent) => void;
}

export const ComponentNodeCard: React.FC<ComponentNodeCardProps> = ({
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'test':
        return 'bg-yellow-500';
      case 'published':
        return 'bg-blue-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-72 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-gray-600 relative group overflow-hidden backdrop-blur-sm">
      {/* Header com gradiente baseado na cor do template */}
      <div 
        className="h-3 w-full relative"
        style={{ 
          background: `linear-gradient(135deg, ${template.color}, ${template.color}60, ${template.color}40)` 
        }}
      >
        {/* Status indicator no canto superior direito */}
        <div className="absolute top-1 right-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(component.data.status)} border-2 border-white shadow-lg`} />
        </div>
      </div>
      
      {/* Header do componente melhorado */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg"
              style={{ backgroundColor: `${template.color}20`, color: template.color }}
            >
              {template.icon}
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{template.label}</h3>
              <p className="text-gray-400 text-xs">{component.type}</p>
            </div>
          </div>
          
          {/* Botões de ação no header */}
          {isSelected && !isConnecting && (
            <div className="flex items-center gap-1">
              <button
                onClick={onEditClick}
                className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                title="Editar componente"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={onDeleteClick}
                className="w-8 h-8 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                title="Excluir componente"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Indicator para modo de conexão */}
      {canConnect && (
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg z-10">
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
      
      {/* Conteúdo do componente */}
      <div className="px-4 pb-4">
        <div className="bg-gray-800/50 rounded-xl p-3 mb-3">
          <h4 className="text-white font-medium text-sm mb-1">{component.data.title}</h4>
          {component.data.description && (
            <p className="text-gray-400 text-xs line-clamp-2">{component.data.description}</p>
          )}
        </div>
        
        {/* Métricas ou informações adicionais */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">ID:</span>
            <span className="text-gray-400 font-mono">{component.id.slice(-6)}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Online</span>
          </div>
        </div>
      </div>
      
      {/* Pontos de conexão */}
      <ComponentNodeConnectionPoints />
      
      {/* Glow effect quando selecionado */}
      {isSelected && (
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 0 2px ${template.color}40, 0 0 20px ${template.color}20`
          }}
        />
      )}
    </div>
  );
};
