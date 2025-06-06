
import React from 'react';
import { Smartphone } from 'lucide-react';
import { Button } from '@/features/shared/ui/button';

interface MobilePreviewButtonProps {
  onClick: () => void;
}

export const MobilePreviewButton: React.FC<MobilePreviewButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="outline"
      className="fixed bottom-20 right-4 bg-gray-900 border-gray-700 text-white hover:bg-gray-800 shadow-xl z-40 p-3"
    >
      <Smartphone className="w-5 h-5" />
    </Button>
  );
};
