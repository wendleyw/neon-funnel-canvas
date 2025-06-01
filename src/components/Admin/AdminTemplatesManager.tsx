
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { ReadyTemplate } from '../../types/readyTemplates';
import { readyTemplates } from '../../data/readyTemplates';

export const AdminTemplatesManager: React.FC = () => {
  const [templates, setTemplates] = useState<ReadyTemplate[]>(readyTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTemplateStatus = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isActive: !template.isActive }
        : template
    ));
  };

  const deleteTemplate = (templateId: string) => {
    if (confirm('Tem certeza que deseja deletar este template?')) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    }
  };

  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Ativo" : "Inativo"}
    </Badge>
  );

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800"
    };
    
    const labels = {
      beginner: "Iniciante",
      intermediate: "Intermediário", 
      advanced: "Avançado"
    };

    return (
      <Badge className={colors[difficulty as keyof typeof colors]}>
        {labels[difficulty as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Templates</h1>
          <p className="text-gray-600">Administre os templates prontos disponíveis para os usuários</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="all">Todas as categorias</option>
                <option value="digital-launch">Lançamento Digital</option>
                <option value="lead-generation">Captura de Leads</option>
                <option value="e-commerce">E-commerce</option>
                <option value="webinar">Webinar</option>
                <option value="course">Curso Online</option>
                <option value="coaching">Coaching</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Templates ({filteredTemplates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">Categoria</th>
                  <th className="text-left p-3">Dificuldade</th>
                  <th className="text-left p-3">Componentes</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {template.description}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">
                        {template.category}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {getDifficultyBadge(template.difficulty)}
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{template.components.length} componentes</div>
                        <div className="text-gray-500">{template.connections.length} conexões</div>
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(template.isActive)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toggleTemplateStatus(template.id)}
                        >
                          {template.isActive ? "Desativar" : "Ativar"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum template encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
