# Contributing to Neon Funnel Canvas

Thank you for your interest in contributing to Neon Funnel Canvas! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/neon-funnel-canvas.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Start development server: `npm run dev`

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use Tailwind CSS for styling
- Write meaningful commit messages

### Component Structure
```typescript
// Example component structure
interface ComponentProps {
  // Define all props with types
}

export const MyComponent: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
};
```

### File Organization
- Components in `src/components/`
- Contexts in `src/contexts/`
- Hooks in `src/hooks/`
- Types in `src/types/`
- Utilities in `src/lib/`

## 🧪 Testing

### Before Submitting
- [ ] Test your changes locally
- [ ] Verify admin panel functionality
- [ ] Check template creation/editing
- [ ] Ensure responsive design
- [ ] Validate TypeScript compilation

### Manual Testing Checklist
- [ ] Canvas drag and drop works
- [ ] Template editor functions properly
- [ ] Admin panel CRUD operations
- [ ] Image upload and preview
- [ ] Authentication flow

## 📝 Pull Request Process

### 1. Prepare Your Changes
- Ensure your code follows the style guide
- Add/update tests if applicable
- Update documentation if needed

### 2. Commit Guidelines
Use conventional commits format:
```
feat: add new template editor feature
fix: resolve canvas zoom issue
docs: update API documentation
style: improve component styling
refactor: reorganize admin context
```

### 3. Submit Pull Request
- Provide clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Wait for review and address feedback

## 🐛 Bug Reports

### Before Reporting
- Check if the issue already exists
- Try to reproduce the bug
- Gather relevant information

### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Firefox]
- Version: [e.g. 22]
```

## ✨ Feature Requests

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this be implemented?

**Alternatives**
Other solutions you've considered.

**Additional Context**
Any other relevant information.
```

## 🏗️ Architecture Overview

### Key Technologies
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Supabase**: Backend
- **React Flow**: Canvas system

### Important Contexts
- `TemplateContext`: Template state management
- `AuthContext`: User authentication
- `AdminContext`: Admin functionality
- `WorkspaceContext`: Workspace management

### Component Hierarchy
```
App
├── AuthProvider
├── AdminProvider
├── TemplateProvider
├── WorkspaceProvider
└── Main Components
```

## 🔒 Security Guidelines

### Data Handling
- Never expose sensitive credentials
- Validate all user inputs
- Use proper authentication checks
- Follow Supabase RLS policies

### Admin Features
- Admin-only components should check permissions
- Use proper error handling
- Log admin actions appropriately

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Flow](https://reactflow.dev/)

### Project Resources
- [Issue Tracker](https://github.com/your-username/neon-funnel-canvas/issues)
- [Discussions](https://github.com/your-username/neon-funnel-canvas/discussions)
- [Project Board](https://github.com/your-username/neon-funnel-canvas/projects)

## 🤝 Community

### Code of Conduct
- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow project guidelines

### Getting Help
- Check existing documentation
- Search through issues
- Ask in discussions
- Join our community chat

## 📈 Development Roadmap

### Current Focus
- Template management improvements
- Performance optimizations
- Mobile responsiveness
- User experience enhancements

### Future Features
- Real-time collaboration
- Advanced analytics
- Template marketplace
- API integrations

Thank you for contributing to Neon Funnel Canvas! 🎉 