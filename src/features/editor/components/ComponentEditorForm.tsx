
import React from 'react';
import { FunnelComponent } from '@/types/funnel';
import { BasicInfoForm } from './BasicInfoForm';
import { SocialMediaSpecs } from './SocialMediaSpecs';
import { ImageUploadSection } from './ImageUploadSection';
import { ChevronDown, ChevronUp } from 'lucide-react';
import UrlPreviewCard, { UrlPreviewData } from '@/features/shared/components/UrlPreviewCard';

interface ComponentEditorFormProps {
  component: FunnelComponent;
  formData: {
    title: string;
    description:string;
    url: string;
    status: string;
  };
  image: string | null;
  isUploading: boolean;
  isSocialMediaComponent: boolean;
  dimensionsInfo: string;
  scrollContainerRef: React.RefObject<HTMLFormElement>;
  canScrollUp: boolean;
  canScrollDown: boolean;
  onFormSubmit: (e: React.FormEvent) => void;
  onInputChange: (field: string, value: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChangeForUrlInput: (url: string) => void;
  onRemoveImage: () => void;
  onPreviewFetched: (previewData: UrlPreviewData | null) => void;
}

export const ComponentEditorForm: React.FC<ComponentEditorFormProps> = ({
  component,
  formData,
  image,
  isUploading,
  isSocialMediaComponent,
  dimensionsInfo,
  scrollContainerRef,
  canScrollUp,
  canScrollDown,
  onFormSubmit,
  onInputChange,
  onImageUpload,
  onImageChangeForUrlInput,
  onRemoveImage,
  onPreviewFetched,
}) => {
  return (
    <div className="flex-1 min-h-0 overflow-hidden relative">
      {/* Scroll indicator at top */}
      {canScrollUp && (
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-800/90 to-transparent z-20 flex items-center justify-center pointer-events-none">
          <ChevronUp className="w-4 h-4 text-cyan-400 animate-bounce" />
        </div>
      )}
      
      <form 
        onSubmit={onFormSubmit}
        className="h-full overflow-y-auto p-3 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50"
        ref={scrollContainerRef}
      >
        <BasicInfoForm 
          formData={formData} 
          onInputChange={onInputChange} 
        />
        
        {formData.url && (
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">URL Preview</h3>
            <UrlPreviewCard
              initialUrl={formData.url}
              onPreviewFetched={onPreviewFetched}
              showUrlInput={false}
              compact={true}
              className="preview-card-dark bg-gray-800/50"
            />
          </div>
        )}

        <ImageUploadSection 
          image={image || ''}
          isUploading={isUploading} 
          onImageUpload={onImageUpload}
          onImageChange={onImageChangeForUrlInput}
          onRemoveImage={onRemoveImage} 
          isSocialMediaComponent={isSocialMediaComponent}
          dimensionsInfo={dimensionsInfo}
          componentType={component.type}
        />

        {isSocialMediaComponent && (
          <SocialMediaSpecs 
            component={component}
          />
        )}

        {component.data.properties && (Object.keys(component.data.properties).length > 0 || isSocialMediaComponent) && (
           <div className="space-y-3 pt-4 border-t border-gray-700/50">
             <h3 className="text-sm font-semibold text-cyan-400">Additional Properties</h3>
             <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
              {isSocialMediaComponent ? 'Social media specific properties are managed above.' : 'This component type does not have specific editable social media properties here.'}
             </div>
            {component.data.properties?.dimensions && (
              <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                <strong>Dimensions:</strong> {dimensionsInfo}
              </div>
            )}
          </div>
        )}
      </form>

      {/* Scroll indicator at bottom */}
      {canScrollDown && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-800/90 to-transparent z-20 flex items-center justify-center pointer-events-none">
          <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
        </div>
      )}
    </div>
  );
};
