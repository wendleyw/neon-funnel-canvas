import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { InstagramMockup } from './InstagramMockup';

interface InstagramMockupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstagramMockupModal: React.FC<InstagramMockupModalProps> = ({
  isOpen,
  onClose
}) => {
  const [mockupData, setMockupData] = useState({
    username: 'my_company',
    userAvatar: '/placeholder.svg',
    postImage: '/placeholder.svg',
    caption: 'Check out our amazing products! 🚀 #marketing #sales',
    likes: 247,
    isVerified: false
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setMockupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Instagram Preview</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settings */}
          <div className="space-y-4">
            <h3 className="font-medium">Post Settings</h3>
            
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={mockupData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="userAvatar">Avatar URL</Label>
              <Input
                id="userAvatar"
                value={mockupData.userAvatar}
                onChange={(e) => handleInputChange('userAvatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="postImage">Post Image URL</Label>
              <Input
                id="postImage"
                value={mockupData.postImage}
                onChange={(e) => handleInputChange('postImage', e.target.value)}
                placeholder="https://example.com/post.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={mockupData.caption}
                onChange={(e) => handleInputChange('caption', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="likes">Number of likes</Label>
              <Input
                id="likes"
                type="number"
                value={mockupData.likes}
                onChange={(e) => handleInputChange('likes', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isVerified"
                checked={mockupData.isVerified}
                onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isVerified">Verified account</Label>
            </div>
          </div>
          
          {/* Preview */}
          <div className="flex flex-col items-center">
            <h3 className="font-medium mb-4">Preview</h3>
            <InstagramMockup {...mockupData} />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
