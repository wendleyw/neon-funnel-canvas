
import React from 'react';
import { componentTemplates } from '../data/componentTemplates';
import { ComponentTemplate } from '../types/funnel';

interface SidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    console.log('Starting drag for template:', template);
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  };

  return (
    <div className="w-64 bg-black border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white mb-1">FunnelCraft</h2>
        <p className="text-gray-400 text-xs">Arraste componentes para o canvas</p>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Componentes
          </h3>
          
          {componentTemplates.map((template) => (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => handleDragStart(e, template)}
              className="flex items-center p-3 bg-gray-900 rounded border border-gray-800 cursor-grab hover:bg-gray-800 hover:border-gray-700 transition-all active:cursor-grabbing"
            >
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-sm mr-3">
                {template.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium text-sm truncate">{template.label}</h4>
                <p className="text-gray-400 text-xs truncate">{template.defaultData.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
