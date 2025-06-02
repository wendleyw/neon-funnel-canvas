import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Sparkles } from 'lucide-react';
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
      {/* Background overlay with enhanced blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-lg"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      />
      
      {/* Modern modal with neon design */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div 
          className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Neon border glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-50 blur-xl" />
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          
          {/* Content container */}
          <div className="relative z-10 flex flex-col h-full max-h-[90vh]">
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Edit Component
                  </h2>
                  <p className="text-sm text-gray-400">Customize your component settings</p>
                </div>
                <Badge 
                  variant="outline" 
                  className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
                >
                  {component.type}
                </Badge>
              </div>
              <button
                onClick={onClose}
                className="group p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/50 rounded-xl"
              >
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
                    <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                  </div>
                  <BasicInfoForm
                    formData={formData}
                    onInputChange={handleInputChange}
                  />
                </div>

                {/* Social Media Specs Section */}
                {isSocialMediaComponent && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
                      <h3 className="text-lg font-semibold text-white">Social Media Specifications</h3>
                    </div>
                    <SocialMediaSpecs component={component} />
                  </div>
                )}

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full" />
                    <h3 className="text-lg font-semibold text-white">Media & Assets</h3>
                  </div>
                  <ImageUploadSection
                    image={image}
                    isUploading={isUploading}
                    isSocialMediaComponent={isSocialMediaComponent}
                    dimensionsInfo={getDimensionsInfo()}
                    onImageChange={handleImageUrlChange}
                    onImageUpload={handleImageUpload}
                    onRemoveImage={handleRemoveImage}
                  />
                </div>
              </form>
            </div>

            {/* Enhanced Footer Actions */}
            <div className="flex justify-end items-center gap-3 p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={isUploading}
                className="bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isUploading}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 hover:scale-105"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
