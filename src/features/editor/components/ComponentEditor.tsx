
import React, { useRef } from 'react';
import { FunnelComponent } from '@/types/funnel';
import { ComponentEditorHeader } from './ComponentEditor/ComponentEditorHeader';
import { ComponentEditorFooter } from './ComponentEditor/ComponentEditorFooter';
import { ComponentEditorForm } from './ComponentEditor/ComponentEditorForm';
import { useComponentEditor } from '@/features/editor/hooks/useComponentEditor';
import { EditorModalBase } from '@/features/shared/components/shared/EditorModalBase';

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
    handlePreviewFetched,
  } = useComponentEditor({
    component,
    onUpdate,
    onClose,
    isOpen,
    scrollContainerRef,
  });

  return (
    <EditorModalBase
      isOpen={isOpen}
      onClose={onClose}
      isMaximized={isMaximized}
    >
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
        onPreviewFetched={handlePreviewFetched}
      />
      
      <ComponentEditorFooter 
        onClose={onClose} 
        isSaving={isUploading} 
      />
    </EditorModalBase>
  );
};
