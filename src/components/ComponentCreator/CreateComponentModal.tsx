
import React, { useState, useCallback } from 'react';
import { X, Plus, Palette } from 'lucide-react';
import { ComponentTemplate } from '../../types/funnel';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardHeader, CardContent } from '../ui/card';

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
      defaultData: {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 bg-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Criar Novo Componente</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Nome do Componente</label>
              <Input
                value={formData.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Ex: Landing Page Personalizada"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Descreva a funcionalidade do componente..."
                rows={3}
              />
            </div>

            {/* Ícone */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Ícone</label>
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

            {/* Cor */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Cor</label>
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

            {/* Botões */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Criar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
