import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, FolderPlus, Tag } from 'lucide-react';
import { categoryService } from '../../../lib/supabase-admin';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  template_type: 'source' | 'page' | 'action';
  color: string;
  icon: string;
  sort_order: number;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
}

interface CategoryManagerProps {
  onCategoryChange: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState<'source' | 'page' | 'action'>('source');
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6',
    icon: 'folder'
  });

  const typeLabels = {
    source: 'Sources',
    page: 'Pages', 
    action: 'Actions'
  };

  const iconOptions = [
    'folder', 'tag', 'star', 'heart', 'zap', 'target', 'gift', 'credit-card',
    'mail', 'search', 'users', 'image', 'shopping-cart', 'layout', 'check-circle',
    'lock', 'file-text', 'rocket', 'repeat', 'trending-up', 'bar-chart', 'more-horizontal'
  ];

  const colorOptions = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280', '#9CA3AF',
    '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#6366F1', '#DC2626'
  ];

  useEffect(() => {
    loadCategories();
  }, [selectedType]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await categoryService.getCategories(selectedType);
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('❌ Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleCreateCategory = async () => {
    try {
      if (!formData.name.trim()) {
        alert('Nome da categoria é obrigatório');
        return;
      }

      const { error } = await categoryService.createCategory({
        ...formData,
        template_type: selectedType,
        created_by: 'current-user-id' // Replace with actual user ID
      });

      if (error) throw error;

      setFormData({ name: '', slug: '', description: '', color: '#3B82F6', icon: 'folder' });
      setShowCreateForm(false);
      loadCategories();
      onCategoryChange();
      
      alert('✅ Categoria criada com sucesso!');
    } catch (error: any) {
      alert(`Erro ao criar categoria: ${error.message}`);
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      const { error } = await categoryService.updateCategory(category.id, {
        name: category.name,
        description: category.description,
        color: category.color,
        icon: category.icon
      });

      if (error) throw error;

      setEditingCategory(null);
      loadCategories();
      onCategoryChange();
      
      alert('✅ Categoria atualizada com sucesso!');
    } catch (error: any) {
      alert(`Erro ao atualizar categoria: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria? Templates associados serão movidos para "Outros".')) {
      return;
    }

    try {
      const { error } = await categoryService.deleteCategory(categoryId);
      if (error) throw error;

      loadCategories();
      onCategoryChange();
      
      alert('✅ Categoria deletada com sucesso!');
    } catch (error: any) {
      alert(`Erro ao deletar categoria: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FolderPlus className="w-5 h-5" />
          Gerenciar Categorias
        </h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      {/* Type Selector */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(typeLabels) as Array<keyof typeof typeLabels>).map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
          <h4 className="text-white font-medium mb-4">Criar Nova Categoria - {typeLabels[selectedType]}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Ex: Tráfego Personalizado"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Slug (gerado automaticamente)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Descrição da categoria..."
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Cor</label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded border-2 ${formData.color === color ? 'border-white' : 'border-gray-600'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Ícone</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateCategory}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Criar
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-gray-400 py-8">Carregando categorias...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Nenhuma categoria encontrada para {typeLabels[selectedType]}
          </div>
        ) : (
          categories.map(category => (
            <div
              key={category.id}
              className="bg-gray-800 border border-gray-600 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <div className="text-white font-medium">{category.name}</div>
                  <div className="text-sm text-gray-400">{category.description}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    {category.slug}
                    {category.is_system && (
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">Sistema</span>
                    )}
                  </div>
                </div>
              </div>
              {!category.is_system && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-gray-400 hover:text-blue-400 p-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-gray-400 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 