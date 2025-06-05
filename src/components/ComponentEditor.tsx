import React, { useRef } from 'react';
// createPortal is now handled by EditorModalBase
import { FunnelComponent } from '../types/funnel';
import { ComponentEditorHeader } from './ComponentEditor/ComponentEditorHeader';
import { ComponentEditorFooter } from './ComponentEditor/ComponentEditorFooter';
import { ComponentEditorForm } from './ComponentEditor/ComponentEditorForm';
import { useComponentEditor } from '../hooks/useComponentEditor';
import { EditorModalBase } from '@/components/shared/EditorModalBase'; // Using path alias based on tsconfig.app.json

interface ComponentEditorProps {
  component: FunnelComponent;
  onUpdate: (updates: Partial<FunnelComponent>) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  onUpdate,
  onClose,
  isOpen
}) => {
  const scrollContainerRef = useRef<HTMLFormElement>(null);

  const {
    formData,
    handleInputChange,
    isMaximized,
    setIsMaximized,
    canScrollUp,
    canScrollDown,
    image,
    isUploading,
    handleImageUpload,
    handleRemoveImage,
    handleImageUrlChange,
    handleSubmitCallback,
    isSocialMediaComponent,
    dimensionsInfo,
  } = useComponentEditor({
    component,
    onUpdate,
    onClose,
    isOpen,
    scrollContainerRef,
  });

  // The isOpen check is now handled by EditorModalBase
  // if (!isOpen) {
  //   return null;
  // }

  // The modal structure is now provided by EditorModalBase
  // The children of EditorModalBase will be the specific editor content
  return (
    <EditorModalBase
      isOpen={isOpen} // Pass isOpen from props (managed by useComponentEditor's args)
      onClose={onClose} // Pass onClose from props
      isMaximized={isMaximized} // Pass isMaximized from useComponentEditor
      // modalClassName can be used here if specific styling for this modal instance is needed beyond defaults
    >
      {/* Content specific to the ComponentEditor */}
      <ComponentEditorHeader 
        componentType={component.type}
        isMaximized={isMaximized}
        onToggleMaximize={() => setIsMaximized(!isMaximized)}
        onClose={onClose} 
      />
      
      <ComponentEditorForm
        component={component}
        formData={formData}
        image={image}
        isUploading={isUploading}
        isSocialMediaComponent={isSocialMediaComponent}
        dimensionsInfo={dimensionsInfo}
        scrollContainerRef={scrollContainerRef}
        canScrollUp={canScrollUp}
        canScrollDown={canScrollDown}
        onFormSubmit={handleSubmitCallback}
        onInputChange={handleInputChange}
        onImageUpload={handleImageUpload}
        onImageChangeForUrlInput={handleImageUrlChange}
        onRemoveImage={handleRemoveImage}
      />
      
      <ComponentEditorFooter 
        onClose={onClose} 
        isSaving={isUploading} 
      />
    </EditorModalBase>
  );
  // The createPortal call is also handled by EditorModalBase
};
