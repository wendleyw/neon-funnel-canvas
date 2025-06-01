
import React, { useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Canvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { useFunnelProject } from '../hooks/useFunnelProject';
import { ComponentTemplate } from '../types/funnel';
import { toast } from 'sonner';

const Index = () => {
  const {
    project,
    addComponent,
    updateComponent,
    deleteComponent,
    saveProject,
    loadProject,
    exportProject,
    clearProject,
    updateProjectName
  } = useFunnelProject();

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed'));
    }
  }, []);

  const handleDragStart = (template: ComponentTemplate) => {
    console.log('Dragging component:', template.label);
  };

  const handleSave = () => {
    saveProject();
    toast.success('Project saved successfully!');
  };

  const handleLoad = () => {
    // For demo, just show a message
    toast.info('Load functionality would open a project selector');
  };

  const handleExport = () => {
    exportProject();
    toast.success('Project exported successfully!');
  };

  const handleClear = () => {
    clearProject();
    toast.success('Canvas cleared!');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col w-full">
      {/* Toolbar */}
      <Toolbar
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        onClear={handleClear}
        projectName={project.name}
        onProjectNameChange={updateProjectName}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar onDragStart={handleDragStart} />
        
        {/* Canvas */}
        <Canvas
          components={project.components}
          onComponentAdd={addComponent}
          onComponentUpdate={updateComponent}
          onComponentDelete={deleteComponent}
        />
      </div>
      
      {/* Status Bar */}
      <div className="h-8 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-4 text-xs text-gray-400">
        <div>
          Ready • {project.components.length} components • {project.connections.length} connections
        </div>
        <div>
          FunnelCraft v1.0 • PWA Ready
        </div>
      </div>
    </div>
  );
};

export default Index;
