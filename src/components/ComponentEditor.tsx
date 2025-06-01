
import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { X, Upload, Image as ImageIcon, Instagram, Youtube } from 'lucide-react';
import { FunnelComponent } from '../types/funnel';

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
    url: component.data.url || '',
    status: component.data.status,
    image: component.data.image || ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('Nenhum arquivo selecionado');
      return;
    }

    console.log('Arquivo selecionado:', file.name, file.type, file.size);

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (imageUrl) {
          console.log('Imagem processada com sucesso, tamanho:', imageUrl.length);
          setFormData(prev => ({ ...prev, image: imageUrl }));
        }
        setIsUploading(false);
      };
      
      reader.onerror = (error) => {
        console.error('Erro ao ler o arquivo:', error);
        alert('Erro ao carregar a imagem. Tente novamente.');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao processar a imagem');
      setIsUploading(false);
    }

    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleFileButtonClick = useCallback(() => {
    console.log('Botão de upload clicado');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    console.log('Removendo imagem');
    setFormData(prev => ({ ...prev, image: '' }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Salvando dados:', formData);
    
    onUpdate({
      data: {
        ...component.data,
        title: formData.title,
        description: formData.description,
        url: formData.url,
        status: formData.status,
        image: formData.image
      }
    });
    
    onClose();
  }, [formData, component.data, onUpdate, onClose]);

  const isSocialMediaComponent = component.type.includes('instagram-') || 
                                 component.type.includes('youtube-') || 
                                 component.type.includes('tiktok-') ||
                                 component.type.includes('facebook-') ||
                                 component.type.includes('linkedin-') ||
                                 component.type.includes('twitter-');

  const getDimensionsInfo = () => {
    const props = component.data.properties;
    if (props?.dimensions && props?.aspectRatio) {
      return `${props.dimensions} (${props.aspectRatio})`;
    }
    return 'Dimensões não especificadas';
  };

  const getPlatformIcon = () => {
    if (component.type.includes('instagram-')) return <Instagram className="w-4 h-4" />;
    if (component.type.includes('youtube-')) return <Youtube className="w-4 h-4" />;
    return null;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay de fundo com blur - tela cheia */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      />
      
      {/* Modal customizado com blur - tela cheia */}
      <div
        className="fixed inset-4 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl overflow-y-auto"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            {getPlatformIcon()}
            <h2 className="text-lg font-semibold text-white">Editar Componente</h2>
            <Badge variant="outline" className="border-gray-600 text-gray-300">{component.type}</Badge>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-gray-800 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Título</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Digite o título do componente..."
                    required
                    className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descreva a funcionalidade do componente..."
                    rows={3}
                    className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">URL/Link</label>
                  <Input
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    placeholder="https://exemplo.com"
                    type="url"
                    className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="bg-gray-800/70 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="draft" className="text-white">Rascunho</SelectItem>
                      <SelectItem value="active" className="text-white">Ativo</SelectItem>
                      <SelectItem value="test" className="text-white">Teste</SelectItem>
                      <SelectItem value="published" className="text-white">Publicado</SelectItem>
                      <SelectItem value="inactive" className="text-white">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Specs */}
            {isSocialMediaComponent && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    {getPlatformIcon()}
                    Especificações da Plataforma
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Dimensões</label>
                      <p className="text-sm font-mono bg-gray-700 p-2 rounded text-gray-200">
                        {getDimensionsInfo()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Plataforma</label>
                      <p className="text-sm bg-gray-700 p-2 rounded text-gray-200">
                        {component.data.properties?.platform || component.type.split('-')[0]}
                      </p>
                    </div>
                  </div>
                  
                  {component.data.properties?.duration && (
                    <div>
                      <label className="text-sm font-medium text-gray-300">Duração</label>
                      <p className="text-sm bg-gray-700 p-2 rounded text-gray-200">
                        {component.data.properties.duration}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Image Upload */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <ImageIcon className="w-5 h-5" />
                  Imagem do Componente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />

                {formData.image ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-600"
                        onError={(e) => {
                          console.error('Erro ao carregar imagem de preview');
                          e.currentTarget.src = '';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2"
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-800/30">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-sm text-gray-400 mb-4">
                      Adicione uma imagem para representar este componente
                      {isSocialMediaComponent && (
                        <span className="block text-xs text-gray-500 mt-1">
                          Recomendado: {getDimensionsInfo()}
                        </span>
                      )}
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleFileButtonClick}
                      className="inline-flex items-center gap-2 bg-gray-700/70 border-gray-600 text-white hover:bg-gray-600"
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4" />
                      {isUploading ? 'Carregando...' : 'Escolher Imagem'}
                    </Button>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Ou cole uma URL de imagem</label>
                  <Input
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    type="url"
                    disabled={isUploading}
                    className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={isUploading}
                className="bg-gray-700/70 border-gray-600 text-white hover:bg-gray-600"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? 'Processando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
