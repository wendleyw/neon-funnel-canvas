import { useState, useCallback } from 'react';

interface UseImageUploadProps {
  initialImage?: string;
  maxSizeInMB?: number;
  onImageChange?: (imageUrl: string) => void;
}

export const useImageUpload = ({
  initialImage = '',
  maxSizeInMB = 5,
  onImageChange
}: UseImageUploadProps = {}) => {
  const [image, setImage] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select only image files');
      return;
    }

    // Validate file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert(`Image must be no larger than ${maxSizeInMB}MB`);
      return;
    }

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (imageUrl) {
          console.log('Image processed successfully, size:', imageUrl.length);
          setImage(imageUrl);
          onImageChange?.(imageUrl);
        }
        setIsUploading(false);
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error loading image. Please try again.');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error processing image');
      setIsUploading(false);
    }
  }, [maxSizeInMB, onImageChange]);

  const handleRemoveImage = useCallback(() => {
    console.log('Removing image');
    setImage('');
    onImageChange?.('');
  }, [onImageChange]);

  const handleImageUrlChange = useCallback((url: string) => {
    setImage(url);
    onImageChange?.(url);
  }, [onImageChange]);

  return {
    image,
    isUploading,
    handleImageUpload,
    handleRemoveImage,
    handleImageUrlChange
  };
}; 