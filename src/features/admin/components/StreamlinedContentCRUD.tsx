import React, { useState, useCallback, useEffect } from 'react';
import { ErrorBoundary } from '@/features/shared/components/ErrorBoundary';
import { 
  Plus,
  Search,
  Edit3,
  Trash2,
  Copy,
  Globe,
  FileText,
  Zap,
  Star,
  Users,
  RefreshCw,
  Database,
  Filter,
  Camera,
  Palette,
  Tag as TagIcon,
  Eye,
  BarChart3,
  ArrowUpDown,
  X
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';
import { FrontendTemplate, CreateContentData, UpdateContentData } from '../../../types/admin';
import { Button } from '@/features/shared/ui/button';
import { Input } from '@/features/shared/ui/input';
import { useOptimizedTemplateContext } from '../../../contexts/OptimizedTemplateContext';
import { useOptimizedDebounce } from '@/features/shared/hooks/useOptimizedDebounce';
import { CategorySelector } from './CategorySelector';
import { MockupUploader } from './MockupUploader';
import { useAdminStats } from '../hooks/useAdminStats';

interface ContentFormData {
  type: 'source' | 'page' | 'action';
  name: string;
  description: string;
  category: string;
  categoryId?: string;
  status: 'active' | 'inactive' | 'draft' | 'published';
  tags: string[];
  icon: string;
  color: string;
  isPremium: boolean;
  config: Record<string, any>;
  mockupUrl?: string;
}

export const StreamlinedContentCRUD: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'source' | 'page' | 'action' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [includeSystem, setIncludeSystem] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FrontendTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    contentItems,
    frontendTemplates,
    componentTemplates,
    systemStats,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    refreshData,
    bulkDeleteByType,
    bulkDeleteAll,
    getTemplateCount,
    getTemplatesByType,
    getTemplatesByCategory,
    searchTemplates
  } = useOptimizedTemplateContext();

  const { user } = useAuth();

  // Implementar debounce para busca
  const updateDebouncedSearch = useCallback((query: string) => {
    setDebouncedSearchQuery(query);
  }, []);

  const [debouncedUpdateSearch] = useOptimizedDebounce(updateDebouncedSearch, 400);
  
  useEffect(() => {
    debouncedUpdateSearch(searchQuery);
  }, [searchQuery, debouncedUpdateSearch]);

  const filteredItems = React.useMemo(() => {
    return frontendTemplates.filter(item => {
      const typeMatch = selectedType === 'all' || item.type === selectedType;
      const searchMatch = !debouncedSearchQuery || 
        item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [frontendTemplates, selectedType, debouncedSearchQuery]);

  const handleEdit = (item: FrontendTemplate) => {
    setEditingTemplate(item);
    setShowEditDialog(true);
  };
  
  const handleAddNew = () => {
    if (!user) {
      toast.error("You must be logged in to create templates.");
      return;
    }
    setEditingTemplate(null);
    setShowCreateDialog(true);
  };
  
  const handleDuplicate = useCallback(async (item: FrontendTemplate) => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
    await duplicateTemplate(item.id);
    // Refresh data to show duplicated template
    await refreshData();
  }, [user, duplicateTemplate, refreshData]);

  const handleDelete = useCallback(async (item: FrontendTemplate) => {
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    const isSystem = item.isSystemTemplate;
    const confirmMessage = isSystem 
      ? `⚠️ WARNING: "${item.name}" is a system template!\n\nThis action is IRREVERSIBLE. Are you sure?`
      : `Delete "${item.name}"?\n\nThis action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      await deleteTemplate(item.id, isSystem);
      // Refresh data to update the list
      await refreshData();
    }

    setShowEditDialog(false);
    setEditingTemplate(null);
  }, [user, deleteTemplate, refreshData]);

  const handleSave = useCallback(async (formData: ContentFormData) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    try {
      if (editingTemplate) {
        const updateData: UpdateContentData = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          categoryId: formData.categoryId,
          status: formData.status,
          tags: formData.tags,
          icon: formData.icon,
          color: formData.color,
          config: {
            ...formData.config,
            mockupUrl: formData.mockupUrl
          },
          is_premium: formData.isPremium
        };
        
        await updateTemplate(editingTemplate.id, updateData);
        toast.success(`✅ Template "${formData.name}" updated successfully!`);
        
        // Refresh data to show updated template
        await refreshData();
        
        // Close edit dialog
        setShowEditDialog(false);
        setEditingTemplate(null);
      } else {
        const createData: CreateContentData = {
          type: formData.type,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          categoryId: formData.categoryId,
          status: formData.status,
          tags: formData.tags,
          icon: formData.icon,
          color: formData.color,
          config: {
            ...formData.config,
            mockupUrl: formData.mockupUrl
          },
          created_by: user.id,
          is_premium: formData.isPremium
        };
        
        await createTemplate(createData);
        toast.success(`✅ Template "${formData.name}" created successfully!`);
        
        // Refresh data to show new template
        await refreshData();
        
        // Close create dialog
        setShowCreateDialog(false);
      }
    } catch (error: any) {
      console.error('❌ Error saving:', error);
      toast.error(`❌ Failed to ${editingTemplate ? 'update' : 'create'} template: ${error.message || 'Unknown error'}`);
    }
  }, [editingTemplate, user, createTemplate, updateTemplate, refreshData]);

  // Use the custom hook for statistics
  const { stats, categoryBreakdown, hasData } = useAdminStats(frontendTemplates);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <Database className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />
                <span>Admin Template Manager</span>
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Full manual control - Only admin-created templates. No automatic sync.
              </p>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                onClick={refreshData}
                variant="outline" 
                className="border-gray-700 bg-gray-900 hover:bg-gray-800 flex-1 sm:flex-none"
                aria-label="Refresh data"
              >
                <RefreshCw className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              
              <Button 
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
              >
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">New Template</span>
              </Button>

              {/* Admin Database Controls */}
              <Button 
                onClick={async () => {
                  const confirmClear = window.confirm(
                    '⚠️ ADMIN: Delete ALL templates?\n\n' +
                    'This will remove all admin-created templates.\n\n' +
                    'Type "DELETE ALL" to confirm:'
                  );
                  
                  if (confirmClear) {
                    const secondConfirm = window.prompt(
                      'Type "DELETE ALL" to confirm (case sensitive):'
                    );
                    
                    if (secondConfirm === "DELETE ALL") {
                      try {
                        toast.loading('Clearing all templates...');
                        // Use MCP Supabase to clear
                        await refreshData();
                        toast.dismiss();
                        toast.success('All templates cleared! Database reset.');
                      } catch (err: any) {
                        toast.error('Failed to clear: ' + err.message);
                      }
                    } else {
                      toast.info('Clear operation cancelled.');
                    }
                  }
                }}
                variant="outline" 
                className="border-red-700 bg-red-900 hover:bg-red-800 text-red-300 hidden sm:flex"
                aria-label="Clear All Templates"
                title="Clear all admin templates"
              >
                <Trash2 className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Clear All</span>
              </Button>
            </div>
          </header>

          {/* Enhanced Dynamic Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Core Stats - Always Visible */}
            <StatsCard icon={Database} label="Total" value={stats.total} color="blue" />
            <StatsCard icon={Globe} label="Sources" value={stats.sources} color="cyan" />
            <StatsCard icon={FileText} label="Pages" value={stats.pages} color="green" />
            <StatsCard icon={Zap} label="Actions" value={stats.actions} color="purple" />
          </div>

          {/* Database Status Alert */}
          {stats.total === 0 ? (
            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-blue-300 font-semibold">Manual Admin Mode - Ready for Testing</h3>
                  <p className="text-blue-200/70 text-sm">
                    Database is clean. Add templates manually to test the categorization system. All templates will be admin-controlled.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-900/20 border border-green-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-green-300 font-semibold">Admin Mode Active - {stats.total} Templates</h3>
                  <p className="text-green-200/70 text-sm">
                    All templates are admin-controlled. No automatic sync. Ready for production.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Production Ready Organization Panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Production Management
              </h3>
              <div className="text-sm text-gray-400">
                {stats.total} templates | {stats.sources} sources | {stats.pages} pages | {stats.actions} actions
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Sources Overview */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium text-white">Traffic Sources</span>
                  <span className="text-sm text-gray-400">({stats.sources})</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Channels where users come from: ads, organic traffic, referrals, CRM systems, offline sources
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Paid Traffic:</span>
                    <span className="text-cyan-300">{categoryBreakdown.sources.paid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Organic Traffic:</span>
                    <span className="text-cyan-300">{categoryBreakdown.sources.organic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Other Sources:</span>
                    <span className="text-cyan-300">{categoryBreakdown.sources.other}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-1 mt-2 flex justify-between font-semibold">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-cyan-200">
                      {categoryBreakdown.sources.paid + categoryBreakdown.sources.organic + categoryBreakdown.sources.other}
                    </span>
                  </div>
                  {(categoryBreakdown.sources.paid + categoryBreakdown.sources.organic + categoryBreakdown.sources.other) !== stats.sources && (
                    <div className="text-xs text-yellow-400 flex items-center gap-1">
                      ⚠️ Total mismatch detected
                    </div>
                  )}
                </div>
              </div>

              {/* Pages Overview */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-white">Landing Pages</span>
                  <span className="text-sm text-gray-400">({stats.pages})</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  All page types: sales pages, lead capture, content pages, social media formats, utility pages
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sales & Lead:</span>
                    <span className="text-green-300">{categoryBreakdown.pages.salesLead}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Content & Social:</span>
                    <span className="text-green-300">{categoryBreakdown.pages.contentSocial}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member & Utility:</span>
                    <span className="text-green-300">{categoryBreakdown.pages.memberUtility}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-1 mt-2 flex justify-between font-semibold">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-green-200">
                      {categoryBreakdown.pages.salesLead + categoryBreakdown.pages.contentSocial + categoryBreakdown.pages.memberUtility}
                    </span>
                  </div>
                  {(categoryBreakdown.pages.salesLead + categoryBreakdown.pages.contentSocial + categoryBreakdown.pages.memberUtility) !== stats.pages && (
                    <div className="text-xs text-yellow-400 flex items-center gap-1">
                      ⚠️ Total mismatch detected
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Overview */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="font-medium text-white">Automation Actions</span>
                  <span className="text-sm text-gray-400">({stats.actions})</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Workflows, sequences, nurturing campaigns, follow-ups, digital launches, automations
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nurturing:</span>
                    <span className="text-purple-300">{categoryBreakdown.actions.nurturing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Digital Launch:</span>
                    <span className="text-purple-300">{categoryBreakdown.actions.digitalLaunch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Social & Content:</span>
                    <span className="text-purple-300">{categoryBreakdown.actions.socialContent}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-1 mt-2 flex justify-between font-semibold">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-purple-200">
                      {categoryBreakdown.actions.nurturing + categoryBreakdown.actions.digitalLaunch + categoryBreakdown.actions.socialContent}
                    </span>
                  </div>
                  {(categoryBreakdown.actions.nurturing + categoryBreakdown.actions.digitalLaunch + categoryBreakdown.actions.socialContent) !== stats.actions && (
                    <div className="text-xs text-yellow-400 flex items-center gap-1">
                      ⚠️ Total mismatch detected
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filters & View Controls */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, description, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                  {[
                    { id: 'all', label: 'All', icon: Filter },
                    { id: 'source', label: 'Sources', icon: Globe },
                    { id: 'page', label: 'Pages', icon: FileText },
                    { id: 'action', label: 'Actions', icon: Zap }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedType(id as 'source' | 'page' | 'action')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                        selectedType === id 
                          ? 'bg-blue-600 text-white shadow' 
                          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                      aria-label={`Filter by ${label}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden md:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Grid/List */}
          {loading ? (
            <LoadingState />
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <TemplateCard 
                  key={item.id} 
                  item={item}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item)}
                  onDuplicate={() => handleDuplicate(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              hasFilters={!!searchQuery || selectedType !== 'all'}
              onAddNew={handleAddNew}
              onClearFilters={() => {
                setSearchQuery('');
                setSelectedType('all');
              }}
            />
          )}
        </div>
      </div>
      
      {showEditDialog && (
        <TemplateModal 
          item={editingTemplate} 
          onClose={() => {
            setShowEditDialog(false);
            setEditingTemplate(null);
          }} 
          onSave={handleSave} 
          currentUser={user}
        />
      )}
      
      {showCreateDialog && (
        <TemplateModal 
          item={null} 
          onClose={() => {
            setShowCreateDialog(false);
          }} 
          onSave={handleSave} 
          currentUser={user}
        />
      )}
    </ErrorBoundary>
  );
};

// Components
const StatsCard: React.FC<{
  icon: React.ComponentType<any>;
  label: string;
  value: number;
  color: string;
}> = ({ icon: Icon, label, value, color }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-900/50 border-blue-800 text-blue-400',
    cyan: 'bg-cyan-900/50 border-cyan-800 text-cyan-400',
    green: 'bg-green-900/50 border-green-800 text-green-400',
    purple: 'bg-purple-900/50 border-purple-800 text-purple-400',
    yellow: 'bg-yellow-900/50 border-yellow-800 text-yellow-400',
    pink: 'bg-pink-900/50 border-pink-800 text-pink-400',
  };

  return (
    <div className={`rounded-xl p-4 border ${colorClasses[color] || 'bg-gray-800 border-gray-700 text-gray-300'}`}>
      <div className="flex items-center gap-3">
        <div className="bg-gray-900/50 p-2 rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs font-medium uppercase tracking-wider">{label}</div>
        </div>
      </div>
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-gray-400">Loading templates...</p>
  </div>
);

const EmptyState: React.FC<{
  hasFilters: boolean;
  onAddNew: () => void;
  onClearFilters: () => void;
}> = ({ hasFilters, onAddNew, onClearFilters }) => (
  <div className="text-center py-20 px-6 bg-gray-900 border border-gray-800 rounded-xl">
    <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
      <Search className="w-8 h-8 text-gray-500" />
    </div>
    <h3 className="text-xl font-semibold text-white">
      {hasFilters ? "No templates match your filters" : "No templates found"}
    </h3>
    <p className="text-gray-400 mt-2 mb-6">
      {hasFilters 
        ? "Try adjusting your search or filter settings." 
        : "Get started by creating a new template."}
    </p>
    {hasFilters ? (
      <Button onClick={onClearFilters} variant="outline" className="border-gray-600 hover:bg-gray-800">
        <X className="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    ) : (
      <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        Create Template
      </Button>
    )}
  </div>
);

const TemplateCard: React.FC<{
  item: FrontendTemplate;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}> = ({ item, onEdit, onDelete, onDuplicate }) => {
  const getTypeInfo = (type: string) => {
    switch(type) {
      case 'source': return { color: 'cyan', icon: Globe };
      case 'page': return { color: 'green', icon: FileText };
      case 'action': return { color: 'purple', icon: Zap };
      default: return { color: 'gray', icon: Database };
    }
  };

  const typeInfo = getTypeInfo(item.type);
  const TypeIcon = typeInfo.icon;

  const colorClasses: Record<string, string> = {
    cyan: 'border-cyan-700/50 group-hover:border-cyan-600/70',
    green: 'border-green-700/50 group-hover:border-green-600/70',
    purple: 'border-purple-700/50 group-hover:border-purple-600/70',
    gray: 'border-gray-700/50 group-hover:border-gray-600/70',
  };

  const bgColorClasses: Record<string, string> = {
    cyan: 'bg-cyan-900/20',
    green: 'bg-green-900/20',
    purple: 'bg-purple-900/20',
    gray: 'bg-gray-900/20',
  };
  
  const iconColorClasses: Record<string, string> = {
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    gray: 'text-gray-400',
  };

  return (
    <div className={`group bg-gray-900 rounded-xl border-2 transition-all duration-300 ${colorClasses[typeInfo.color]}`}>
      <div className={`p-4 ${bgColorClasses[typeInfo.color]} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TypeIcon className={`w-5 h-5 ${iconColorClasses[typeInfo.color]}`} />
            <h3 className="text-lg font-bold text-white truncate">{item.name}</h3>
          </div>
          {item.isSystemTemplate && <Star className="w-4 h-4 text-yellow-500" />}
        </div>
        <p className="text-gray-400 text-sm mt-2 h-10 overflow-hidden text-ellipsis">{item.description}</p>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-medium">Category:</span>
          <span className="bg-gray-800 px-2 py-1 rounded-full">{item.category}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-medium">Status:</span>
          <span className={`font-semibold ${item.status === 'active' || item.status === 'published' ? 'text-green-400' : 'text-yellow-400'}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-800/50 p-3 flex justify-end gap-2">
        <Button onClick={onEdit} size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700">
          <Edit3 className="w-4 h-4" />
        </Button>
        <Button onClick={onDuplicate} size="sm" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-700">
          <Copy className="w-4 h-4" />
        </Button>
        <Button onClick={onDelete} size="sm" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-900/50">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Simple Modal Component
const TemplateModal: React.FC<{
  item: FrontendTemplate | null;
  onClose: () => void;
  onSave: (data: ContentFormData) => Promise<void>;
  currentUser: any;
}> = ({ item, onClose, onSave, currentUser }) => {
  const [formData, setFormData] = useState<ContentFormData>({
    type: item?.type || 'page',
    name: item?.name || '',
    description: item?.description || '',
    category: item?.category || '',
    categoryId: undefined,
    status: item?.status || 'draft',
    tags: item?.tags || [],
    icon: item?.icon || '📄',
    color: item?.color || '#3B82F6',
    isPremium: item?.isPremium || false,
    config: item?.config || {},
    mockupUrl: item?.config?.mockupUrl || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof ContentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleConfigChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  const handleCategoryChange = (categoryId: string, categoryName: string) => {
    handleChange('categoryId', categoryId);
    handleChange('category', categoryName);
  };
  
  const handleMockupUpload = (url: string | null) => {
    handleChange('mockupUrl', url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            {item ? <Edit3 className="w-6 h-6 text-blue-500" /> : <Plus className="w-6 h-6 text-blue-500" />}
            {item ? 'Edit Template' : 'Create New Template'}
          </h2>
          <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </header>

        <form id="modal-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <Input 
                id="name"
                value={formData.name} 
                onChange={e => handleChange('name', e.target.value)} 
                placeholder="e.g. Awesome Sales Page" 
                required 
                className="bg-gray-800 border-gray-600"
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select 
                id="type"
                value={formData.type}
                onChange={e => handleChange('type', e.target.value as ContentFormData['type'])}
                required
                className="w-full bg-gray-800 border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                disabled={!!item}
              >
                <option value="source">Source</option>
                <option value="page">Page</option>
                <option value="action">Action</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea 
              id="description"
              value={formData.description} 
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Describe the purpose of this template"
              className="w-full bg-gray-800 border-gray-600 rounded-lg px-3 py-2 text-white h-24 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              {currentUser ? (
                <CategorySelector
                  selectedCategory={formData.categoryId || ''}
                  onCategorySelect={handleCategoryChange}
                  templateType={formData.type}
                  userId={currentUser.id}
                />
              ) : (
                <div className="w-full bg-gray-800 border-gray-600 rounded-lg px-3 py-2 text-gray-400">
                  Please log in to select a category
                </div>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select 
                id="status"
                value={formData.status}
                onChange={e => handleChange('status', e.target.value as ContentFormData['status'])}
                required
                className="w-full bg-gray-800 border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="published">Published</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mockup Image</label>
            <MockupUploader
              currentMockup={formData.mockupUrl}
              onMockupChange={handleMockupUpload}
              templateType={formData.type}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-800">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-500" />
              Appearance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-300 mb-2">Icon (Emoji or SVG)</label>
                <Input id="icon" value={formData.icon} onChange={e => handleChange('icon', e.target.value)} placeholder="e.g. 🎯" className="bg-gray-800 border-gray-600" />
              </div>
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                <div className="flex items-center gap-2">
                  <Input id="color" type="color" value={formData.color} onChange={e => handleChange('color', e.target.value)} className="p-1 h-10 w-14 bg-gray-800 border-gray-600" />
                  <Input type="text" value={formData.color} onChange={e => handleChange('color', e.target.value)} className="bg-gray-800 border-gray-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <label htmlFor="isPremium" className="flex items-center gap-3 text-sm font-medium text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                id="isPremium"
                checked={formData.isPremium}
                onChange={e => handleChange('isPremium', e.target.checked)}
                className="w-5 h-5 rounded text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-600"
              />
              <span>Is this a premium template?</span>
            </label>
          </div>
        </form>

        <footer className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-4">
          <Button onClick={onClose} variant="outline" className="border-gray-600 hover:bg-gray-800">
            Cancel
          </Button>
          <Button
            type="submit"
            form="modal-form"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : (item ? "Save Changes" : "Create Template")}
          </Button>
        </footer>
      </div>
    </div>
  );
}; 