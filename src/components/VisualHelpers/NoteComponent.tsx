
import React, { useState, useCallback } from 'react';
import { StickyNote, Edit3, Trash2 } from 'lucide-react';
import { FunnelComponent } from '../../types/funnel';
import { Textarea } from '../ui/textarea';

interface NoteComponentProps {
  component: FunnelComponent;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<FunnelComponent>) => void;
  onDelete: () => void;
  onSelect: () => void;
}

export const NoteComponent: React.FC<NoteComponentProps> = ({
  component,
  isSelected,
  onUpdate,
  onDelete,
  onSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(component.data.description || '');

  const noteColor = component.data.properties?.color || 'yellow';
  
  const colorClasses = {
    yellow: 'bg-gradient-to-br from-yellow-200 to-yellow-300 border-yellow-400 text-yellow-900',
    pink: 'bg-gradient-to-br from-pink-200 to-pink-300 border-pink-400 text-pink-900',
    blue: 'bg-gradient-to-br from-blue-200 to-blue-300 border-blue-400 text-blue-900',
    green: 'bg-gradient-to-br from-green-200 to-green-300 border-green-400 text-green-900',
    purple: 'bg-gradient-to-br from-purple-200 to-purple-300 border-purple-400 text-purple-900',
    orange: 'bg-gradient-to-br from-orange-200 to-orange-300 border-orange-400 text-orange-900'
  };

  const neonGlow = {
    yellow: 'shadow-[0_0_20px_rgba(255,255,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,0,0.5)]',
    pink: 'shadow-[0_0_20px_rgba(255,20,147,0.3)] hover:shadow-[0_0_30px_rgba(255,20,147,0.5)]',
    blue: 'shadow-[0_0_20px_rgba(0,191,255,0.3)] hover:shadow-[0_0_30px_rgba(0,191,255,0.5)]',
    green: 'shadow-[0_0_20px_rgba(0,255,127,0.3)] hover:shadow-[0_0_30px_rgba(0,255,127,0.5)]',
    purple: 'shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_30px_rgba(138,43,226,0.5)]',
    orange: 'shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)]'
  };

  const handleSave = useCallback(() => {
    onUpdate(component.id, {
      data: {
        ...component.data,
        description: noteText
      }
    });
    setIsEditing(false);
  }, [component.id, component.data, noteText, onUpdate]);

  const handleColorChange = useCallback((color: string) => {
    onUpdate(component.id, {
      data: {
        ...component.data,
        properties: {
          ...component.data.properties,
          color
        }
      }
    });
  }, [component.id, component.data, onUpdate]);

  return (
    <div
      className={`
        relative w-48 h-48 cursor-pointer transition-all duration-300 transform
        ${colorClasses[noteColor as keyof typeof colorClasses]} 
        ${neonGlow[noteColor as keyof typeof neonGlow]}
        border-2 rounded-lg shadow-lg
        ${isSelected ? 'ring-2 ring-white ring-opacity-60 scale-105' : 'hover:scale-102'}
        rotate-1 hover:rotate-0
      `}
      onClick={onSelect}
      style={{
        fontFamily: 'Comic Sans MS, cursive'
      }}
    >
      {/* Sticky note pin */}
      <div className="absolute -top-2 left-4 w-4 h-4 bg-red-500 rounded-full shadow-lg">
        <div className="absolute inset-1 bg-red-300 rounded-full"></div>
      </div>

      {/* Color picker dots */}
      <div className="absolute top-2 right-2 flex space-x-1">
        {Object.keys(colorClasses).map((color) => (
          <button
            key={color}
            className={`w-3 h-3 rounded-full border transition-transform hover:scale-125 ${
              colorClasses[color as keyof typeof colorClasses]
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleColorChange(color);
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="p-4 pt-8 h-full flex flex-col">
        {isEditing ? (
          <div className="flex-1 flex flex-col">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Escreva sua nota aqui..."
              className="flex-1 bg-transparent border-none resize-none text-sm leading-tight focus:ring-0 focus:outline-none"
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <p className="text-sm leading-tight whitespace-pre-wrap break-words">
              {component.data.description || 'Clique para adicionar uma nota...'}
            </p>
          </div>
        )}

        {/* Actions */}
        {isSelected && !isEditing && (
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="w-6 h-6 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all"
            >
              <Edit3 className="w-3 h-3 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-6 h-6 bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all"
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
