import { useState, useEffect, useCallback } from 'react';
import { ComponentTemplate } from '../types/funnel';

const FAVORITES_STORAGE_KEY = 'neon-funnel-favorites';

export interface FavoriteItem {
  id: string;
  type: 'source' | 'page' | 'action';
  template: ComponentTemplate;
  addedAt: number;
}

interface FavoriteNotification {
  id: string;
  message: string;
  type: 'added' | 'removed';
  timestamp: number;
}

// Função centralizada para gerar IDs consistentes
const generateConsistentId = (template: ComponentTemplate, type: 'source' | 'page' | 'action'): string => {
  // Para garantir consistência, sempre usa o tipo como base
  // e só usa o ID se for um PageTemplate (que tem id próprio)
  const baseId = type === 'page' && template.id ? template.id : template.type;
  return `${type}-${baseId}`;
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [notification, setNotification] = useState<FavoriteNotification | null>(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Verificar se há favoritos com IDs inconsistentes
          const hasInconsistentIds = parsed.some(fav => 
            !fav.id || // Verifica se o ID existe
            !fav.id.match(/^(source|page|action)-[a-zA-Z0-9-_]+$/) // Verifica se o ID corresponde ao formato esperado
          );
          
          if (hasInconsistentIds) {
            // Limpar favoritos inconsistentes
            console.log('[FAVORITES DEBUG] Inconsistent IDs found, clearing favorites from localStorage.');
            localStorage.removeItem(FAVORITES_STORAGE_KEY);
            setFavorites([]);
          } else {
            setFavorites(parsed);
          }
        } else {
          localStorage.removeItem(FAVORITES_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('[FAVORITES DEBUG] Error loading favorites, clearing localStorage:', error);
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
      setFavorites([]); // Garantir que o estado seja limpo em caso de erro de parse
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
    }
  }, [favorites]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = useCallback((message: string, type: 'added' | 'removed') => {
    setNotification({
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now()
    });
  }, []);

  const addFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action') => {
    const id = generateConsistentId(template, type);
    
    const newFavorite: FavoriteItem = {
      id,
      type,
      template,
      addedAt: Date.now()
    };

    setFavorites(prev => {
      // Check if already exists
      if (prev.some(fav => fav.id === newFavorite.id)) {
        return prev;
      }
      showNotification(`Added "${template.label || template.type}" to favorites`, 'added');
      return [newFavorite, ...prev];
    });
  }, [showNotification]);

  const removeFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action') => {
    const id = generateConsistentId(template, type);
    showNotification(`Removed "${template.label || template.type}" from favorites`, 'removed');
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  }, [showNotification]);

  const isFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action') => {
    if (!template || !template.type) {
      console.warn('[FAVORITES DEBUG] isFavorite called with invalid template:', template, type);
      return false;
    }
    const id = generateConsistentId(template, type);
    const isFav = favorites.some(fav => fav.id === id);
    console.log(`[FAVORITES DEBUG] isFavorite check: ID '${id}', Template Label: '${template.label || template.type}', Is Favorite: ${isFav}, Type: ${type}. Current favorites count: ${favorites.length}`);
    return isFav;
  }, [favorites]);

  const toggleFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action') => {
    if (!template || !template.type) {
      console.warn('[FAVORITES DEBUG] toggleFavorite called with invalid template:', template, type);
      return;
    }
    console.log(`[FAVORITES DEBUG] toggleFavorite called for: ID '${generateConsistentId(template, type)}', Label: '${template.label || template.type}', Type: ${type}`);
    if (isFavorite(template, type)) {
      removeFavorite(template, type);
    } else {
      addFavorite(template, type);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  const getFavoritesByType = useCallback((type: 'source' | 'page' | 'action') => {
    return favorites
      .filter(fav => fav.type === type)
      .sort((a, b) => b.addedAt - a.addedAt) // Most recent first
      .map(fav => fav.template);
  }, [favorites]);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const getFavoritesCount = useCallback((type?: 'source' | 'page' | 'action') => {
    if (type) {
      return favorites.filter(fav => fav.type === type).length;
    }
    return favorites.length;
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
    clearAllFavorites,
    getFavoritesCount,
    notification,
    showNotification
  };
}; 