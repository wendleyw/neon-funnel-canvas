import React, { useState, useCallback, useMemo } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { CategorySection } from './CategorySection';
import { ReadyTemplatesModal } from '../ReadyTemplates/ReadyTemplatesModal';
import { ProfileModal } from '../Profile/ProfileModal';
import { ComponentTemplate } from '../../types/funnel';
import { useProject } from '../../contexts/ProjectContext';
import { useTemplateCache } from '../../hooks/useTemplateCache';
import { useDebounce } from '../../hooks/useDebounce';
import { modernSidebarCategories } from '../../data/modernSidebarCategories';
import { Layers, Library, Search, Compass, Bell, Sparkles, Crown } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface OptimizedModernSidebarProps {
  onDragStart: (template: ComponentTemplate) => void;
}

const menuItems = [
  { icon: Layers, label: 'Create', id: 'create' },
  { icon: Library, label: 'Library', id: 'library' },
  { icon: Compass, label: 'Explore', id: 'explore' },
  { icon: Sparkles, label: 'Create Custom Funnel', id: 'custom' },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
];

export const OptimizedModernSidebar: React.FC<OptimizedModernSidebarProps> = ({
  onDragStart,
}) => {
  const { state, actions } = useProject();
  const templateCache = useTemplateCache();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['offer', 'target-audience', 'lead-capture']);
  const [isReadyTemplatesOpen, setIsReadyTemplatesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('create');

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

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

  // Optimized search with cache
  const filteredCategories = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return modernSidebarCategories;
    }

    const searchResults = templateCache.search(debouncedSearchQuery);
    const filteredCats = modernSidebarCategories.map(category => {
      const categoryTemplates = category.templates.filter(template =>
        searchResults.some(result => result.type === template.type)
      );
      
      if (categoryTemplates.length > 0) {
        return {
          ...category,
          templates: categoryTemplates
        };
      }
      return null;
    }).filter(Boolean) as typeof modernSidebarCategories;

    return filteredCats;
  }, [debouncedSearchQuery, templateCache]);

  const favoriteTemplates = useMemo(() => {
    return templateCache.all.filter(template => favorites.includes(template.type));
  }, [favorites, templateCache.all]);

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
              {favoriteTemplates.length > 0 && !debouncedSearchQuery && (
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
              {filteredCategories.map((category) => (
                <CategorySection
                  key={category.id}
                  title={category.name}
                  icon={category.icon}
                  templates={category.templates}
                  onDragStart={handleDragStart}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  defaultExpanded={debouncedSearchQuery.length > 0}
                />
              ))}

              {/* Estado vazio */}
              {filteredCategories.length === 0 && debouncedSearchQuery && (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-400 text-sm">
                    Nenhum componente encontrado para "{debouncedSearchQuery}"
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

      case 'custom':
        return (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="text-center py-8">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-black" />
                  </div>
                </div>
                
                <h3 className="text-white text-xl font-bold mb-2">Crie Funnels Personalizados</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Desbloqueie o poder da IA para criar funnels únicos e otimizados para o seu negócio
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>IA avançada para criação de funnels</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Templates ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Análise e otimização automática</span>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Começar Agora - Pro
                </button>
                
                <p className="text-xs text-gray-500 mt-3">
                  7 dias grátis • Cancele quando quiser
                </p>
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
        {/* Header com logo e saudação personalizada */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-white text-2xl font-bold tracking-wider">Funnel Board</h1>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-3 mt-4 text-left w-full hover:bg-gray-900/50 p-2 rounded-lg transition-colors group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">W</span>
            </div>
            <div className="flex-1">
              <span className="text-gray-300 text-sm font-medium block">{getGreeting()}, Wendley!</span>
              <span className="text-gray-500 text-xs">Ver perfil e configurações</span>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        {/* Menu Principal */}
        <div className="px-4 py-6">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors relative ${
                  activeItem === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-900/50'
                } ${item.id === 'custom' ? 'border border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-pink-900/20' : ''}`}
              >
                <item.icon className={`w-5 h-5 ${item.id === 'custom' ? 'text-purple-400' : ''}`} />
                <span className={`font-medium ${item.id === 'custom' ? 'text-purple-200' : ''}`}>
                  {item.label}
                </span>
                {item.id === 'custom' && (
                  <div className="ml-auto">
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo dinâmico baseado no item ativo */}
        {renderContent()}

        {/* Footer com convites e novidades */}
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
          onTemplateSelect={(components, connections) => {
            components.forEach(component => actions.addComponent(component));
            connections.forEach(connection => actions.addConnection(connection));
          }}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
};
