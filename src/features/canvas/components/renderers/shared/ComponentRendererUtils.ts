import { Play, Pause, Settings, Zap } from 'lucide-react';

/**
 * ComponentRendererUtils - Shared utilities for component renderers
 * 
 * Following the DRY principle and modularity rules, this utility module
 * provides common functionality used across all component renderers.
 */

export interface StatusInfo {
  color: string;
  icon: React.ComponentType<any>;
  text: string;
}

/**
 * Get standardized status information for components
 */
export const getComponentStatusInfo = (status?: string): StatusInfo => {
  switch (status) {
    case 'active':
      return { color: '#10B981', icon: Play, text: 'Active' };
    case 'inactive':
      return { color: '#F59E0B', icon: Pause, text: 'Inactive' };
    case 'draft':
      return { color: '#6B7280', icon: Settings, text: 'Draft' };
    case 'test':
      return { color: '#8B5CF6', icon: Zap, text: 'Test' };
    case 'published':
      return { color: '#10B981', icon: Play, text: 'Published' };
    default:
      return { color: '#8B5CF6', icon: Zap, text: 'Ready' };
  }
};

/**
 * Generate common CSS classes for component selection states
 */
export const getSelectionClasses = (
  isSelected: boolean,
  canConnect: boolean,
  isConnecting: boolean,
  baseClasses: string = ''
): string => {
  const selectionClasses = [
    baseClasses,
    isSelected ? 'border-blue-500 shadow-blue-500/30 ring-2 ring-blue-500/20' : 'border-gray-700 hover:border-gray-600',
    canConnect ? 'border-green-500 border-4 shadow-green-500/40 animate-pulse' : '',
    isConnecting ? 'ring-2 ring-blue-500/50' : ''
  ];
  
  return selectionClasses.filter(Boolean).join(' ');
};

/**
 * Connection handle classes
 */
export const getConnectionHandleClasses = (): string => {
  return "absolute w-4 h-4 bg-gray-600 border-2 border-gray-400 rounded-full hover:bg-gray-500 transition-colors cursor-pointer";
};

/**
 * Split long text into multiple lines for better display
 * Returns an array of strings instead of JSX
 */
export const splitTextIntoLines = (text: string, maxLength: number = 12): string[] => {
  if (text.length <= maxLength) {
    return [text];
  }
  
  const words = text.split(' ');
  const midPoint = Math.ceil(words.length / 2);
  const firstLine = words.slice(0, midPoint).join(' ');
  const secondLine = words.slice(midPoint).join(' ');
  
  return [firstLine, secondLine].filter(line => line.trim());
};

/**
 * Detect component type from template properties
 */
export const detectComponentType = (template: any): 'source' | 'page' | 'action' => {
  const type = template.type || template.originalType;
  
  // Check if it's explicitly set to one of our target types
  if (template.originalType === 'source' || template.originalType === 'page' || template.originalType === 'action') {
    return template.originalType;
  }
  
  // Map specific component types to our categories
  const sourceTypes = [
    'traffic-source', 'facebook-ads', 'instagram-ads', 'google-ads', 
    'email-marketing', 'sms-marketing', 'organic-social', 'referral',
    'direct-traffic', 'youtube-ads', 'tiktok-ads', 'linkedin-ads'
  ];
  
  const pageTypes = [
    'landing-page', 'sales-page', 'checkout', 'quiz', 'form', 
    'thank-you-page', 'webinar-page', 'video-page', 'survey',
    'opt-in-page', 'squeeze-page', 'bridge-page'
  ];
  
  const actionTypes = [
    'action-sequence', 'webhook', 'api-call', 'email-trigger',
    'sms-trigger', 'tag-action', 'automation', 'integration',
    'custom-code', 'redirect', 'tracking-pixel'
  ];
  
  // Check type against our mappings
  if (sourceTypes.includes(type)) {
    return 'source';
  }
  
  if (pageTypes.includes(type)) {
    return 'page';
  }
  
  if (actionTypes.includes(type)) {
    return 'action';
  }
  
  // Fallback to category-based classification
  if (template.category?.includes('traffic-source') || template.category?.includes('source')) {
    return 'source';
  }
  
  if (template.category?.includes('page')) {
    return 'page';
  }
  
  // Default to action for everything else
  return 'action';
}; 