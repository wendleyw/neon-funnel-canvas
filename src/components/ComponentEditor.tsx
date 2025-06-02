import React, { useState, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
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
  const [isMaximized, setIsMaximized] = useState(false);

  const {
    image,
    isUploading,
    handleImageUpload,
    handleRemoveImage,
    handleImageUrlChange
  } = useImageUpload({
    initialImage: component.data.image || '',
    onImageChange: (imageUrl) => {
      console.log('Image changed:', imageUrl.length);
    }
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

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
      {/* Enhanced Background overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-lg transition-all duration-300"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      />
      
      {/* Responsive modal container */}
      <div
        className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 lg:p-6"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div 
          className={`relative w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-300 ${
            isMaximized 
              ? 'max-w-none h-[95vh] mx-2 my-2' 
              : 'max-w-5xl max-h-[90vh] sm:max-h-[85vh] lg:max-h-[90vh]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced neon border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-60 blur-xl animate-pulse" />
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          
          {/* Content container */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Enhanced Header with responsive design */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex-shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                    Edit Component
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Customize your component settings</p>
                </div>
                <Badge 
                  variant="outline" 
                  className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors text-xs flex-shrink-0"
                >
                  {component.type}
                </Badge>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="group p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/50 rounded-xl"
                  title={isMaximized ? "Restore" : "Maximize"}
                >
                  {isMaximized ? (
                    <Minimize2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  ) : (
                    <Maximize2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="group p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/50 rounded-xl"
                  title="Close (Esc)"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* Scrollable Content with responsive spacing */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">Basic Information</h3>
                  </div>
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/30">
                    <BasicInfoForm
                      formData={formData}
                      onInputChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Social Media Specs Section */}
                {isSocialMediaComponent && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
                      <h3 className="text-base sm:text-lg font-semibold text-white">Social Media Specifications</h3>
                    </div>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/30">
                      <SocialMediaSpecs component={component} />
                    </div>
                  </div>
                )}

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">Media & Assets</h3>
                  </div>
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/30">
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
                </div>
              </form>
            </div>

            {/* Enhanced Footer Actions with responsive design */}
            <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 p-4 sm:p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={isUploading}
                className="w-full sm:w-auto bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isUploading}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 hover:scale-105"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
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
