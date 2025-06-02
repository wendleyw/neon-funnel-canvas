import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';
import { FunnelComponent } from '../types/funnel';
import { BasicInfoForm } from './ComponentEditor/BasicInfoForm';
import { SocialMediaSpecs } from './ComponentEditor/SocialMediaSpecs';
import { ImageUploadSection } from './ComponentEditor/ImageUploadSection';
import { useImageUpload } from '../hooks/useImageUpload';

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
  const [formData, setFormData] = useState({
    title: component.data.title,
    description: component.data.description || '',
    url: component.data.url || '',
    status: component.data.status
  });

  const {
    image,
    isUploading,
    handleImageUpload,
    handleRemoveImage,
    handleImageUrlChange
  } = useImageUpload({
    initialImage: component.data.image || '',
    onImageChange: (imageUrl) => {
      // Image will be saved when form is submitted
      console.log('Image changed:', imageUrl.length);
    }
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Saving data:', { ...formData, image });
    
    onUpdate({
      data: {
        ...component.data,
        title: formData.title,
        description: formData.description,
        url: formData.url,
        status: formData.status,
        image: image
      }
    });
    
    onClose();
  }, [formData, image, component.data, onUpdate, onClose]);

  const isSocialMediaComponent = component.type.includes('instagram-') || 
                                 component.type.includes('youtube-') || 
                                 component.type.includes('tiktok-') ||
                                 component.type.includes('facebook-') ||
                                 component.type.includes('linkedin-') ||
                                 component.type.includes('twitter-');

  const getDimensionsInfo = () => {
    const props = component.data.properties;
    if (props?.dimensions && props?.aspectRatio) {
      return `${props.dimensions} (${props.aspectRatio})`;
    }
    return 'Dimensions not specified';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay with blur - full screen */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      />
      
      {/* Custom modal with blur - full screen */}
      <div
        className="fixed inset-4 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl overflow-y-auto"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Edit Component</h2>
            <Badge variant="outline" className="border-gray-600 text-gray-300">{component.type}</Badge>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-gray-800 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <BasicInfoForm
              formData={formData}
              onInputChange={handleInputChange}
            />

            {/* Social Media Specs */}
            {isSocialMediaComponent && (
              <SocialMediaSpecs component={component} />
            )}

            {/* Image Upload */}
            <ImageUploadSection
              image={image}
              isUploading={isUploading}
              isSocialMediaComponent={isSocialMediaComponent}
              dimensionsInfo={getDimensionsInfo()}
              onImageChange={handleImageUrlChange}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
            />

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={isUploading}
                className="bg-gray-700/70 border-gray-600 text-white hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? 'Processing...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
