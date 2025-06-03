import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Sparkles, Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Check scroll position and update indicators
  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setCanScrollUp(scrollTop > 10);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10);
    }
  }, []);

  // Update scroll indicators when content changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(checkScroll, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMaximized, checkScroll]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
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

  // Early return
  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div 
      className="component-editor-portal"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        pointerEvents: 'auto'
      }}
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-lg transition-all duration-300"
        style={{ 
          zIndex: 999999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      
      {/* Modal container - melhor centralização e dimensionamento */}
      <div
        className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 lg:p-8"
        style={{ 
          zIndex: 1000000,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.stopPropagation();
            onClose();
          }
        }}
      >
        <div 
          className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl backdrop-blur-md transition-all duration-300 ${
            isMaximized 
              ? 'w-[98vw] h-[98vh]' 
              : 'w-full max-w-3xl h-[90vh] max-h-[800px]'
          } flex flex-col`}
          style={{ 
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1000001
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Enhanced neon border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-70 blur-xl animate-pulse" />
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          
          {/* Content container with flex layout */}
          <div className="relative z-10 flex flex-col h-full min-h-0">
            {/* Header - fixed height */}
            <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-t-2xl">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl flex-shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                    Edit Component
                  </h2>
                  <p className="text-xs text-gray-400 hidden sm:block">Customize your component settings</p>
                </div>
                <Badge 
                  variant="outline" 
                  className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors text-xs flex-shrink-0"
                >
                  {component.type}
                </Badge>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMaximized(!isMaximized);
                  }}
                  className="group p-1.5 sm:p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/50 rounded-xl"
                  title={isMaximized ? "Restore" : "Maximize"}
                >
                  {isMaximized ? (
                    <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200" />
                  ) : (
                    <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="group p-1.5 sm:p-2 text-gray-400 hover:text-white transition-all duration-200 hover:bg-gray-700/50 rounded-xl"
                  title="Close (Esc)"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>
            </div>

            {/* Scrollable Content - flex-1 com overflow controlado */}
            <div className="flex-1 min-h-0 overflow-hidden relative">
              {/* Scroll indicator at top */}
              {canScrollUp && (
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-800/90 to-transparent z-20 flex items-center justify-center">
                  <ChevronUp className="w-4 h-4 text-cyan-400 animate-bounce" />
                </div>
              )}
              
              <div 
                ref={scrollContainerRef}
                className="h-full overflow-y-auto p-3 sm:p-4 lg:p-6 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
                onScroll={checkScroll}
              >
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Basic Info Section */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
                      <h3 className="text-sm sm:text-base font-semibold text-white">Basic Information</h3>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/30">
                      <BasicInfoForm
                        formData={formData}
                        onInputChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Social Media Specs Section */}
                  {isSocialMediaComponent && (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
                        <h3 className="text-sm sm:text-base font-semibold text-white">Social Media Specifications</h3>
                      </div>
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/30">
                        <SocialMediaSpecs component={component} />
                      </div>
                    </div>
                  )}

                  {/* Image Upload Section */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full" />
                      <h3 className="text-sm sm:text-base font-semibold text-white">Media & Assets</h3>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700/30">
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

                  {/* Espaço extra para scroll confortável */}
                  <div className="h-4"></div>
                </form>
              </div>

              {/* Scroll indicator at bottom */}
              {canScrollDown && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-800/90 to-transparent z-20 flex items-center justify-center">
                  <ChevronDown className="w-4 h-4 text-purple-400 animate-bounce" />
                </div>
              )}
            </div>

            {/* Footer Actions - fixed height */}
            <div className="flex-shrink-0 flex justify-end items-center gap-2 sm:gap-3 p-3 sm:p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-b-2xl">
              <Button 
                type="button" 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                disabled={isUploading}
                className="bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit(e as any);
                }}
                disabled={isUploading}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 hover:scale-105 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">Processing...</span>
                    <span className="sm:hidden">...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render modal outside of canvas context
  return createPortal(modalContent, document.body);
};
