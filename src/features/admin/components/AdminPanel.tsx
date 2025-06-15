import React, { useState } from 'react';
import { useAdmin, withAdminAccess } from '../../../contexts/AdminContext';
import { useTranslation } from '../../../lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card';
import { Button } from '@/features/shared/ui/button';
import { Input } from '@/features/shared/ui/input';
import { Label } from '@/features/shared/ui/label';
import { Textarea } from '@/features/shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shared/ui/tabs';
import { Badge } from '@/features/shared/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Save,
  X,
  Eye,
  MoreVertical,
  Settings,
  Database,
  Users,
  Activity,
  PanelLeft
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/features/shared/ui/dropdown-menu';

interface FormData {
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'draft' | 'published' | 'test';
  properties: string;
  componentType?: string;
}

const AdminPanelComponent: React.FC = () => {
  const { t } = useTranslation();
  const {
    isAdmin,
    adminUser,
    createItem,
    updateItem,
    deleteItem,
    getItems,
    customSources,
    customPages,
    customActions,
    saving
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'sources' | 'pages' | 'actions'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    icon: '⚙️',
    color: '#6366F1',
    status: 'draft',
    properties: '{}',
    componentType: ''
  });

  // Default categories for each type
  const defaultCategories = {
    source: [
      'traffic-sources-paid',
      'traffic-sources-search', 
      'traffic-sources-social',
      'traffic-sources-messaging',
      'traffic-sources-crm',
      'traffic-sources-offline',
      'traffic-sources-content',
      'traffic-sources-other'
    ],
    page: [
      'lead-capture',
      'sales',
      'social-media',
      'webinar',
      'engagement',
      'booking',
      'content',
      'membership',
      'confirmation',
      'popup'
    ],
    action: [
      'conversion-actions',
      'engagement-actions', 
      'integration-actions',
      'custom-actions',
      'automation-actions',
      'forms-inputs',
      'user-interactions',
      'analytics-tracking'
    ]
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      icon: '⚙️',
      color: '#6366F1',
      status: 'draft',
      properties: '{}',
      componentType: ''
    });
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleEdit = (item: any, type: 'source' | 'page' | 'action') => {
    setEditingItem({ ...item, type });
    setFormData({
      name: item.name || item.label || item.title || '',
      description: item.description || '',
      category: item.category || '',
      icon: item.icon || '⚙️',
      color: item.color || '#6366F1',
      status: item.status || 'draft',
      properties: JSON.stringify(item.properties || {}, null, 2),
      componentType: type === 'source' ? (item.type || '') : ''
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    try {
      const properties = JSON.parse(formData.properties);
      const currentTabType = activeTab as 'sources' | 'pages' | 'actions';

      let singularItemType: 'source' | 'page' | 'action';

      if (currentTabType === 'sources') {
        singularItemType = 'source';
      } else if (currentTabType === 'pages') {
        singularItemType = 'page';
      } else if (currentTabType === 'actions') {
        singularItemType = 'action';
      } else {
        // This case should ideally not be reached if activeTab is one of the item types
        console.error("Invalid tab type for creating item:", currentTabType);
        // Optionally, show an error toast to the user or return early
        return; 
      }

      const itemData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: formData.icon,
        color: formData.color,
        status: formData.status,
        properties: {
          ...properties,
          ...(singularItemType === 'source' && { componentType: formData.componentType })
        }
      };

      if (editingItem) {
        // Ensure singularItemType is also used for updateItem if its signature expects singular
        // For now, assuming updateItem might also need this, but focusing on createItem first.
        // If updateItem uses editingItem.type, ensure that is singular too or adapt.
        await updateItem(editingItem.id, itemData);
      } else {
        await createItem(singularItemType, itemData);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('admin.confirm_delete'))) {
      await deleteItem(id);
    }
  };

  const filterItems = (items: any[], type: string) => {
    return items.filter(item => {
      const matchesSearch = 
        (item.name || item.label || item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { variant: 'default', className: 'bg-green-600' },
      inactive: { variant: 'secondary' },
      draft: { variant: 'outline' },
      published: { variant: 'default', className: 'bg-blue-600' },
      test: { variant: 'default', className: 'bg-yellow-600' }
    };

    const config = variants[status] || variants.draft;
    
    return (
      <Badge {...config}>
        {t(`admin.status.${status}`)}
      </Badge>
    );
  };

  const renderItemsTable = (items: any[], type: 'source' | 'page' | 'action') => {
    const filteredItems = filterItems(items, type);

    return (
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={`Search ${type}s...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-600 bg-slate-700 text-slate-200 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 hover:bg-slate-600"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="test">Test</option>
              </select>
            </div>
          </div>

          <Button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('admin.add_new')} {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700 bg-slate-800 text-slate-300">
                  <tr>
                    <th className="text-left p-4 font-semibold">Name</th>
                    <th className="text-left p-4 font-semibold">Category</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Created</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded flex items-center justify-center text-white text-sm"
                            style={{ backgroundColor: item.color }}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-medium">
                              {item.name || item.label || item.title}
                            </div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(item, type)}>
                              <Edit className="w-4 h-4 mr-2" />
                              {t('common.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t('common.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No {type}s found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCreateForm = () => {
    // Derive singular type from plural activeTab for form logic
    let formItemType: 'source' | 'page' | 'action';
    if (activeTab === 'sources') {
      formItemType = 'source';
    } else if (activeTab === 'pages') {
      formItemType = 'page';
    } else if (activeTab === 'actions') {
      formItemType = 'action';
    } else {
      // Should not happen if form is only shown for item tabs
      return null; 
    }

    const categories = defaultCategories[formItemType] || [];

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {editingItem ? t('admin.edit_item') : t('admin.add_new')} {formItemType.charAt(0).toUpperCase() + formItemType.slice(1)}
            </span>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('admin.forms.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter name..."
              />
            </div>

            {formItemType === 'source' && (
              <div>
                <Label htmlFor="componentType">Component Type</Label>
                <Input
                  id="componentType"
                  value={formData.componentType}
                  onChange={(e) => setFormData(prev => ({ ...prev, componentType: e.target.value }))}
                  placeholder="e.g., facebook-ads, custom-source"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="description">{t('admin.forms.description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">{t('admin.forms.category')}</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="icon">{t('admin.forms.icon')}</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="🔧"
              />
            </div>

            <div>
              <Label htmlFor="color">{t('admin.forms.color')}</Label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">{t('admin.forms.status')}</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="published">Published</option>
                <option value="test">Test</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="properties">{t('admin.forms.properties')} (JSON)</Label>
            <Textarea
              id="properties"
              value={formData.properties}
              onChange={(e) => setFormData(prev => ({ ...prev, properties: e.target.value }))}
              placeholder='{"key": "value"}'
              rows={6}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : t('common.save')}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              {t('common.cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customSources.length}</div>
            <p className="text-xs text-muted-foreground">
              Traffic source templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Pages</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customPages.length}</div>
            <p className="text-xs text-muted-foreground">
              Page templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Actions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customActions.length}</div>
            <p className="text-xs text-muted-foreground">
              User action templates
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>User:</strong> {adminUser?.email}</p>
            <p><strong>Role:</strong> {adminUser?.role}</p>
            <p><strong>Permissions:</strong> {adminUser?.permissions.length} permissions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('admin.access_denied')}</h1>
          <p className="text-gray-400">{t('admin.admin_only')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
        <p className="text-gray-600">Manage sources, pages, and actions</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">{t('admin.dashboard')}</TabsTrigger>
          <TabsTrigger value="sources">{t('admin.manage_sources')}</TabsTrigger>
          <TabsTrigger value="pages">{t('admin.manage_pages')}</TabsTrigger>
          <TabsTrigger value="actions">{t('admin.manage_actions')}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          {renderDashboard()}
        </TabsContent>

        <TabsContent value="sources" className="mt-6">
          {isCreating && renderCreateForm()}
          {renderItemsTable(getItems('source'), 'source')}
        </TabsContent>

        <TabsContent value="pages" className="mt-6">
          {isCreating && renderCreateForm()}
          {renderItemsTable(getItems('page'), 'page')}
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          {isCreating && renderCreateForm()}
          {renderItemsTable(getItems('action'), 'action')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const AdminPanel = withAdminAccess(AdminPanelComponent);
