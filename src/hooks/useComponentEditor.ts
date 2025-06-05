import { useState, useCallback, useEffect } from 'react';
import { FunnelComponent } from '../types/funnel';
import { useImageUpload } from './useImageUpload';

interface UseComponentEditorArgs {
  component: FunnelComponent;
  onUpdate: (updates: Partial<FunnelComponent>) => void;
  onClose: () => void;
  isOpen: boolean;
  scrollContainerRef: React.RefObject<HTMLFormElement>;
}

export const useComponentEditor = ({
  component,
  onUpdate,
  onClose,
  isOpen,
  scrollContainerRef,
}: UseComponentEditorArgs) => {
  const [formData, setFormData] = useState({
    title: component.data.title,
    description: component.data.description || '',
    url: component.data.url || '',
    status: component.data.status,
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const {
    image,
    isUploading,
    handleImageUpload,
    handleRemoveImage,
    handleImageUrlChange,
  } = useImageUpload({
    initialImage: component.data.image || '',
    onImageChange: (imageUrl) => {
      // This internal callback can be used for side effects if needed within the hook
    },
  });

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setCanScrollUp(scrollTop > 10);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10);
    }
  }, [scrollContainerRef]);

  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      const formElement = scrollContainerRef.current;
      formElement.addEventListener('scroll', checkScroll);
      const timer = setTimeout(checkScroll, 100); // Initial check
      return () => {
        formElement.removeEventListener('scroll', checkScroll);
        clearTimeout(timer);
      };
    }
  }, [isOpen, isMaximized, checkScroll, scrollContainerRef]); // isMaximized can affect layout

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmitCallback = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      data: {
        ...component.data,
        title: formData.title,
        description: formData.description,
        url: formData.url,
        status: formData.status,
        image: image,
      },
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

  const getDimensionsInfo = useCallback(() => {
    const props = component.data.properties;
    if (props?.dimensions && props?.aspectRatio) {
      return `${props.dimensions} (${props.aspectRatio})`;
    }
    return 'Dimensions not specified';
  }, [component.data.properties]);

  // Update formData if the component prop changes (e.g., selecting a different component)
  useEffect(() => {
    setFormData({
      title: component.data.title,
      description: component.data.description || '',
      url: component.data.url || '',
      status: component.data.status,
    });
    // Also reset image from useImageUpload if component changes and has a different image
    // This might require an additional method from useImageUpload or careful state management here
    // For now, useImageUpload re-initializes based on its own initialImage prop when component.data.image changes.
  }, [component]);

  return {
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
    dimensionsInfo: getDimensionsInfo(), // Call the function to get current dimensions info
  };
}; 