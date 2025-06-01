
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

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'active':
        return 'shadow-green-500/50';
      case 'test':
        return 'shadow-yellow-500/50';
      case 'published':
        return 'shadow-blue-500/50';
      case 'inactive':
        return 'shadow-red-500/50';
      default:
        return 'shadow-gray-500/50';
    }
  };

  return (
    <div className="w-72 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-gray-600/70 relative group overflow-hidden backdrop-blur-sm">
      {/* Neon border effect */}
      <div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(45deg, transparent, ${template.color}30, transparent)`
        }}
      />
      
      {/* Inner glow effect */}
      <div 
        className="absolute inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${template.color}10, transparent, ${template.color}10)`,
          boxShadow: `inset 0 0 20px ${template.color}20`
        }}
      />

      {/* Header com gradiente neon baseado na cor do template */}
      <div 
        className="h-4 w-full relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${template.color}, ${template.color}80, ${template.color}60)` 
        }}
      >
        {/* Animated light streak */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${template.color}40, transparent)`,
            animation: 'shimmer 3s infinite'
          }}
        />
        
        {/* Status indicator no canto superior direito com glow */}
        <div className="absolute top-1 right-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(component.data.status)} border border-white/50 shadow-lg ${getStatusGlow(component.data.status)} animate-pulse`} />
        </div>
      </div>
      
      {/* Header do componente melhorado */}
      <div className="p-4 pb-2 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-lg relative overflow-hidden group/icon"
              style={{ 
                backgroundColor: `${template.color}20`, 
                color: template.color,
                boxShadow: `0 0 20px ${template.color}20`
              }}
            >
              {/* Icon glow effect */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle, ${template.color}30, transparent)`,
                  filter: 'blur(8px)'
                }}
              />
              <span className="relative z-10">{template.icon}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-white/90 transition-colors">
                {template.label}
              </h3>
              <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">
                {component.type}
              </p>
            </div>
          </div>
          
          {/* Botões de ação no header */}
          {isSelected && !isConnecting && (
            <div className="flex items-center gap-1">
              <button
                onClick={onEditClick}
                className="w-8 h-8 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:shadow-lg hover:shadow-blue-500/20"
                title="Editar componente"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={onDeleteClick}
                className="w-8 h-8 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:shadow-lg hover:shadow-red-500/20"
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
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-20">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-ping opacity-75" />
          <ArrowRight className="w-5 h-5 relative z-10" />
        </div>
      )}
      
      {/* Conteúdo do componente */}
      <div className="px-4 pb-4 relative z-10">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-3 border border-gray-700/30 group-hover:border-gray-600/30 transition-colors duration-300">
          <h4 className="text-white font-medium text-sm mb-2 leading-tight">
            {component.data.title}
          </h4>
          {component.data.description && (
            <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
              {component.data.description}
            </p>
          )}
        </div>
        
        {/* Status e informações */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full animate-pulse shadow-sm"
                style={{ 
                  backgroundColor: template.color,
                  boxShadow: `0 0 6px ${template.color}50`
                }}
              />
              <span className="text-gray-400 font-medium">Online</span>
            </div>
          </div>
          <div className="text-gray-500 text-xs bg-gray-800/30 px-2 py-1 rounded-md">
            {component.data.status}
          </div>
        </div>
      </div>
      
      {/* Pontos de conexão */}
      <ComponentNodeConnectionPoints />
      
      {/* Enhanced glow effect quando selecionado */}
      {isSelected && (
        <>
          {/* Main selection glow */}
          <div 
            className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse"
            style={{
              boxShadow: `0 0 0 2px ${template.color}60, 0 0 30px ${template.color}30, 0 0 60px ${template.color}20`
            }}
          />
          
          {/* Inner rim glow */}
          <div 
            className="absolute inset-[2px] rounded-2xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 20px ${template.color}20`
            }}
          />
        </>
      )}
    </div>
  );
};
