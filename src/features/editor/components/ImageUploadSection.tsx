import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card';
import { Button } from '@/features/shared/ui/button';
import { Input } from '@/features/shared/ui/input';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadSectionProps {
  image: string;
  isUploading: boolean;
  isSocialMediaComponent: boolean;
  dimensionsInfo: string;
  onImageChange: (image: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  componentType?: string; // Add component type to determine if auto-scroll should be enabled
}

// Auto-scroll preview component for the editor
const AutoScrollPreview: React.FC<{ src: string; alt: string; componentType?: string }> = ({ src, alt, componentType }) => {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Check if this is a page-type component that should have auto-scroll
  const isPageComponent = React.useMemo(() => {
    if (!componentType) return false;
    const pageTypes = [
      'landing-page', 'sales-page', 'opt-in-page', 'download-page', 
      'thank-you-page', 'webinar-live', 'webinar-replay', 'checkout',
      'member-area', 'blog-page', 'members-page'
    ];
    return pageTypes.includes(componentType);
  }, [componentType]);

  // Auto-scroll effect for page components
  React.useEffect(() => {
    if (!isPageComponent || !isImageLoaded || !imageRef.current || !containerRef.current) {
      return;
    }

    const image = imageRef.current;
    const container = containerRef.current;
    let animationId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const elapsed = timestamp - startTime;
      const duration = 5000; // 5 seconds
      const progress = (elapsed % duration) / duration;
      
      // Calculate scroll position (from top to bottom)
      const imageHeight = image.naturalHeight;
      const containerHeight = container.clientHeight;
      
      if (imageHeight > containerHeight) {
        const maxScroll = imageHeight - containerHeight;
        const scrollPosition = progress * maxScroll;
        
        // Apply smooth scrolling transform
        image.style.transform = `translateY(-${scrollPosition}px)`;
        image.style.transition = elapsed < 100 ? 'none' : 'transform 0.1s ease-out';
      }
      
      animationId = requestAnimationFrame(animate);
    };

    // Start animation after a short delay
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 1000);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      clearTimeout(timeoutId);
    };
  }, [isImageLoaded, isPageComponent]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Error loading preview image');
    e.currentTarget.src = '';
  };

  return (
    <div ref={containerRef} className="w-full h-48 relative overflow-hidden rounded-lg border border-gray-600">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full min-h-full object-cover object-top"
        style={{
          transformOrigin: 'top left'
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      {isPageComponent && isImageLoaded && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          Auto-scroll preview
        </div>
      )}
    </div>
  );
};

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  image,
  isUploading,
  isSocialMediaComponent,
  dimensionsInfo,
  onImageChange,
  onImageUpload,
  onRemoveImage,
  componentType
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    console.log('Upload button clicked');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-white">
          <ImageIcon className="w-5 h-5" />
          Component Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
          disabled={isUploading}
        />

        {image ? (
          <div className="space-y-3">
            <div className="relative">
              <AutoScrollPreview
                src={image}
                alt="Preview"
                componentType={componentType}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onRemoveImage}
                className="absolute top-2 right-2"
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center bg-gray-800/30">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-sm text-gray-400 mb-4">
              Add an image to represent this component
              {isSocialMediaComponent && (
                <span className="block text-xs text-gray-500 mt-1">
                  Recommended: {dimensionsInfo}
                </span>
              )}
            </p>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleFileButtonClick}
              className="inline-flex items-center gap-2 bg-gray-700/70 border-gray-600 text-white hover:bg-gray-600"
              disabled={isUploading}
            >
              <Upload className="w-4 h-4" />
              {isUploading ? 'Loading...' : 'Choose Image'}
            </Button>
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Or paste an image URL</label>
          <Input
            value={image}
            onChange={(e) => onImageChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            type="url"
            disabled={isUploading}
            className="bg-gray-800/70 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>
      </CardContent>
    </Card>
  );
}; 