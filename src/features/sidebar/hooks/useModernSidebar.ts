import { useState, useCallback, useMemo } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { modernSidebarCategories, searchModernTemplates } from '../../../data/modernSidebarCategories';

export type SidebarMenuItem = 'create' | 'library' | 'explore' | 'custom' | 'notifications';

export const useModernSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['offer', 'target-audience', 'lead-capture']);
  const [activeItem, setActiveItem] = useState<SidebarMenuItem>('create');
  const [isReadyTemplatesOpen, setIsReadyTemplatesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const toggleFavorite = useCallback((templateType: string) => {
    setFavorites(prev => 
      prev.includes(templateType) 
        ? prev.filter(t => t !== templateType)
        : [...prev, templateType]
    );
  }, []);

  // Filter templates based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return modernSidebarCategories;
    }

    const searchResults = searchModernTemplates(searchQuery);
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
  }, [searchQuery]);

  const favoriteTemplates = useMemo(() => {
    const allTemplates = modernSidebarCategories.flatMap(cat => cat.templates);
    return allTemplates.filter(template => favorites.includes(template.type));
  }, [favorites]);

  return {
    // State
    searchQuery,
    favorites,
    activeItem,
    isReadyTemplatesOpen,
    isProfileOpen,
    filteredCategories,
    favoriteTemplates,
    
    // Actions
    setSearchQuery,
    toggleFavorite,
    setActiveItem,
    setIsReadyTemplatesOpen,
    setIsProfileOpen,
    getGreeting
  };
}; 