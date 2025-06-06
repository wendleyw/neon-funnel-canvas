import React from 'react';
import { FunnelComponent, ComponentTemplate } from '../../../types/funnel';
import { 
  SourceComponentRenderer, 
  PageComponentRenderer, 
  ActionComponentRenderer,
  detectComponentType 
} from './renderers';

interface ComponentNodeCardSimpleProps {
  component: FunnelComponent;
  template: ComponentTemplate;
  isSelected: boolean;
  isConnecting: boolean;
  canConnect: boolean;
  onEditClick: (e?: React.MouseEvent) => void;
  onDeleteClick: (e?: React.MouseEvent) => void;
  onConnectionClick: (e?: React.MouseEvent) => void;
  onDuplicateClick?: (e?: React.MouseEvent) => void;
}

/**
 * ComponentNodeCardSimple - Main component renderer
 * 
 * This component follows the custom rules for modularity and clear separation of concerns.
 * It delegates rendering to specialized components based on the component type:
 * - Source: Circular design with center title
 * - Page: Longer card (existing design enhanced)
 * - Action: Square design representing a button
 */
export const ComponentNodeCardSimple: React.FC<ComponentNodeCardSimpleProps> = ({
  component,
  template,
  isSelected,
  isConnecting,
  canConnect,
  onEditClick,
  onDeleteClick,
  onConnectionClick,
  onDuplicateClick
}) => {

  const componentType = detectComponentType(template);

  // Common props for all renderers
  const commonProps = {
    component,
    template,
    isSelected,
    isConnecting,
    canConnect,
    onEditClick,
    onDeleteClick,
    onConnectionClick,
    onDuplicateClick
  };

  // Render based on component type
  switch (componentType) {
    case 'source':
      return <SourceComponentRenderer {...commonProps} />;
    
    case 'page':
      return <PageComponentRenderer {...commonProps} />;
    
    case 'action':
      return <ActionComponentRenderer {...commonProps} />;
    
    default:
      // Fallback to action renderer for unknown types
      return <ActionComponentRenderer {...commonProps} />;
  }
};

export default ComponentNodeCardSimple; 