
import React from 'react';
import { ComponentTemplate } from '../../../../../types/funnel';

export const renderComponentIcon = (icon: ComponentTemplate['icon']): React.ReactNode => {
  if (typeof icon === 'string') {
    return icon;
  }
  // For React components, we need to render them properly
  if (React.isValidElement(icon)) {
    return icon;
  }
  // Fallback
  return '🔧';
};

export const getIconAsString = (icon: ComponentTemplate['icon']): string => {
  if (typeof icon === 'string') {
    return icon;
  }
  return '🔧';
};

export interface StatusInfo {
  color: string;
  label: string;
}

export const getComponentStatusInfo = (status: string): StatusInfo => {
  switch (status) {
    case 'active':
      return { color: 'bg-green-500', label: 'Active' };
    case 'draft':
      return { color: 'bg-yellow-500', label: 'Draft' };
    case 'inactive':
      return { color: 'bg-red-500', label: 'Inactive' };
    case 'published':
      return { color: 'bg-blue-500', label: 'Published' };
    case 'test':
      return { color: 'bg-purple-500', label: 'Test' };
    case 'paused':
      return { color: 'bg-gray-500', label: 'Paused' };
    default:
      return { color: 'bg-gray-500', label: 'Unknown' };
  }
};

export const getSelectionClasses = (isSelected: boolean, canConnect: boolean): string => {
  let classes = '';
  if (isSelected) {
    classes += ' border-blue-400 shadow-blue-400/20';
  }
  if (canConnect) {
    classes += ' border-green-400 shadow-green-400/30 animate-pulse';
  }
  return classes;
};

export const getConnectionHandleClasses = (position: string): string => {
  const baseClasses = 'w-3 h-3 border-2 border-gray-600 bg-gray-800 rounded-full';
  const positionClasses = {
    top: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2',
    left: 'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2',
    right: 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2'
  };
  
  return `${baseClasses} ${positionClasses[position as keyof typeof positionClasses] || ''}`;
};

export const splitTextIntoLines = (text: string, maxLength: number = 20): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines;
};

export const detectComponentType = (template: ComponentTemplate): 'source' | 'page' | 'action' => {
  const type = template.type.toLowerCase();
  
  // Source components (traffic sources)
  if (type.includes('traffic') || type.includes('source') || type.includes('ad') || 
      type.includes('social') || type.includes('email') || type.includes('seo') ||
      type.includes('organic') || type.includes('referral')) {
    return 'source';
  }
  
  // Page components (landing pages, websites)
  if (type.includes('page') || type.includes('landing') || type.includes('website') ||
      type.includes('blog') || type.includes('article') || type.includes('content')) {
    return 'page';
  }
  
  // Everything else defaults to action (buttons, forms, etc.)
  return 'action';
};
