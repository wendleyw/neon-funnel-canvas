
import React from 'react';
import { componentTemplates } from '../data/componentTemplates';
import { ComponentTemplate } from '../types/funnel';

interface SidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    onDragStart(template);
  };

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white mb-2">🚀 FunnelCraft</h2>
        <p className="text-gray-400 text-sm">Drag components to build your funnel</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
            Marketing Components
          </h3>
          
          {componentTemplates.map((template) => (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => handleDragStart(e, template)}
              className="group flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700 cursor-grab hover:bg-gray-750 hover:border-gray-600 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className={`w-10 h-10 rounded-lg ${template.color} flex items-center justify-center text-white font-bold mr-3 group-hover:scale-110 transition-transform`}>
                {template.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{template.label}</h4>
                <p className="text-gray-400 text-xs mt-1">{template.defaultData.description}</p>
              </div>
              <div className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Drag
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h4 className="text-sm font-semibold text-green-400 mb-2">💡 Pro Tip</h4>
          <p className="text-gray-300 text-xs">
            Connect components by clicking and dragging from the connection points. 
            Right-click for more options.
          </p>
        </div>
      </div>
    </div>
  );
};
