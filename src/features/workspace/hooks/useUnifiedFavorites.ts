import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { logger } from '../../../lib/logger';

interface FavoriteItem {
  id: string;
  type: 'project' | 'template' | 'component';
  name: string;
  data?: unknown;
  timestamp: number;
}

interface UnifiedFavoritesState {
  favorites: FavoriteItem[];
  loading: boolean;
}

/**
 * Unified Favorites Manager Hook
 * 
 * This hook manages user favorites with localStorage persistence
 * following the custom rules for clean architecture
 */
export const useUnifiedFavorites = () => {
  const { user } = useAuth();
  const currentUserIdRef = useRef<string | null>(null);
  
  const [state, setState] = useState<UnifiedFavoritesState>({
    favorites: [],
    loading: false,
  });

  /**
   * Get storage key for current user
   */
  const getStorageKey = useCallback((userId: string): string => {
    return `favorites_${userId}`;
  }, []);

  /**
   * Load favorites from localStorage
   */
  const loadFavorites = useCallback((): FavoriteItem[] => {
    if (!user?.id) return [];

    try {
      const storageKey = getStorageKey(user.id);
      const stored = localStorage.getItem(storageKey);
      const favorites = stored ? JSON.parse(stored) : [];
      
      // Validate data structure
      const validFavorites = favorites.filter((item: any) => 
        item && typeof item === 'object' && item.id && item.type && item.name
      );

      setState(prev => ({ ...prev, favorites: validFavorites }));
      logger.log('✅ Favorites loaded:', validFavorites.length, 'items');
      
      return validFavorites;
    } catch (error) {
      logger.error('Failed to load favorites:', error);
      setState(prev => ({ ...prev, favorites: [] }));
      return [];
    }
  }, [user?.id, getStorageKey]);

  /**
   * Save favorites to localStorage
   */
  const saveFavorites = useCallback((favorites: FavoriteItem[]): void => {
    if (!user?.id) return;

    try {
      const storageKey = getStorageKey(user.id);
      localStorage.setItem(storageKey, JSON.stringify(favorites));
      logger.log('Favorites saved to localStorage');
    } catch (error) {
      logger.error('Failed to save favorites:', error);
    }
  }, [user?.id, getStorageKey]);

  /**
   * Initialize favorites manager when user changes
   */
  useEffect(() => {
    if (user?.id !== currentUserIdRef.current) {
      if (user?.id) {
        logger.log('User changed, initializing favorites manager for:', user.id);
        currentUserIdRef.current = user.id;
        loadFavorites();
      } else {
        // Only log when actually clearing, not on initial undefined
        if (currentUserIdRef.current) {
          logger.log('User logged out, clearing favorites');
        }
        currentUserIdRef.current = null;
        setState(prev => ({ ...prev, favorites: [] }));
      }
    }
  }, [user?.id, loadFavorites]);

  /**
   * Auto-save when favorites change
   */
  useEffect(() => {
    if (user?.id && state.favorites.length >= 0) {
      saveFavorites(state.favorites);
    }
  }, [state.favorites, user?.id, saveFavorites]);

  /**
   * Add item to favorites
   */
  const addToFavorites = useCallback((item: Omit<FavoriteItem, 'timestamp'>): void => {
    if (!user?.id) {
      logger.warn('Cannot add to favorites: user not authenticated');
      return;
    }

    setState(prev => {
      const exists = prev.favorites.some(fav => fav.id === item.id && fav.type === item.type);
      if (exists) {
        logger.log('Item already in favorites:', item.name);
        return prev;
      }

      const newFavorite: FavoriteItem = {
        ...item,
        timestamp: Date.now(),
      };

      const updatedFavorites = [...prev.favorites, newFavorite];
      logger.log('Added to favorites:', item.name);
      
      return { ...prev, favorites: updatedFavorites };
    });
  }, [user?.id]);

  /**
   * Remove item from favorites
   */
  const removeFromFavorites = useCallback((id: string, type: FavoriteItem['type']): void => {
    if (!user?.id) {
      logger.warn('Cannot remove from favorites: user not authenticated');
      return;
    }

    setState(prev => {
      const updatedFavorites = prev.favorites.filter(
        fav => !(fav.id === id && fav.type === type)
      );
      
      if (updatedFavorites.length !== prev.favorites.length) {
        logger.log('Removed from favorites:', id);
      }
      
      return { ...prev, favorites: updatedFavorites };
    });
  }, [user?.id]);

  /**
   * Check if item is in favorites
   */
  const isFavorite = useCallback((id: string, type: FavoriteItem['type']): boolean => {
    return state.favorites.some(fav => fav.id === id && fav.type === type);
  }, [state.favorites]);

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback((): void => {
    if (!user?.id) return;

    setState(prev => ({ ...prev, favorites: [] }));
    logger.log('All favorites cleared');
  }, [user?.id]);

  /**
   * Get favorites by type
   */
  const getFavoritesByType = useCallback((type: FavoriteItem['type']): FavoriteItem[] => {
    return state.favorites.filter(fav => fav.type === type);
  }, [state.favorites]);

  return {
    // State
    favorites: state.favorites,
    loading: state.loading,

    // Actions
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    loadFavorites,

    // Utilities
    isFavorite,
    getFavoritesByType,
  };
}; 