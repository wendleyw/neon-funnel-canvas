
import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

interface InstagramMockupProps {
  username?: string;
  userAvatar?: string;
  postImage?: string;
  caption?: string;
  likes?: number;
  isVerified?: boolean;
}

export const InstagramMockup: React.FC<InstagramMockupProps> = ({
  username = 'minha_empresa',
  userAvatar = '/placeholder.svg',
  postImage = '/placeholder.svg',
  caption = 'Confira nossos produtos incríveis! 🚀 #marketing #vendas',
  likes = 247,
  isVerified = false
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-3">
          <img
            src={userAvatar}
            alt={username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-sm">{username}</span>
            {isVerified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
        </div>
        <MoreHorizontal size={20} className="text-gray-600" />
      </div>

      {/* Post Image */}
      <div className="aspect-square bg-gray-100">
        <img
          src={postImage}
          alt="Post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Heart size={24} className="text-gray-700 hover:text-red-500 cursor-pointer" />
            <MessageCircle size={24} className="text-gray-700 cursor-pointer" />
            <Send size={24} className="text-gray-700 cursor-pointer" />
          </div>
          <Bookmark size={24} className="text-gray-700 cursor-pointer" />
        </div>

        {/* Likes */}
        <div className="mb-2">
          <span className="font-semibold text-sm">{likes.toLocaleString()} curtidas</span>
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">{username}</span>
          <span>{caption}</span>
        </div>

        {/* Time */}
        <div className="text-xs text-gray-500 mt-2">
          há 2 horas
        </div>
      </div>
    </div>
  );
};
