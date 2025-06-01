
import React, { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import { ComponentTemplate } from '../types/funnel';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from './ui/button';
import { CreateComponentModal } from './ComponentCreator/CreateComponentModal';
import { useComponentTemplates } from '../hooks/useComponentTemplates';

interface SidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
}

const ComponentTemplateItem = React.memo<{
  template: ComponentTemplate;
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  isCustom?: boolean;
  onRemove?: () => void;
}>(({ template, onDragStart, isCustom, onRemove }) => {
  const handleDragStart = useCallback((e: React.DragEvent) => {
    onDragStart(e, template);
  }, [onDragStart, template]);

  return (
    <div
      key={template.type}
      draggable
      onDragStart={handleDragStart}
      className="flex items-center p-3 bg-gray-900 rounded border border-gray-800 cursor-grab hover:bg-gray-800 hover:border-gray-700 transition-all active:cursor-grabbing group"
    >
      <div 
        className="w-8 h-8 rounded flex items-center justify-center text-white text-sm mr-3"
        style={{ backgroundColor: template.color }}
      >
        {template.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm truncate">{template.label}</h4>
        <p className="text-gray-400 text-xs truncate">{template.defaultData.description}</p>
      </div>
      {isCustom && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all ml-2"
        >
          ×
        </button>
      )}
    </div>
  );
});

ComponentTemplateItem.displayName = 'ComponentTemplateItem';

export const Sidebar = React.memo<SidebarProps>(({ onDragStart }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { allTemplates, customTemplates, addCustomTemplate, removeCustomTemplate } = useComponentTemplates();

  const handleDragStart = useCallback((e: React.DragEvent, template: ComponentTemplate) => {
    console.log('Starting drag for template:', template);
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  }, [onDragStart]);

  const handleCreateTemplate = useCallback((template: ComponentTemplate) => {
    addCustomTemplate(template);
  }, [addCustomTemplate]);

  return (
    <ErrorBoundary>
      <div className="w-64 bg-black border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white mb-1">FunnelCraft</h2>
          <p className="text-gray-400 text-xs">Arraste componentes para o canvas</p>
        </div>
        
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-4">
            {/* Botão para criar novo componente */}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Novo Componente
            </Button>

            {/* Componentes padrão */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Componentes Padrão
              </h3>
              
              {allTemplates.filter(template => !customTemplates.includes(template)).map((template) => (
                <ComponentTemplateItem
                  key={template.type}
                  template={template}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>

            {/* Componentes customizados */}
            {customTemplates.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Componentes Personalizados
                </h3>
                
                {customTemplates.map((template) => (
                  <ComponentTemplateItem
                    key={template.type}
                    template={template}
                    onDragStart={handleDragStart}
                    isCustom
                    onRemove={() => removeCustomTemplate(template.type)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateComponentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />
    </ErrorBoundary>
  );
});

Sidebar.displayName = 'Sidebar';
