
import React from 'react';

export const ComponentTemplateItem = ({ template, onDragStart }: any) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('application/json', JSON.stringify(template));
        if (onDragStart) {
            onDragStart(template);
        }
    };

    const Icon = template.icon;
    
    return (
        <div 
          draggable 
          onDragStart={handleDragStart} 
          className="p-2 border rounded-md cursor-grab bg-gray-800 hover:bg-gray-700 flex items-center gap-2"
        >
          {typeof Icon === 'string' ? (
            <span className="w-5 h-5 text-cyan-400 flex items-center justify-center">{Icon}</span>
          ) : (
            <Icon className="w-5 h-5 text-cyan-400" />
          )}
          <span className="text-sm text-white">{template.name || template.label}</span>
        </div>
    );
};
