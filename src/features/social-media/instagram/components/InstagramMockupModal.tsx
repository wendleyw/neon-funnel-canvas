
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
    username: 'minha_empresa',
    userAvatar: '/placeholder.svg',
    postImage: '/placeholder.svg',
    caption: 'Confira nossos produtos incríveis! 🚀 #marketing #vendas',
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
          <DialogTitle>Preview Instagram</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configurações */}
          <div className="space-y-4">
            <h3 className="font-medium">Configurações do Post</h3>
            
            <div>
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                value={mockupData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="userAvatar">URL do Avatar</Label>
              <Input
                id="userAvatar"
                value={mockupData.userAvatar}
                onChange={(e) => handleInputChange('userAvatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="postImage">URL da Imagem do Post</Label>
              <Input
                id="postImage"
                value={mockupData.postImage}
                onChange={(e) => handleInputChange('postImage', e.target.value)}
                placeholder="https://example.com/post.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="caption">Legenda</Label>
              <Textarea
                id="caption"
                value={mockupData.caption}
                onChange={(e) => handleInputChange('caption', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="likes">Número de curtidas</Label>
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
              <Label htmlFor="isVerified">Conta verificada</Label>
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
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
