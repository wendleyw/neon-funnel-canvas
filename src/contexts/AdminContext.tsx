import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useProfile } from '../features/auth/hooks/useProfile';
import { ComponentTemplate } from '../types/funnel';
import { UserAction } from '../data/userActions';
import { PageTemplate } from '../data/pageTemplates';
import { toast } from 'sonner';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  permissions: string[];
}

export interface CrudItem {
  id: string;
  type: 'source' | 'page' | 'action';
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'draft' | 'published' | 'test';
  properties: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface AdminContextType {
  // User and permissions
  isAdmin: boolean;
  adminUser: AdminUser | null;
  checkPermission: (permission: string) => boolean;
  
  // CRUD operations
  createItem: (type: 'source' | 'page' | 'action', data: Partial<CrudItem>) => Promise<CrudItem>;
  updateItem: (id: string, data: Partial<CrudItem>) => Promise<CrudItem>;
  deleteItem: (id: string) => Promise<boolean>;
  getItems: (type: 'source' | 'page' | 'action') => CrudItem[];
  getItem: (id: string) => CrudItem | null;
  
  // Custom items management
  customSources: ComponentTemplate[];
  customPages: PageTemplate[];
  customActions: UserAction[];
  
  // Loading states
  loading: boolean;
  saving: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const ADMIN_PERMISSIONS = [
  'admin.sources.create',
  'admin.sources.read',
  'admin.sources.update',
  'admin.sources.delete',
  'admin.pages.create',
  'admin.pages.read',
  'admin.pages.update',
  'admin.pages.delete',
  'admin.actions.create',
  'admin.actions.read',
  'admin.actions.update',
  'admin.actions.delete',
  'admin.dashboard',
  'admin.users.manage',
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [customSources, setCustomSources] = useState<ComponentTemplate[]>([]);
  const [customPages, setCustomPages] = useState<PageTemplate[]>([]);
  const [customActions, setCustomActions] = useState<UserAction[]>([]);
  const [customItems, setCustomItems] = useState<CrudItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isAdmin = useMemo(() => adminUser?.role === 'admin', [adminUser]);

  // Initialize admin user
  useEffect(() => {
    if (user && profile) {
      console.log('AdminContext: User object:', JSON.parse(JSON.stringify(user)));
      console.log('AdminContext: Profile object (raw):', profile);
      console.log('AdminContext: Profile object (stringified):', JSON.parse(JSON.stringify(profile)));
      console.log('AdminContext: profile.role directly:', profile.role);

      const userRole = profile.role || 'user';
      console.log('AdminContext: Determined userRole:', userRole);

      const isUserAdminLogic = userRole === 'admin' || user.email === 'admin@example.com';
      console.log('AdminContext: isUserAdminLogic:', isUserAdminLogic);
      
      if (isUserAdminLogic) {
        setAdminUser({
          id: user.id,
          email: user.email || '',
          role: 'admin',
          permissions: ADMIN_PERMISSIONS,
        });
      } else {
        setAdminUser({
          id: user.id,
          email: user.email || '',
          role: 'user',
          permissions: [],
        });
      }
    } else {
      setAdminUser(null);
      console.log('AdminContext: User or Profile is null/undefined.');
    }
  }, [user, profile]);

  // Load custom items from localStorage
  useEffect(() => {
    const loadCustomItems = () => {
      try {
        const sources = localStorage.getItem('admin-custom-sources');
        const pages = localStorage.getItem('admin-custom-pages');
        const actions = localStorage.getItem('admin-custom-actions');
        const items = localStorage.getItem('admin-custom-items');

        if (sources) setCustomSources(JSON.parse(sources));
        if (pages) setCustomPages(JSON.parse(pages));
        if (actions) setCustomActions(JSON.parse(actions));
        if (items) setCustomItems(JSON.parse(items));
      } catch (error) {
        console.error('Error loading custom items:', error);
      }
    };

    loadCustomItems();
  }, []);

  // Save to localStorage
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Check permission
  const checkPermission = (permission: string): boolean => {
    if (!adminUser) return false;
    return adminUser.permissions.includes(permission) || adminUser.role === 'admin';
  };

  // Create item
  const createItem = async (type: 'source' | 'page' | 'action', data: Partial<CrudItem>): Promise<CrudItem> => {
    if (!checkPermission(`admin.${type}s.create`)) {
      throw new Error('Permission denied');
    }

    setSaving(true);
    try {
      const newItem: CrudItem = {
        id: `custom-${type}-${Date.now()}`,
        type,
        name: data.name || 'New Item',
        description: data.description || '',
        category: data.category || 'custom',
        icon: data.icon || '⚙️',
        color: data.color || '#6366F1',
        status: data.status || 'draft',
        properties: data.properties || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: adminUser?.id || '',
      };

      const updatedItems = [...customItems, newItem];
      setCustomItems(updatedItems);
      saveToStorage('admin-custom-items', updatedItems);

      console.log(`AdminContext: createItem - entering type-specific logic for type: ${type}`);

      // Also save to specific type arrays for backward compatibility
      if (type === 'source') {
        console.log('AdminContext: createItem - in source block');
        const template: ComponentTemplate = {
          id: newItem.id,
          type: data.properties?.componentType || 'custom',
          icon: newItem.icon,
          label: newItem.name,
          color: newItem.color,
          category: newItem.category,
          title: newItem.name,
          description: newItem.description,
          defaultProps: {
            title: newItem.name,
            description: newItem.description,
            status: newItem.status as any,
            properties: newItem.properties,
          },
        };
        
        const updatedSources = [...customSources, template];
        console.log('AdminContext: createItem - before setCustomSources', updatedSources);
        setCustomSources(updatedSources);
        console.log('AdminContext: customSources after update', updatedSources);
        saveToStorage('admin-custom-sources', updatedSources);
      } else if (type === 'page') {
        console.log('AdminContext: createItem - in page block');
        const pageTemplate: PageTemplate = {
          id: newItem.id,
          label: newItem.name,
          description: newItem.description,
          category: newItem.category,
          previewUrl: newItem.properties?.previewUrl || '', 
          type: newItem.properties?.templateType || 'custom-page-template', 
          color: newItem.color,
          tags: newItem.properties?.tags || [],
        };
        const updatedPages = [...customPages, pageTemplate];
        console.log('AdminContext: createItem - before setCustomPages', updatedPages);
        setCustomPages(updatedPages);
        console.log('AdminContext: customPages after update', updatedPages);
        saveToStorage('admin-custom-pages', updatedPages);
      } else if (type === 'action') {
        console.log('AdminContext: createItem - in action block');
        const actionItem: UserAction = {
          id: newItem.id,
          type: newItem.properties?.actionComponentType || 'custom-user-action',
          icon: newItem.icon,
          label: newItem.name, 
          color: newItem.color,
          category: newItem.category,
          title: newItem.name, 
          description: newItem.description,
          defaultProps: {
            title: newItem.name,
            description: newItem.description,
            status: newItem.status as any,
            properties: newItem.properties,
          },
          actionType: newItem.properties?.actionType || 'custom',
          userFriendlyName: newItem.name,
          iconEmoji: newItem.properties?.iconEmoji || newItem.icon,
        };
        const updatedActions = [...customActions, actionItem];
        console.log('AdminContext: createItem - before setCustomActions', updatedActions);
        setCustomActions(updatedActions);
        console.log('AdminContext: customActions after update', updatedActions);
        saveToStorage('admin-custom-actions', updatedActions);
      }

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully`);
      return newItem;
    } catch (error) {
      toast.error('Error creating item');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Update item
  const updateItem = async (id: string, data: Partial<CrudItem>): Promise<CrudItem> => {
    const item = customItems.find(i => i.id === id);
    if (!item) throw new Error('Item not found');

    if (!checkPermission(`admin.${item.type}s.update`)) {
      throw new Error('Permission denied');
    }

    setSaving(true);
    try {
      const updatedItem: CrudItem = {
        ...item,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      const updatedItems = customItems.map(i => i.id === id ? updatedItem : i);
      setCustomItems(updatedItems);
      saveToStorage('admin-custom-items', updatedItems);

      // Update specific type arrays
      if (item.type === 'source') {
        const updatedSources = customSources.map(s => {
          if (s.id === id) {
            return {
              ...s,
              label: updatedItem.name,
              title: updatedItem.name,
              description: updatedItem.description,
              category: updatedItem.category,
              icon: updatedItem.icon,
              color: updatedItem.color,
              defaultProps: {
                ...s.defaultProps,
                title: updatedItem.name,
                description: updatedItem.description,
                status: updatedItem.status as any,
                properties: updatedItem.properties,
              },
            };
          }
          return s;
        });
        setCustomSources(updatedSources);
        saveToStorage('admin-custom-sources', updatedSources);
      } else if (item.type === 'page') {
        const updatedPages = customPages.map(p => {
          if (p.id === id) {
            return {
              ...p,
              label: updatedItem.name,
              description: updatedItem.description,
              category: updatedItem.category,
              previewUrl: updatedItem.properties?.previewUrl || p.previewUrl || '',
              type: updatedItem.properties?.templateType || p.type || 'custom-page-template',
              color: updatedItem.color,
              tags: updatedItem.properties?.tags || p.tags || [],
            } as PageTemplate;
          }
          return p;
        });
        setCustomPages(updatedPages);
        saveToStorage('admin-custom-pages', updatedPages);
      } else if (item.type === 'action') {
        const updatedActions = customActions.map(a => {
          if (a.id === id) {
            return {
              ...a,
              id: updatedItem.id,
              type: updatedItem.properties?.actionComponentType || a.type || 'custom-user-action',
              icon: updatedItem.icon,
              label: updatedItem.name,
              color: updatedItem.color,
              category: updatedItem.category,
              title: updatedItem.name,
              description: updatedItem.description,
              defaultProps: {
                ...(a.defaultProps || {}),
                title: updatedItem.name,
                description: updatedItem.description,
                status: updatedItem.status as any,
                properties: updatedItem.properties,
              },
              actionType: updatedItem.properties?.actionType || a.actionType || 'custom',
              userFriendlyName: updatedItem.name,
              iconEmoji: updatedItem.properties?.iconEmoji || a.iconEmoji || updatedItem.icon,
            } as UserAction;
          }
          return a;
        });
        setCustomActions(updatedActions);
        saveToStorage('admin-custom-actions', updatedActions);
      }

      toast.success(`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} updated successfully`);
      return updatedItem;
    } catch (error) {
      toast.error('Error updating item');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Delete item
  const deleteItem = async (id: string): Promise<boolean> => {
    const item = customItems.find(i => i.id === id);
    if (!item) throw new Error('Item not found');

    if (!checkPermission(`admin.${item.type}s.delete`)) {
      throw new Error('Permission denied');
    }

    setSaving(true);
    try {
      const updatedItems = customItems.filter(i => i.id !== id);
      setCustomItems(updatedItems);
      saveToStorage('admin-custom-items', updatedItems);

      // Remove from specific type arrays
      if (item.type === 'source') {
        const updatedSources = customSources.filter(s => s.id !== id);
        setCustomSources(updatedSources);
        saveToStorage('admin-custom-sources', updatedSources);
      } else if (item.type === 'page') {
        const updatedPages = customPages.filter(p => p.id !== id);
        setCustomPages(updatedPages);
        saveToStorage('admin-custom-pages', updatedPages);
      } else if (item.type === 'action') {
        const updatedActions = customActions.filter(a => a.id !== id);
        setCustomActions(updatedActions);
        saveToStorage('admin-custom-actions', updatedActions);
      }

      toast.success(`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} deleted successfully`);
      return true;
    } catch (error) {
      toast.error('Error deleting item');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Get items by type
  const getItems = (type: 'source' | 'page' | 'action'): CrudItem[] => {
    return customItems.filter(item => item.type === type);
  };

  // Get single item
  const getItem = (id: string): CrudItem | null => {
    return customItems.find(item => item.id === id) || null;
  };

  const value = useMemo(() => ({
    isAdmin,
    adminUser,
    checkPermission,
    createItem,
    updateItem,
    deleteItem,
    getItems,
    getItem,
    customSources,
    customPages,
    customActions,
    loading,
    saving,
  }), [
    isAdmin, adminUser, checkPermission, createItem, updateItem, deleteItem, getItems, getItem, 
    customSources, customPages, customActions, loading, saving
  ]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

// Higher-order component for admin-only routes
export const withAdminAccess = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAdmin } = useAdmin();
    
    if (!isAdmin) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-400">This area is restricted to administrators only.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}; 