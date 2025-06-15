import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Tag, Folder, AlertTriangle, Search } from 'lucide-react';
import { categoryService } from '../../../lib/supabase-admin';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

interface CategorySelectorProps {
  templateType: 'source' | 'page' | 'action';
  selectedCategory?: string;
  onCategorySelect: (categoryId: string, categorySlug: string) => void;
  userId: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  templateType,
  selectedCategory,
  onCategorySelect,
  userId
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [similarCategories, setSimilarCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '📁'
  });

  // Load categories for the specific type
  useEffect(() => {
    loadCategories();
  }, [templateType]);

  // Detect similar categories while typing
  useEffect(() => {
    if (newCategoryData.name.trim()) {
      findSimilarCategories(newCategoryData.name);
    } else {
      setSimilarCategories([]);
    }
  }, [newCategoryData.name, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await categoryService.getCategories(templateType);
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      toast.error('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const findSimilarCategories = (name: string) => {
    const normalizedName = name.toLowerCase().trim();
    
    const similar = categories.filter(category => {
      const categoryName = category.name.toLowerCase();
      
      // Check for exact match
      if (categoryName === normalizedName) return true;
      
      // Check for similarity (contains similar words)
      const nameWords = normalizedName.split(/\s+/);
      const categoryWords = categoryName.split(/\s+/);
      
      return nameWords.some(word => 
        word.length > 2 && categoryWords.some(catWord => 
          catWord.includes(word) || word.includes(catWord)
        )
      );
    });

    setSimilarCategories(similar);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (isCreating) {
      return; // Prevent double submission
    }

    // Check for similar categories
    const exactMatch = categories.find(cat => 
      cat.name.toLowerCase() === newCategoryData.name.toLowerCase()
    );

    if (exactMatch) {
      toast.error('A category with this exact name already exists!');
      onCategorySelect(exactMatch.id, exactMatch.slug);
      resetForm();
      return;
    }

    if (similarCategories.length > 0) {
      const shouldContinue = window.confirm(
        `Found ${similarCategories.length} similar categor${similarCategories.length > 1 ? 'ies' : 'y'}:\n\n` +
        similarCategories.map(cat => `• ${cat.name}`).join('\n') +
        `\n\nDo you want to continue creating a new category named "${newCategoryData.name}"?`
      );
      
      if (!shouldContinue) {
        return;
      }
    }

    try {
      setIsCreating(true);
      
      const slug = newCategoryData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      const { data, error } = await categoryService.createCategory({
        name: newCategoryData.name,
        slug: `${templateType}-${slug}`,
        description: newCategoryData.description,
        template_type: templateType,
        color: newCategoryData.color,
        icon: newCategoryData.icon,
        created_by: userId
      });

      if (error) throw error;

      toast.success(`Category "${newCategoryData.name}" created!`);
      
      // Update list first, THEN select the new category
      await loadCategories();
      
      // Only auto-select if the user explicitly created this category
      // Don't auto-select if they just opened the form
      if (data && data.id) {
        onCategorySelect(data.id, data.slug);
      }
      
      resetForm();

    } catch (error: any) {
      console.error('❌ Error creating category:', error);
      if (error.message.includes('Category slug already exists')) {
        toast.error('A category with a similar name already exists. Please use the existing category or choose a different name.');
      } else {
        toast.error('Error creating category: ' + error.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setNewCategoryData({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: '📁'
    });
    setShowNewCategoryForm(false);
    setSimilarCategories([]);
    setSearchTerm('');
    setIsCreating(false);
  };

  const getTypeIcon = () => {
    switch (templateType) {
      case 'source': return '🌐';
      case 'page': return '📄';
      case 'action': return '⚡';
      default: return '📁';
    }
  };

  const getTypeLabel = () => {
    switch (templateType) {
      case 'source': return 'Sources';
      case 'page': return 'Pages';
      case 'action': return 'Actions';
      default: return 'Templates';
    }
  };

  // Filter categories by search
  const filteredCategories = categories.filter(category =>
    !searchTerm || 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
        <div className="h-10 bg-gray-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
          {getTypeIcon()} Category ({getTypeLabel()})
        </label>
        <button
          type="button"
          onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" />
          {showNewCategoryForm ? 'Cancel' : 'New'}
        </button>
      </div>

      {/* Category search */}
      {categories.length > 3 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded px-8 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Existing category selector */}
      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
        {filteredCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategorySelect(category.id, category.slug)}
            className={`p-3 rounded-lg border transition-all text-left ${
              selectedCategory === category.id
                ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                : 'border-gray-600 bg-gray-800 hover:border-gray-500 text-gray-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{category.name}</div>
                {category.description && (
                  <div className="text-xs text-gray-400 truncate mt-1">
                    {category.description}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* New category form */}
      {showNewCategoryForm && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Tag className="w-4 h-4" />
              New Category
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Similar categories alert */}
          {similarCategories.length > 0 && (
            <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-yellow-300 mb-1">
                    Similar categories found:
                  </div>
                  <div className="space-y-1">
                    {similarCategories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          onCategorySelect(cat.id, cat.slug);
                          resetForm();
                        }}
                        className="block text-xs text-yellow-200 hover:text-yellow-100 hover:underline"
                      >
                        • {cat.name} - {cat.description}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-yellow-300 mt-2">
                    Click a category to use it, or continue to create a new one.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryData.name}
                onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isCreating}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Description (optional)"
                value={newCategoryData.description}
                onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isCreating}
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Icon (emoji)"
                  value={newCategoryData.icon}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isCreating}
                />
              </div>
              <div className="w-20">
                <input
                  type="color"
                  value={newCategoryData.color}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 bg-gray-900 border border-gray-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={isCreating || !newCategoryData.name.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Create
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isCreating}
                className="px-3 py-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredCategories.length === 0 && !showNewCategoryForm && (
        <div className="text-center py-6 text-gray-400">
          <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {searchTerm ? 'No categories found' : 'No categories available'}
          </p>
          <button
            type="button"
            onClick={() => setShowNewCategoryForm(true)}
            className="text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors"
          >
            {searchTerm ? 'Create a new category' : 'Create the first category'}
          </button>
        </div>
      )}
    </div>
  );
}; 