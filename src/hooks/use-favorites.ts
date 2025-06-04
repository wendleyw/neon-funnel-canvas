import { useState, useEffect, useCallback } from 'react';
import { ComponentTemplate } from '../types/funnel';

const FAVORITES_STORAGE_KEY = 'neon-funnel-favorites';

export interface FavoriteItem {
  id: string;
  type: 'source' | 'page' | 'action';
  template: ComponentTemplate;
  addedAt: number;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const addFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action') => {
    const newFavorite: FavoriteItem = {
      id: `${type}-${template.type}`,
      type,
      template,
      addedAt: Date.now()
    };

    setFavorites(prev => {
      // Check if already exists
      if (prev.some(fav => fav.id === newFavorite.id)) {
        return prev;
      }
      return [newFavorite, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action') => {
    const id = `${type}-${template.type}`;
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  }, []);

  const isFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action') => {
    const id = `${type}-${template.type}`;
    return favorites.some(fav => fav.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action') => {
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
    getFavoritesCount
  };
}; 