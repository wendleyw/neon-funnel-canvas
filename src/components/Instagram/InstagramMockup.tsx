
import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { DeviceOption } from './DeviceSelector';

interface InstagramMockupProps {
  images: string[];
  device: DeviceOption;
}

export const InstagramMockup: React.FC<InstagramMockupProps> = ({ images, device }) => {
  const displayImage = images[0] || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop';

  const renderStatusBar = () => {
    if (device.type === 'ios') {
      return (
        <div className="bg-black px-6 py-3 flex justify-between items-center text-white text-sm">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="w-6 h-3 border border-white rounded-sm ml-2">
              <div className="w-4 h-full bg-white rounded-sm"></div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-black px-6 py-2 flex justify-between items-center text-white text-sm">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-1 bg-white rounded-full"></div>
              <div className="w-3 h-1 bg-white rounded-full"></div>
              <div className="w-3 h-1 bg-white rounded-full"></div>
            </div>
            <div className="w-5 h-2 bg-white rounded-sm"></div>
          </div>
        </div>
      );
    }
  };

  return (
    <div 
      className={`bg-black ${device.borderRadius} p-2 shadow-2xl transition-all duration-300`}
      style={{ width: device.width, height: device.height }}
    >
      <div className={`bg-black ${device.borderRadius} overflow-hidden h-full flex flex-col`}>
        {/* Status Bar */}
        {renderStatusBar()}

        {/* Instagram Header */}
        <div className="bg-black px-4 py-3 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-0.5">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">YB</span>
                </div>
              </div>
              <span className="text-white font-medium text-sm">your_business</span>
            </div>
            <MoreHorizontal className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Instagram Post Image */}
        <div className="relative bg-gray-900 flex-1 max-h-80">
          <img
            src={displayImage}
            alt="Instagram post"
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
              1/{images.length}
            </div>
          )}
        </div>

        {/* Instagram Actions */}
        <div className="bg-black px-4 py-3 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 text-white" />
              <MessageCircle className="w-6 h-6 text-white" />
              <Send className="w-6 h-6 text-white" />
            </div>
            <Bookmark className="w-6 h-6 text-white" />
          </div>

          <div className="space-y-2">
            <p className="text-white text-sm font-medium">1,234 likes</p>
            <div className="text-white text-sm">
              <span className="font-medium">your_business</span>
              <span className="ml-2">Check out our amazing funnel! 🚀 #marketing #funnel #business</span>
            </div>
            <p className="text-gray-400 text-xs">2 hours ago</p>
          </div>
        </div>

        {/* Comment Section */}
        <div className="bg-black px-4 pb-4 border-t border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3 py-2">
            <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-400 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
