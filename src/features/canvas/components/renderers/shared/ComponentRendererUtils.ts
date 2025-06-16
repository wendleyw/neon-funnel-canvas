
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
