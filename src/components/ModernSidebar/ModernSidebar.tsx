import React, { useState, useCallback, useMemo } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { CategorySection } from './CategorySection';
import { ReadyTemplatesModal } from '../ReadyTemplates/ReadyTemplatesModal';
import { ProfileModal } from '../Profile/ProfileModal';
import { ComponentTemplate } from '../../types/funnel';
import { FunnelComponent, Connection } from '../../types/funnel';
import { modernSidebarCategories, searchModernTemplates } from '../../data/modernSidebarCategories';
import { Layers, Library, Search, Compass, Bell } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface ModernSidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
  onAddCompleteTemplate?: (components: FunnelComponent[], connections: Connection[]) => void;
  componentCount?: number;
  connectionCount?: number;
}

const menuItems = [
  { icon: Layers, label: 'Create', id: 'create' },
  { icon: Library, label: 'Library', id: 'library' },
  { icon: Compass, label: 'Explore', id: 'explore' },
  { icon: Search, label: 'Search', id: 'search' },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
];

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  onDragStart,
  onAddCompleteTemplate,
  componentCount = 0,
  connectionCount = 0
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['offer', 'target-audience', 'lead-capture']);
  const [isReadyTemplatesOpen, setIsReadyTemplatesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('create');

  const handleDragStart = useCallback((e: React.DragEvent, template: ComponentTemplate) => {
    console.log('Starting drag for template:', template);
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(template);
  }, [onDragStart]);

  const toggleFavorite = useCallback((templateType: string) => {
    setFavorites(prev => 
      prev.includes(templateType) 
        ? prev.filter(t => t !== templateType)
        : [...prev, templateType]
    );
  }, []);

  const handleReadyTemplateSelect = useCallback((components: FunnelComponent[], connections: Connection[]) => {
    if (onAddCompleteTemplate) {
      onAddCompleteTemplate(components, connections);
    }
  }, [onAddCompleteTemplate]);

  // Filtrar templates baseado na busca
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return modernSidebarCategories;
    }

    const searchResults = searchModernTemplates(searchQuery);
    const filteredCats: typeof modernSidebarCategories = {} as typeof modernSidebarCategories;

    Object.entries(modernSidebarCategories).forEach(([key, category]) => {
      const categoryTemplates = category.templates.filter(template =>
        searchResults.some(result => result.type === template.type)
      );
      
      if (categoryTemplates.length > 0) {
        (filteredCats as any)[key] = {
          ...category,
          templates: categoryTemplates
        };
      }
    });

    return filteredCats;
  }, [searchQuery]);

  // Templates favoritos
  const favoriteTemplates = useMemo(() => {
    const allTemplates = Object.values(modernSidebarCategories).flatMap(cat => cat.templates);
    return allTemplates.filter(template => favorites.includes(template.type));
  }, [favorites]);

  const renderContent = () => {
    switch (activeItem) {
      case 'create':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Campo de busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar componentes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 text-white pl-10 pr-4 py-2 rounded-lg text-sm border border-gray-700 focus:border-gray-500 focus:outline-none"
                />
              </div>

              {/* Seção de Favoritos */}
              {favoriteTemplates.length > 0 && !searchQuery && (
                <CategorySection
                  title="FAVORITOS"
                  icon="⭐"
                  templates={favoriteTemplates}
                  onDragStart={handleDragStart}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  defaultExpanded={true}
                />
              )}

              {/* Categorias */}
              {Object.values(filteredCategories).map((category) => (
                <CategorySection
                  key={category.id}
                  title={category.title}
                  icon={category.icon}
                  templates={category.templates}
                  onDragStart={handleDragStart}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  defaultExpanded={searchQuery.length > 0}
                />
              ))}

              {/* Estado vazio */}
              {Object.keys(filteredCategories).length === 0 && searchQuery && (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-400 text-sm">
                    Nenhum componente encontrado para "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        );

      case 'library':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="text-center py-8">
                <Library className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Templates Prontos</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Explore nossa biblioteca de templates pré-construídos
                </p>
                <button
                  onClick={() => setIsReadyTemplatesOpen(true)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  Ver Templates
                </button>
              </div>
            </div>
          </ScrollArea>
        );

      case 'explore':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="text-center py-8">
                <Compass className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Explorar Comunidade</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Descubra templates criados pela comunidade
                </p>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                  Em Breve
                </button>
              </div>
            </div>
          </ScrollArea>
        );

      case 'search':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Busca Global</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Encontre qualquer componente ou template
                </p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar em toda a plataforma..."
                    className="w-full bg-gray-900 text-white pl-10 pr-4 py-2 rounded-lg text-sm border border-gray-700 focus:border-gray-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        );

      case 'notifications':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">Notificações</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Fique por dentro das novidades
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-800 p-3 rounded-lg text-left">
                    <p className="text-white text-sm font-medium">Novo template disponível</p>
                    <p className="text-gray-400 text-xs">Há 2 horas</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg text-left">
                    <p className="text-white text-sm font-medium">Atualização do sistema</p>
                    <p className="text-gray-400 text-xs">Há 1 dia</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        );

      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="w-80 h-full bg-black flex flex-col">
        {/* Header com logo e email */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-white text-2xl font-bold tracking-wider">Funnel Board</h1>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 mt-4 text-left w-full hover:bg-gray-900/50 p-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">wendleywilson@email.com</span>
          </button>
        </div>

        {/* Menu Principal */}
        <div className="px-4 py-6">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeItem === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-900/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo dinâmico baseado no item ativo */}
        {renderContent()}

        {/* Footer simplificado */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
            <span className="text-sm">Invite friends</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors">
            <span className="text-sm">What's new?</span>
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">2</span>
          </button>
        </div>

        <ReadyTemplatesModal
          isOpen={isReadyTemplatesOpen}
          onClose={() => setIsReadyTemplatesOpen(false)}
          onTemplateSelect={handleReadyTemplateSelect}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
};
