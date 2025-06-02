
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { ComponentTemplate } from '../../../types/funnel';
import { toast } from 'sonner';

export const AdminTemplatesManager: React.FC = () => {
  const [customTemplates, setCustomTemplates] = useLocalStorage<ComponentTemplate[]>('custom-templates', []);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ComponentTemplate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    config: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      type: '',
      config: ''
    });
    setIsCreating(false);
    setEditingTemplate(null);
  };

  const handleSave = () => {
    if (!formData.title || !formData.type) {
      toast.error('Título e tipo são obrigatórios');
      return;
    }

    let config;
    try {
      config = formData.config ? JSON.parse(formData.config) : {};
    } catch (error) {
      toast.error('Configuração JSON inválida');
      return;
    }

    const template: ComponentTemplate = {
      id: editingTemplate?.id || `custom-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: formData.type as any,
      config
    };

    if (editingTemplate) {
      setCustomTemplates(prev => 
        prev.map(t => t.id === editingTemplate.id ? template : t)
      );
      toast.success('Template atualizado!');
    } else {
      setCustomTemplates(prev => [...prev, template]);
      toast.success('Template criado!');
    }

    resetForm();
  };

  const handleEdit = (template: ComponentTemplate) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      description: template.description || '',
      category: template.category,
      type: template.type,
      config: JSON.stringify(template.config, null, 2)
    });
    setIsCreating(true);
  };

  const handleDelete = (templateId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      setCustomTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success('Template excluído!');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciador de Templates</CardTitle>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Novo Template
          </Button>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-6 p-4 border rounded-lg space-y-4">
              <h3 className="font-medium">
                {editingTemplate ? 'Editar Template' : 'Criar Novo Template'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="ex: landing-page, form, button"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="ex: Landing Pages, Forms, Social Media"
                />
              </div>
              
              <div>
                <Label htmlFor="config">Configuração (JSON)</Label>
                <Textarea
                  id="config"
                  value={formData.config}
                  onChange={(e) => setFormData(prev => ({ ...prev, config: e.target.value }))}
                  placeholder='{"defaultProps": {}, "customFields": []}'
                  rows={6}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save size={16} />
                  Salvar
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Templates Personalizados ({customTemplates.length})</h4>
            {customTemplates.length === 0 ? (
              <p className="text-gray-500">Nenhum template personalizado criado</p>
            ) : (
              <div className="grid gap-2">
                {customTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h5 className="font-medium">{template.title}</h5>
                      <p className="text-sm text-gray-500">
                        {template.category} • {template.type}
                      </p>
                      {template.description && (
                        <p className="text-sm text-gray-600">{template.description}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(template)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
