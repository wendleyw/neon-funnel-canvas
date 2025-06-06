import { useState, useEffect, useCallback, useRef } from 'react';
import { ComponentTemplate } from '../../../types/funnel';
import { logger } from '../../../lib/logger';
import { useAuth } from '../../../contexts/AuthContext';

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

interface UnifiedFavoritesState {
  favorites: FavoriteItem[];
  loading: boolean;
  notification: FavoriteNotification | null;
}

/**
 * Generates a consistent ID for template favorites
 * This ensures the same template always gets the same ID
 */
const generateConsistentId = (template: ComponentTemplate, type: 'source' | 'page' | 'action'): string => {
  // Use template properties to create a consistent identifier
  const baseId = template.type || template.label || 'unknown';
  return `${type}-${baseId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
};

/**
 * Unified Favorites Manager Hook
 * 
 * This hook consolidates all favorites functionality following the custom rules:
 * - Single source of truth for favorites state
 * - Clear separation of concerns
 * - Robust error handling with localStorage
 * - Performance optimized with caching
 * - English naming and clear interfaces
 */
export const useUnifiedFavorites = () => {
  const { user } = useAuth();
  
  // Unified state following single responsibility principle
  const [state, setState] = useState<UnifiedFavoritesState>({
    favorites: [],
    loading: false,
    notification: null,
  });

  // Performance optimization with refs
  const initializationRef = useRef({
    isInitialized: false,
    userId: null as string | null,
  });

  /**
   * Update state helper with immutability
   */
  const updateState = useCallback((updates: Partial<UnifiedFavoritesState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Get user-specific storage key
   */
  const getUserStorageKey = useCallback((): string => {
    if (user?.id) {
      return `${FAVORITES_STORAGE_KEY}-${user.id}`;
    }
    return FAVORITES_STORAGE_KEY;
  }, [user?.id]);

  /**
   * Load favorites from localStorage
   */
  const loadFavorites = useCallback((): void => {
    try {
      const storageKey = getUserStorageKey();
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        
        if (Array.isArray(parsed)) {
          // Validate favorites data structure
          const validFavorites = parsed.filter(fav => 
            fav.id && 
            fav.type && 
            fav.template && 
            typeof fav.addedAt === 'number'
          );

          if (validFavorites.length !== parsed.length) {
            logger.warn('Some favorites had invalid structure and were filtered out');
          }

          updateState({ favorites: validFavorites });
          logger.log(`✅ Favorites loaded: ${validFavorites.length} items`);
        } else {
          logger.warn('Invalid favorites format, clearing storage');
          localStorage.removeItem(storageKey);
          updateState({ favorites: [] });
        }
      } else {
        updateState({ favorites: [] });
      }
    } catch (error) {
      logger.error('Failed to load favorites:', error);
      const storageKey = getUserStorageKey();
      localStorage.removeItem(storageKey);
      updateState({ favorites: [] });
    }
  }, [getUserStorageKey, updateState]);

  /**
   * Save favorites to localStorage
   */
  const saveFavorites = useCallback((favorites: FavoriteItem[]): void => {
    try {
      const storageKey = getUserStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(favorites));
      logger.log('Favorites saved to localStorage');
    } catch (error) {
      logger.error('Failed to save favorites:', error);
    }
  }, [getUserStorageKey]);

  /**
   * Initialize or reset when user changes
   */
  useEffect(() => {
    if (user?.id !== initializationRef.current.userId) {
      logger.log('User changed, initializing favorites manager for:', user?.id);
      
      // Reset state
      updateState({
        favorites: [],
        loading: false,
        notification: null,
      });
      
      // Load favorites for the new user
      loadFavorites();
      
      // Update initialization state
      initializationRef.current = {
        isInitialized: true,
        userId: user?.id || null,
      };
    }
  }, [user?.id, updateState, loadFavorites]);

  /**
   * Auto-save favorites when they change
   */
  useEffect(() => {
    if (initializationRef.current.isInitialized && state.favorites.length >= 0) {
      saveFavorites(state.favorites);
    }
  }, [state.favorites, saveFavorites]);

  /**
   * Clear notification after timeout
   */
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        updateState({ notification: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.notification, updateState]);

  /**
   * Show notification helper
   */
  const showNotification = useCallback((message: string, type: 'added' | 'removed') => {
    const notification: FavoriteNotification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now()
    };
    updateState({ notification });
    logger.log('Notification shown:', message);
  }, [updateState]);

  /**
   * Add template to favorites
   */
  const addFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action'): void => {
    if (!template || !template.type) {
      logger.warn('Invalid template provided to addFavorite');
      return;
    }

    const id = generateConsistentId(template, type);
    
    // Check if already exists
    if (state.favorites.some(fav => fav.id === id)) {
      logger.log('Template already in favorites:', id);
      return;
    }

    const newFavorite: FavoriteItem = {
      id,
      type,
      template,
      addedAt: Date.now()
    };

    updateState({
      favorites: [newFavorite, ...state.favorites]
    });

    showNotification(`Added "${template.label || template.type}" to favorites`, 'added');
    logger.log('Favorite added:', id);
  }, [state.favorites, updateState, showNotification]);

  /**
   * Remove template from favorites
   */
  const removeFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action'): void => {
    if (!template || !template.type) {
      logger.warn('Invalid template provided to removeFavorite');
      return;
    }

    const id = generateConsistentId(template, type);
    
    updateState({
      favorites: state.favorites.filter(fav => fav.id !== id)
    });

    showNotification(`Removed "${template.label || template.type}" from favorites`, 'removed');
    logger.log('Favorite removed:', id);
  }, [state.favorites, updateState, showNotification]);

  /**
   * Check if template is in favorites
   */
  const isFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action'): boolean => {
    if (!template || !template.type) {
      return false;
    }
    
    const id = generateConsistentId(template, type);
    return state.favorites.some(fav => fav.id === id);
  }, [state.favorites]);

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback((template: ComponentTemplate, type: 'source' | 'page' | 'action'): void => {
    if (!template || !template.type) {
      logger.warn('Invalid template provided to toggleFavorite');
      return;
    }

    if (isFavorite(template, type)) {
      removeFavorite(template, type);
    } else {
      addFavorite(template, type);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  /**
   * Get favorites by type
   */
  const getFavoritesByType = useCallback((type: 'source' | 'page' | 'action'): ComponentTemplate[] => {
    return state.favorites
      .filter(fav => fav.type === type)
      .sort((a, b) => b.addedAt - a.addedAt) // Most recent first
      .map(fav => fav.template);
  }, [state.favorites]);

  /**
   * Get favorites count
   */
  const getFavoritesCount = useCallback((type?: 'source' | 'page' | 'action'): number => {
    if (type) {
      return state.favorites.filter(fav => fav.type === type).length;
    }
    return state.favorites.length;
  }, [state.favorites]);

  /**
   * Clear all favorites
   */
  const clearAllFavorites = useCallback((): void => {
    updateState({ favorites: [] });
    showNotification('All favorites cleared', 'removed');
    logger.log('All favorites cleared');
  }, [updateState, showNotification]);

  /**
   * Clear favorites by type
   */
  const clearFavoritesByType = useCallback((type: 'source' | 'page' | 'action'): void => {
    updateState({
      favorites: state.favorites.filter(fav => fav.type !== type)
    });
    showNotification(`All ${type} favorites cleared`, 'removed');
    logger.log(`${type} favorites cleared`);
  }, [state.favorites, updateState, showNotification]);

  // Public API following clear interface pattern
  return {
    // State
    favorites: state.favorites,
    loading: state.loading,
    notification: state.notification,
    isInitialized: initializationRef.current.isInitialized,

    // Actions
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    getFavoritesCount,
    clearAllFavorites,
    clearFavoritesByType,

    // Utilities
    loadFavorites,
    showNotification,
  };
}; 