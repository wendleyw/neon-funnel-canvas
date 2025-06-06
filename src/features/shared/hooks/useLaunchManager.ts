import { useState, useCallback } from 'react';
import { LaunchProject, LaunchMetrics, Persona, ProductOffer } from '../types/launch';
import { toast } from 'sonner';

export const useLaunchManager = () => {
  const [projects, setProjects] = useState<LaunchProject[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [offers, setOffers] = useState<ProductOffer[]>([]);
  const [selectedProject, setSelectedProject] = useState<LaunchProject | null>(null);

  // Project Management
  const createProject = useCallback((projectData: Omit<LaunchProject, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: LaunchProject = {
      ...projectData,
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => [...prev, newProject]);
    toast.success('Project created successfully!');
    return newProject;
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<LaunchProject>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    ));

    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
    }

    toast.success('Project updated successfully!');
  }, [selectedProject]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }

    toast.success('Project removed successfully!');
  }, [selectedProject]);

  // Metrics Management
  const updateProjectMetrics = useCallback((projectId: string, metrics: Partial<LaunchMetrics>) => {
    updateProject(projectId, { metrics: { ...projects.find(p => p.id === projectId)?.metrics, ...metrics } as LaunchMetrics });
  }, [projects, updateProject]);

  // Persona Management
  const createPersona = useCallback((personaData: Omit<Persona, 'id'>) => {
    const newPersona: Persona = {
      ...personaData,
      id: `persona-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setPersonas(prev => [...prev, newPersona]);
    toast.success('Persona created successfully!');
    return newPersona;
  }, []);

  const updatePersona = useCallback((personaId: string, updates: Partial<Persona>) => {
    setPersonas(prev => prev.map(persona => 
      persona.id === personaId ? { ...persona, ...updates } : persona
    ));
    toast.success('Persona updated successfully!');
  }, []);

  const deletePersona = useCallback((personaId: string) => {
    setPersonas(prev => prev.filter(persona => persona.id !== personaId));
    toast.success('Persona removed successfully!');
  }, []);

  // Offer Management
  const createOffer = useCallback((offerData: Omit<ProductOffer, 'id'>) => {
    const newOffer: ProductOffer = {
      ...offerData,
      id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setOffers(prev => [...prev, newOffer]);
    toast.success('Offer created successfully!');
    return newOffer;
  }, []);

  const updateOffer = useCallback((offerId: string, updates: Partial<ProductOffer>) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId ? { ...offer, ...updates } : offer
    ));
    toast.success('Offer updated successfully!');
  }, []);

  const deleteOffer = useCallback((offerId: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
    toast.success('Offer removed successfully!');
  }, []);

  // Analytics
  const getProjectAnalytics = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    const completedObjectives = project.objectives.filter(obj => obj.completed).length;
    const completedTasks = project.checklist.filter(task => task.completed).length;
    const totalObjectiveValue = project.objectives.reduce((sum, obj) => sum + obj.targetValue, 0);
    const achievedObjectiveValue = project.objectives
      .filter(obj => obj.completed)
      .reduce((sum, obj) => sum + obj.targetValue, 0);

    return {
      completionRate: project.checklist.length > 0 ? (completedTasks / project.checklist.length) * 100 : 0,
      objectiveCompletionRate: project.objectives.length > 0 ? (completedObjectives / project.objectives.length) * 100 : 0,
      valueCompletionRate: totalObjectiveValue > 0 ? (achievedObjectiveValue / totalObjectiveValue) * 100 : 0,
      metrics: project.metrics
    };
  }, [projects]);

  return {
    // State
    projects,
    personas,
    offers,
    selectedProject,
    
    // Actions
    createProject,
    updateProject,
    deleteProject,
    updateProjectMetrics,
    createPersona,
    updatePersona,
    deletePersona,
    createOffer,
    updateOffer,
    deleteOffer,
    setSelectedProject,
    getProjectAnalytics
  };
};
