
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { Search, Star, ChevronDown, RotateCcw, Plus, Globe } from 'lucide-react';
import { useFavorites } from '../hooks/use-favorites';
import { useOptimizedTemplateContext } from '../../../contexts/OptimizedTemplateContext';
import { useOptimizedDebounce } from '@/features/shared/hooks/useOptimizedDebounce';
import { ComponentTemplateItem } from '../components/ComponentTemplateItem';

interface SourcesTabProps {
  onDragStart: (e: React.DragEvent, template: ComponentTemplate) => void;
  onTemplateClick?: (template: ComponentTemplate) => void;
  onTemplateSelect: (template: ComponentTemplate) => void;
  onCustomCreate: () => void;
}

const SIDEBAR_SOURCE_CATEGORIES = [
  "paid-traffic",
  "organic-social", 
  "search-content",
  "offline-direct",
  "crm-referral"
];

export const SourcesTab: React.FC<SourcesTabProps> = ({ onDragStart, onTemplateClick, onTemplateSelect, onCustomCreate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['traffic-sources-paid', 'traffic-sources-search']));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const {
    componentTemplates,
    loading,
    getTemplatesByType,
    getTemplatesByCategory
  } = useOptimizedTemplateContext();

  // Implementar debounce estratégico para busca
  const updateDebouncedQuery = useCallback((query: string) => {
    setDebouncedQuery(query);
  }, []);

  const [debouncedUpdateQuery] = useOptimizedDebounce(updateDebouncedQuery, 300);
  
  // Atualizar query com debounce quando searchQuery mudar
  useEffect(() => {
    debouncedUpdateQuery(searchQuery);
  }, [searchQuery, debouncedUpdateQuery]);
  
  const { isFavorite, toggleFavorite, getFavoritesCount } = useFavorites();

  // Filtrar apenas templates do tipo 'source' do Context
  const trafficSourceTemplates = useMemo(() => {
    return componentTemplates.filter(t => 
      // Usar originalType se disponível, caso contrário fallback para categoria
      t.originalType === 'source' ||
      // Fallback: identificar sources por category se originalType não estiver disponível
      (!t.originalType && (
        t.category?.includes('source') || 
        t.category?.includes('traffic') ||
        t.category?.includes('paid') ||
        t.category?.includes('organic') ||
        t.category?.includes('crm') ||
        t.category?.includes('offline') ||
        t.category?.includes('other') ||
        t.type === 'traffic-source' // Baseado no tipo convertido
      ))
    );
  }, [componentTemplates]);

  const favoriteTemplates = useMemo(() => 
    trafficSourceTemplates.filter(template => isFavorite(template, 'source')), 
    [trafficSourceTemplates, isFavorite]
  );

  // Usar busca com debounce para otimizar performance
  const filteredTemplates = useMemo(() => {
    let templates = showFavoritesOnly ? favoriteTemplates : trafficSourceTemplates;

    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      templates = templates.filter(template =>
        (template.name || template.label || '').toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query) ||
        template.category?.toLowerCase().includes(query)
      );
    }

    return templates;
  }, [trafficSourceTemplates, favoriteTemplates, debouncedQuery, showFavoritesOnly]);

  const templatesBySubcategory = useMemo(() => {
    return filteredTemplates.reduce((acc, template) => {
      const category = template.category || 'traffic-sources-other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(template);
      return acc;
    }, {} as Record<string, ComponentTemplate[]>);
  }, [filteredTemplates]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const getCategoryInfo = (category: string) => {
    // Fallback category info se não existir
    const categoryLabels: Record<string, any> = {
      'traffic-sources-paid': { label: 'Paid Traffic', description: 'Paid advertising channels', color: '#3B82F6' },
      'traffic-sources-search': { label: 'Search Traffic', description: 'SEO and search channels', color: '#10B981' },
      'traffic-sources-social': { label: 'Social Media', description: 'Social media platforms', color: '#8B5CF6' },
      'traffic-sources-crm': { label: 'CRM & Email', description: 'Customer relationship management', color: '#F59E0B' },
      'traffic-sources-messaging': { label: 'Messaging', description: 'Direct messaging platforms', color: '#EF4444' },
      'traffic-sources-offline': { label: 'Offline Sources', description: 'Traditional marketing channels', color: '#6B7280' }
    };
    
    return categoryLabels[category] || {
      label: category.replace(/-/g, ' ').replace('traffic sources', '').replace(/\b\w/g, l => l.toUpperCase()).trim(),
      description: 'Custom source category',
      color: '#9CA3AF'
    };
  };

  const handleDragStart = (e: React.DragEvent, template: ComponentTemplate) => onDragStart(e, template);
  
  if (loading) return <div className="p-4 text-center text-gray-400">Loading sources...</div>;

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header with Search and Filters */}
      <div className="p-3 border-b border-neutral-700 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Sources ({filteredTemplates.length})
          </h3>
          <div className="flex items-center gap-2">
            {getFavoritesCount('source') > 0 && (
              <button 
                onClick={() => setShowFavoritesOnly(s => !s)} 
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                  showFavoritesOnly 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                <span>{getFavoritesCount('source')}</span>
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search traffic sources..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-neutral-700 rounded-md text-sm pl-8 pr-4 py-1.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {Object.entries(templatesBySubcategory).map(([category, templates]) => {
          const categoryInfo = getCategoryInfo(category);
          const isExpanded = expandedCategories.has(category);
          
          return (
            <div key={category}>
              <button 
                onClick={() => toggleCategory(category)} 
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">{categoryInfo.label}</span>
                  <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded-full">
                    {templates.length}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              {isExpanded && (
                <div className="pt-2 pl-2 border-l-2 border-gray-800 ml-2 space-y-2">
                  {templates.map(template => (
                    <ComponentTemplateItem
                      key={template.id || template.type}
                      template={template}
                      subtitle={template.category}
                      onDragStart={(e) => handleDragStart(e, template)}
                      isFavorite={isFavorite(template, 'source')}
                      onToggleFavorite={() => toggleFavorite(template, 'source')}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filteredTemplates.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-6">
            {searchQuery ? 'No sources found matching your search.' : 'No source templates available.'}
            <div className="mt-2 text-xs text-gray-600">
              Try importing system templates from the admin panel.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
