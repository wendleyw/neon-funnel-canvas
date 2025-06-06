import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/features/shared/ui/dialog';
import { Button } from '@/features/shared/ui/button';
import { Input } from '@/features/shared/ui/input';
import { Badge } from '@/features/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shared/ui/tabs';
import { Search, Download, Star, Clock, Users } from 'lucide-react';
import { useReadyTemplates } from '../hooks/useReadyTemplates';
import { templateCategories } from '../../../data/readyTemplates';
import { ReadyTemplate } from '../../../types/readyTemplates';
import { FunnelComponent, Connection } from '../../../types/funnel';

interface ReadyTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (components: FunnelComponent[], connections: Connection[]) => void;
}

export const ReadyTemplatesModal: React.FC<ReadyTemplatesModalProps> = ({
  isOpen,
  onClose,
  onTemplateSelect
}) => {
  const { templates, duplicateTemplate, getTemplatesByCategory, searchTemplates } = useReadyTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = searchQuery 
    ? searchTemplates(searchQuery)
    : selectedCategory === 'all' 
      ? templates 
      : getTemplatesByCategory(selectedCategory);

  const handleTemplateSelect = (template: ReadyTemplate) => {
    const { components, connections } = duplicateTemplate(template);
    onTemplateSelect(components, connections);
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Templates Prontos
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {templateCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {/* Template Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <div className="ml-2">
                        {templateCategories.find(c => c.id === template.category)?.icon}
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {template.components.length} componentes
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.connections.length} conexões
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getDifficultyColor(template.difficulty)}`}
                      >
                        {getDifficultyLabel(template.difficulty)}
                      </Badge>
                      {template.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateSelect(template);
                      }}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Usar Template
                    </Button>
                  </div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum template encontrado</p>
                  {searchQuery && (
                    <p className="text-sm mt-1">
                      Tente buscar por outros termos ou selecione uma categoria diferente
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
