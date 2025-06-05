import React, { useState, useCallback } from 'react';
import { X, Plus, Palette } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { EditorModalBase } from '../shared/EditorModalBase';
import { ComponentTemplate } from '../../types/funnel';

interface CreateComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTemplate: (template: ComponentTemplate) => void;
}

const availableIcons = ['🎯', '❓', '📝', '📧', '💳', '⚡', '📊', '🎨', '🔧', '🌟', '🚀', '💡', '📱', '🔔', '🎪'];
const availableColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#06B6D4', '#84CC16', '#F97316', '#EC4899'];

export const CreateComponentModal: React.FC<CreateComponentModalProps> = ({
  isOpen,
  onClose,
  onCreateTemplate
}) => {
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    icon: '🎯',
    color: '#3B82F6'
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label.trim()) return;
    
    const newTemplate: ComponentTemplate = {
      type: 'custom' as any,
      icon: formData.icon,
      label: formData.label,
      color: formData.color,
      category: 'custom',
      defaultProps: {
        title: formData.label,
        description: formData.description,
        status: 'draft',
        properties: {}
      }
    };
    
    onCreateTemplate(newTemplate);
    
    // Reset form
    setFormData({
      label: '',
      description: '',
      icon: '🎯',
      color: '#3B82F6'
    });
    
    onClose();
  }, [formData, onCreateTemplate, onClose]);

  if (!isOpen) return null;

  return (
    <EditorModalBase isOpen={isOpen} onClose={onClose} title="Create New Component">
      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        <div>
          <label htmlFor="componentName" className="block text-xs font-medium text-gray-300 mb-1">
            Component Name
          </label>
          <Input
            id="componentName"
            value={formData.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="E.g., Custom Landing Page"
            required
          />
        </div>

        <div>
          <label htmlFor="componentDescription" className="block text-xs font-medium text-gray-300 mb-1">
            Description
          </label>
          <Textarea
            id="componentDescription"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the component's functionality..."
            className="w-full bg-gray-800 border-gray-700 text-white"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-300">Icon</label>
          <div className="grid grid-cols-5 gap-2">
            {availableIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => handleInputChange('icon', icon)}
                className={`w-10 h-10 rounded border-2 flex items-center justify-center text-lg transition-colors ${
                  formData.icon === icon
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-300">Color</label>
          <div className="grid grid-cols-5 gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleInputChange('color', color)}
                className={`w-10 h-10 rounded border-2 transition-all ${
                  formData.color === color
                    ? 'border-white scale-110'
                    : 'border-gray-600 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create
          </Button>
        </div>
      </form>
    </EditorModalBase>
  );
};
