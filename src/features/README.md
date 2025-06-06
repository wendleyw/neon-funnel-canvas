# Feature-Based Architecture

This directory contains all application features organized using **Feature-Sliced Design (FSD)** principles. Each feature is self-contained with its own components, hooks, types, and utilities.

## 📁 Directory Structure

```
src/features/
├── admin/              # Admin panel and management features
│   ├── components/     # Admin-specific UI components
│   ├── hooks/          # Admin-specific hooks
│   ├── types/          # Admin-specific TypeScript types
│   └── index.ts        # Feature exports
├── auth/               # Authentication and user management
│   ├── components/     # Auth forms, modals, profile components
│   ├── hooks/          # Auth-related hooks (useProfile, etc.)
│   ├── types/          # Auth-specific types
│   └── index.ts        # Feature exports
├── canvas/             # Canvas, drawing, and diagram functionality
│   ├── components/     # Canvas, nodes, tools, connections
│   ├── hooks/          # Canvas-specific hooks (zoom, pan, etc.)
│   ├── types/          # Canvas-specific types
│   └── index.ts        # Feature exports
├── editor/             # Component and funnel editing
│   ├── components/     # Editors, forms, upload components
│   ├── hooks/          # Editor-specific hooks
│   ├── types/          # Editor-specific types
│   └── index.ts        # Feature exports
├── sidebar/            # Sidebar navigation and content
│   ├── components/     # Sidebar components and menus
│   ├── tabs/           # Sidebar tab components
│   ├── hooks/          # Sidebar-specific hooks
│   ├── types/          # Sidebar-specific types
│   └── index.ts        # Feature exports
├── templates/          # Template management and library
│   ├── components/     # Template components and modals
│   ├── hooks/          # Template-related hooks
│   ├── types/          # Template-specific types
│   └── index.ts        # Feature exports
├── workspace/          # Project and workspace management
│   ├── components/     # Workspace selectors, project cards
│   ├── hooks/          # Workspace and project hooks
│   ├── types/          # Workspace-specific types
│   └── index.ts        # Feature exports
├── shared/             # Shared components, hooks, and utilities
│   ├── ui/             # Generic UI components (shadcn/ui)
│   ├── components/     # Shared application components
│   ├── hooks/          # Shared hooks and utilities
│   ├── types/          # Shared TypeScript types
│   ├── utils/          # Shared utility functions
│   └── index.ts        # Feature exports
└── index.ts            # Main features export file
```

## 🎯 Feature Descriptions

### **Admin** (`/admin`)
Complete admin panel functionality including:
- Content management (CRUD operations)
- Template management
- Category management
- User onboarding
- System configuration

### **Auth** (`/auth`)
Authentication and user management:
- Login/logout functionality
- User profiles
- Authentication modals
- Profile management

### **Canvas** (`/canvas`)
Core canvas and drawing functionality:
- React Flow canvas implementation
- Component nodes and connections
- Drawing tools and controls
- Diagram creation and editing
- Minimap and toolbar

### **Editor** (`/editor`)
Component and content editing:
- Component property editors
- Form builders
- Image upload and management
- Content editing interfaces

### **Sidebar** (`/sidebar`)
Navigation and content organization:
- Modern sidebar implementation
- Tab-based navigation (Sources, Pages, Actions)
- Menu systems and content panels
- Favorites management

### **Templates** (`/templates`)
Template library and management:
- Ready-made templates
- Template creation and editing
- Template categorization
- Template caching and queries

### **Workspace** (`/workspace`)
Project and workspace management:
- Workspace selection and creation
- Project management
- Project persistence and versioning
- Workspace integration

### **Shared** (`/shared`)
Reusable components and utilities:
- UI component library (shadcn/ui)
- Common application components
- Shared hooks and utilities
- Global types and interfaces

## 📦 Import Patterns

### Using Feature Exports
```typescript
// Import entire feature namespace
import { Admin } from '@/features';
const dashboard = <Admin.AdminDashboard />;

// Import specific components
import { AdminDashboard } from '@/features/admin';
import { WorkspaceSelector } from '@/features/workspace';
import { Button } from '@/features/shared/ui';
```

### Direct Component Imports
```typescript
// Direct component imports for better tree-shaking
import { AdminDashboard } from '@/features/admin/components/AdminDashboard';
import { useWorkspace } from '@/features/workspace/hooks/useWorkspace';
import { Button } from '@/features/shared/ui/button';
```

## 🔧 Benefits

### **Improved Organization**
- Clear separation of concerns
- Easy to locate related functionality
- Reduced cognitive load when navigating code

### **Better Scalability**
- Features can be developed independently
- Easy to add new features without affecting existing ones
- Clear boundaries between different parts of the application

### **Enhanced Maintainability**
- Self-contained features with minimal dependencies
- Easier to refactor or remove features
- Clear ownership and responsibility

### **Developer Experience**
- Faster development with clear structure
- Better IDE support and autocomplete
- Easier onboarding for new developers

## 🚀 Best Practices

### **Feature Independence**
- Features should be as self-contained as possible
- Minimize cross-feature dependencies
- Use shared utilities for common functionality

### **Consistent Structure**
- Each feature follows the same directory structure
- Components, hooks, and types are properly organized
- Index files provide clean export interfaces

### **Import Optimization**
- Use direct imports for better tree-shaking
- Avoid circular dependencies
- Keep imports organized and clean

### **Type Safety**
- Define feature-specific types
- Use shared types for common interfaces
- Maintain strong TypeScript coverage

## 📝 Migration Notes

This structure was migrated from a flat `src/components` directory to improve:
- **Code Organization**: From 100+ files in one directory to organized features
- **Developer Experience**: Easier navigation and understanding
- **Maintainability**: Clear boundaries and responsibilities
- **Scalability**: Easy to add new features and functionality

All imports have been updated to use the new structure with `@/features/*` paths. 