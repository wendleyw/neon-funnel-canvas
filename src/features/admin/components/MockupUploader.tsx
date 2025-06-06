import React, { useState, useRef } from 'react';
import { Upload, Image, Eye, Trash2, Camera, Download } from 'lucide-react';
import { toast } from 'sonner';

interface MockupUploaderProps {
  currentMockup?: string;
  onMockupChange: (mockupUrl: string | null) => void;
  templateType: 'source' | 'page' | 'action';
}

export const MockupUploader: React.FC<MockupUploaderProps> = ({
  currentMockup,
  onMockupChange,
  templateType
}) => {
  const [preview, setPreview] = useState<string | null>(currentMockup || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validations
    if (!file.type.startsWith('image/')) {
      toast.error('Please select only image files');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File too large. Maximum 5MB allowed');
      return;
    }

    try {
      setIsUploading(true);

      // Create local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        
        // For now, let's simulate an upload and return the dataURL
        // In production, you would send this to a storage service like Supabase Storage
        onMockupChange(result);
        toast.success('Mockup uploaded successfully!');
      };
      
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('❌ Error uploading mockup:', error);
      toast.error('Error uploading mockup');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMockup = () => {
    setPreview(null);
    onMockupChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Mockup removed');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile && fileInputRef.current) {
      // Create a proper FileList for the input
      const dt = new DataTransfer();
      dt.items.add(imageFile);
      fileInputRef.current.files = dt.files;
      
      // Create proper synthetic event
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', {
        writable: false,
        value: fileInputRef.current
      });
      
      handleFileSelect(event as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const getDefaultMockup = () => {
    switch (templateType) {
      case 'source':
        return '🌐';
      case 'page':
        return '📄';
      case 'action':
        return '⚡';
      default:
        return '📦';
    }
  };

  const getTypeLabel = () => {
    switch (templateType) {
      case 'source': return 'Source';
      case 'page': return 'Page';
      case 'action': return 'Action';
      default: return 'Template';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Custom Mockup
        </label>
        <div className="text-xs text-gray-400">
          PNG, JPG, SVG • Max 5MB
        </div>
      </div>

      {/* Preview Area */}
      <div className="relative">
        {preview ? (
          <div className="relative group">
            <div className="w-full h-48 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
              <img 
                src={preview} 
                alt="Template mockup" 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Overlay com ações */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button
                onClick={() => window.open(preview, '_blank')}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                title="View full size"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                title="Change image"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemoveMockup}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                title="Remove mockup"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-48 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{getDefaultMockup()}</div>
              <div className="text-gray-400 text-sm mb-2">
                Default mockup for {getTypeLabel()}s
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Upload className="w-4 h-4" />
                Click or drag an image here
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Loading indicator */}
      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-blue-400 text-sm">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          Uploading...
        </div>
      )}

      {/* Dicas */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>💡 <strong>Tip:</strong> Use square images (1:1 aspect ratio) for best results.</div>
        <div>🎨 <strong>Recommended:</strong> Transparent background or one that matches your template's color.</div>
        <div>📱 <strong>Canvas:</strong> This image will appear instead of the default mockup when users add the template.</div>
      </div>
    </div>
  );
}; 