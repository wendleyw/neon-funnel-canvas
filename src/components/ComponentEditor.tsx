
import React, { useState, useCallback } from 'react';
import { FunnelComponent } from '../types/funnel';
import { Card, CardHeader, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Upload, Link, Settings, X, Check } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ComponentEditorProps {
  component: FunnelComponent;
  onUpdate: (updates: Partial<FunnelComponent>) => void;
  onClose: () => void;
}

export const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  onUpdate,
  onClose
}) => {
  const [formData, setFormData] = useState({
    title: component.data.title,
    description: component.data.description || '',
    image: component.data.image || '',
    url: component.data.url || '',
    status: component.data.status
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const getComponentFeatures = useCallback(() => {
    switch (component.type) {
      case 'landing-page':
        return (
          <>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Página de Destino</label>
              <Input
                placeholder="URL da página"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Call-to-Action</label>
              <Input
                placeholder="Texto do botão principal"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </>
        );
      case 'form':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Campos do Formulário</label>
            <Textarea
              placeholder="Nome, Email, Telefone..."
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>
        );
      case 'quiz':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Número de Perguntas</label>
            <Input
              type="number"
              placeholder="5"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        );
      default:
        return null;
    }
  }, [component.type, formData.url, handleInputChange]);

  return (
    <Card className="absolute top-full left-0 mt-2 w-80 bg-gray-900 border-gray-700 shadow-xl z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium text-sm">Editar Componente</h3>
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
      
      <CardContent className="space-y-4">
        {/* Título */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-300">Título</label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-300">Descrição</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            rows={2}
          />
        </div>

        {/* Upload de Imagem */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-300">Imagem</label>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center space-x-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded cursor-pointer hover:bg-gray-700"
            >
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-300">Upload</span>
            </label>
            <Input
              placeholder="ou cole o link da imagem"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white flex-1"
            />
          </div>
          {formData.image && (
            <div className="mt-2">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="w-full h-20 object-cover rounded border border-gray-700"
              />
            </div>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-300">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
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
        <div className="flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Settings className="w-4 h-4 mr-1" />
            Avançado
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              Salvar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
