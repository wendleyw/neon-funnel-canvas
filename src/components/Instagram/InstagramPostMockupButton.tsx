
import React from 'react';
import { Button } from '../ui/button';
import { Smartphone } from 'lucide-react';

interface InstagramPostMockupButtonProps {
  onClick: () => void;
}

export const InstagramPostMockupButton: React.FC<InstagramPostMockupButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="outline"
      className="bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white hover:from-purple-600 hover:to-pink-600 shadow-lg"
    >
      <Smartphone className="w-4 h-4 mr-2" />
      Create Reel Mockup
    </Button>
  );
};
