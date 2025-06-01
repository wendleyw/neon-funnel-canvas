
import React, { useCallback, useState } from 'react';
import { ComponentTemplate } from '../types/funnel';
import { ErrorBoundary } from './ErrorBoundary';
import { CreateComponentModal } from './ComponentCreator/CreateComponentModal';
import { useComponentTemplates } from '../hooks/useComponentTemplates';
import { SidebarHeader } from './Sidebar/SidebarHeader';
import { TemplateSection } from './Sidebar/TemplateSection';

interface SidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
}

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

  const defaultTemplates = allTemplates.filter(template => !customTemplates.includes(template));

  return (
    <ErrorBoundary>
      <div className="w-64 bg-black border-r border-gray-800 flex flex-col">
        <SidebarHeader onCreateNewComponent={() => setIsCreateModalOpen(true)} />
        
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-4">
            <TemplateSection
              title="Componentes Padrão"
              templates={defaultTemplates}
              onDragStart={handleDragStart}
            />

            <TemplateSection
              title="Componentes Personalizados"
              templates={customTemplates}
              onDragStart={handleDragStart}
              isCustomSection
              onRemoveTemplate={removeCustomTemplate}
            />
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
