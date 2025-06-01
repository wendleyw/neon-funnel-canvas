
import React, { useState, useCallback } from 'react';
import { FunnelComponent } from '../types/funnel';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Upload, Link, Settings, X, Check } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { DigitalLaunchFields } from '../features/digital-launch/components/DigitalLaunchFields';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface ComponentEditorProps {
  component: FunnelComponent;
  onUpdate: (updates: Partial<FunnelComponent>) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  onUpdate,
  onClose,
  isOpen
}) => {
  const [formData, setFormData] = useState({
    title: component.data.title,
    description: component.data.description || '',
    image: component.data.image || '',
    url: component.data.url || '',
    status: component.data.status,
    properties: component.data.properties || {}
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePropertyChange = useCallback((key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      properties: { ...prev.properties, [key]: value }
    }));
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange('image', result);
      };
      reader.readAsDataURL(file);
    }
  }, [handleInputChange]);

  const handleSave = useCallback(() => {
    onUpdate({
      data: {
        ...component.data,
        ...formData
      }
    });
    onClose();
  }, [component.data, formData, onUpdate, onClose]);

  // Verificar se é um template de lançamento digital
  const digitalLaunchTypes = [
    'offer', 'target-audience', 'traffic-organic', 'traffic-paid', 
    'lead-capture', 'nurturing', 'webinar-vsl', 'sales-page', 
    'checkout-upsell', 'post-sale', 'analytics-optimization'
  ];
  
  const isDigitalLaunchComponent = digitalLaunchTypes.includes(component.type);

  const getComponentFeatures = useCallback(() => {
    // Para componentes de lançamento digital, usar campos específicos
    if (isDigitalLaunchComponent) {
      return (
        <DigitalLaunchFields
          componentType={component.type}
          properties={formData.properties}
          onPropertyChange={handlePropertyChange}
        />
      );
    }

    // Manter lógica existente para componentes básicos
    switch (component.type) {
      case 'landing-page':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Página de Destino</label>
              <Input
                placeholder="URL da página"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Call-to-Action</label>
              <Input
                placeholder="Texto do botão principal"
              />
            </div>
          </>
        );
      case 'form':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Campos do Formulário</label>
            <Textarea
              placeholder="Nome, Email, Telefone..."
              rows={3}
            />
          </div>
        );
      case 'quiz':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Número de Perguntas</label>
            <Input
              type="number"
              placeholder="5"
            />
          </div>
        );
      default:
        return null;
    }
  }, [component.type, formData.url, formData.properties, handleInputChange, handlePropertyChange, isDigitalLaunchComponent]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isDigitalLaunchComponent ? 'Configurar Lançamento' : 'Editar Componente'}
          </DialogTitle>
          <DialogDescription>
            Configure as propriedades do componente
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={2}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="draft">Rascunho</option>
              <option value="active">Ativo</option>
              <option value="test">Teste</option>
              <option value="published">Publicado</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          {/* Funcionalidades específicas do componente */}
          {getComponentFeatures()}

          {/* Botões de ação */}
          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400"
            >
              <Settings className="w-4 h-4 mr-1" />
              Avançado
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
              >
                <Check className="w-4 h-4 mr-1" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
