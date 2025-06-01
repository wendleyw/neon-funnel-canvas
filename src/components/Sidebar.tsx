
import React, { useCallback, useState } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { ErrorBoundary } from './ErrorBoundary';
import { CreateComponentModal } from './ComponentCreator/CreateComponentModal';
import { ReadyTemplatesModal } from './ReadyTemplates/ReadyTemplatesModal';
import { useComponentTemplates } from '../hooks/useComponentTemplates';
import { SidebarHeader } from './Sidebar/SidebarHeader';
import { TemplateSection } from './Sidebar/TemplateSection';
import { CategorizedTemplates } from './Sidebar/CategorizedTemplates';
import { DigitalLaunchSection } from '../features/digital-launch/components/DigitalLaunchSection';

interface SidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: any[], connections: any[]) => void;
}

export const Sidebar = React.memo<SidebarProps>(({ onDragStart, onAddCompleteTemplate }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReadyTemplatesOpen, setIsReadyTemplatesOpen] = useState(false);
  const { customTemplates, addCustomTemplate, removeCustomTemplate } = useComponentTemplates();

  const handleDragStart = useCallback((e: React.DragEvent, template: ComponentTemplate) => {
    console.log('Starting drag for template:', template);
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  }, [onDragStart]);

  const handleCreateTemplate = useCallback((template: ComponentTemplate) => {
    console.log('Creating new template:', template);
    addCustomTemplate(template);
  }, [addCustomTemplate]);

  const handleReadyTemplateSelect = useCallback((components: any[], connections: any[]) => {
    if (onAddCompleteTemplate) {
      onAddCompleteTemplate(components, connections);
    }
  }, [onAddCompleteTemplate]);

  console.log('Custom templates count:', customTemplates.length);

  return (
    <ErrorBoundary>
      <div className="w-64 bg-black border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-white font-semibold text-lg">Componentes</h2>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setIsReadyTemplatesOpen(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded transition-colors"
            >
              Templates Prontos
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-6">
            <DigitalLaunchSection
              onDragStart={onDragStart}
              onAddCompleteTemplate={onAddCompleteTemplate}
            />

            <CategorizedTemplates onDragStart={handleDragStart} />

            {customTemplates.length > 0 && (
              <TemplateSection
                title="Componentes Personalizados"
                templates={customTemplates}
                onDragStart={handleDragStart}
                isCustomSection
                onRemoveTemplate={removeCustomTemplate}
              />
            )}
          </div>
        </div>
      </div>

      <CreateComponentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />

      <ReadyTemplatesModal
        isOpen={isReadyTemplatesOpen}
        onClose={() => setIsReadyTemplatesOpen(false)}
        onTemplateSelect={handleReadyTemplateSelect}
      />
    </ErrorBoundary>
  );
});

Sidebar.displayName = 'Sidebar';
