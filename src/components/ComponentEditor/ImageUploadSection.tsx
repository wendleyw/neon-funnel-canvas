import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadSectionProps {
  image: string;
  isUploading: boolean;
  isSocialMediaComponent: boolean;
  dimensionsInfo: string;
  onImageChange: (image: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  image,
  isUploading,
  isSocialMediaComponent,
  dimensionsInfo,
  onImageChange,
  onImageUpload,
  onRemoveImage
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
              <img
                src={image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-600"
                onError={(e) => {
                  console.error('Error loading preview image');
                  e.currentTarget.src = '';
                }}
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