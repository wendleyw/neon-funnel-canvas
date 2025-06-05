export interface PageTemplate {
  id: string;
  label: string;
  description: string;
  category: string;
  previewUrl: string;
  type: string;
  color: string;
  tags: string[];
}

export const pageTemplates: PageTemplate[] = [
  // Lead Capture Pages
  {
    id: 'generic-page',
    label: 'Modern Landing',
    description: 'Professional modern landing page with clean design and conversion focus',
    category: 'lead-sales',
    previewUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=200&h=150&fit=crop&crop=top',
    type: 'landing-page',
    color: '#6366F1',
    tags: ['modern', 'professional', 'conversion']
  },
  {
    id: 'download-page',
    label: 'Download',
    description: 'Download page for digital products',
    category: 'lead-sales',
    previewUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=150&fit=crop&crop=top',
    type: 'download-page',
    color: '#10B981',
    tags: ['download', 'digital', 'product']
  },
  {
    id: 'opt-in',
    label: 'Opt In',
    description: 'Email signup and lead magnet page',
    category: 'lead-sales',
    previewUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop&crop=top',
    type: 'opt-in-page',
    color: '#8B5CF6',
    tags: ['email', 'signup', 'lead magnet']
  },
  {
    id: 'order-page',
    label: 'Order Page',
    description: 'Product order and checkout page',
    category: 'lead-sales',
    previewUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=150&fit=crop&crop=top',
    type: 'order-page',
    color: '#EF4444',
    tags: ['order', 'checkout', 'purchase']
  },
  {
    id: 'sales-page',
    label: 'Sales Page',
    description: 'Long-form sales page',
    category: 'lead-sales',
    previewUrl: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=200&h=150&fit=crop&crop=top',
    type: 'sales-page',
    color: '#DC2626',
    tags: ['sales', 'conversion', 'long-form']
  },
  {
    id: 'sales-page-short',
    label: 'Sales Page Short',
    description: 'Short-form sales page',
    category: 'lead-sales',
    previewUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=150&fit=crop&crop=top',
    type: 'sales-page-short',
    color: '#F59E0B',
    tags: ['sales', 'short', 'concise']
  },
  {
    id: 'calendar',
    label: 'Calendar',
    description: 'Appointment booking calendar',
    category: 'member-book',
    previewUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=150&fit=crop&crop=top',
    type: 'calendar-page',
    color: '#06B6D4',
    tags: ['calendar', 'booking', 'appointment']
  },

  // Social Media Pages
  {
    id: 'instagram-reels',
    label: 'Reels',
    description: 'Instagram Reels - Vertical video format 9:16',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjM1NiIgdmlld0JveD0iMCAwIDIwMCAzNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzU2IiByeD0iMTIiIGZpbGw9IiMxODE4MUIiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjMzNiIgcng9IjgiIGZpbGw9IiNFNDQwNUYiLz4KPHN2ZyB4PSI4NSIgeT0iMTY4IiB3aWR0aD0iMzAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDVWMTlMMTkgMTJMOCA1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjx0ZXh0IHg9IjEwMCIgeT0iMjIwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UkVFTFM8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMjQwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4xMDgweDEwODA8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMjYwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj45OjE2PC90ZXh0Pgo8cmVjdCB4PSI3NSIgeT0iMjkwIiB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHJ4PSI1IiBmaWxsPSIjRkY2MDg0Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMzEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHJ4PSI1IiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPg==',
    type: 'instagram-reels',
    color: '#E4405F',
    tags: ['reels', 'instagram', 'video', 'vertical', '9:16']
  },
  {
    id: 'instagram-post',
    label: 'Instagram Post',
    description: 'Instagram Square Post - 1:1 format',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiByeD0iMTIiIGZpbGw9IiMxODE4MUIiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgcng9IjgiIGZpbGw9IiNFNDQwNUYiLz4KPHJlY3QgeD0iNzUiIHk9Ijg1IiB3aWR0aD0iNTAiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjEzNSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBPU1Q8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4xMDgweDEwODA8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTY1IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4xOjE8L3RleHQ+CjwvhZ2c+',
    type: 'instagram-post',
    color: '#E4405F',
    tags: ['post', 'instagram', 'square', '1:1']
  },
  {
    id: 'instagram-story',
    label: 'Instagram Story',
    description: 'Instagram Story - Vertical format 9:16',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjM1NiIgdmlld0JveD0iMCAwIDIwMCAzNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzU2IiByeD0iMTIiIGZpbGw9IiMxODE4MUIiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjMzNiIgcng9IjgiIGZpbGw9IiNFNDQwNUYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTc4IiByPSIyMCIgZmlsbD0id2hpdGUiLz4KPHRleHQgeD0iMTAwIiB5PSIyMjAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TVE9SWTwvdGV4dD4KPHR5dCB4PSIxMDAiIHk9IjI0MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MTA4MHgxOTIwPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjI2MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+OToxNjwvdGV4dD4KPC9zdmc+',
    type: 'instagram-story',
    color: '#E4405F',
    tags: ['story', 'instagram', 'vertical', '9:16']
  },
  {
    id: 'tiktok-video',
    label: 'TikTok Video',
    description: 'TikTok Vertical Video - 9:16 format',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjM1NiIgdmlld0JveD0iMCAwIDIwMCAzNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzU2IiByeD0iMTIiIGZpbGw9IiMxODE4MUIiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjMzNiIgcng9IjgiIGZpbGw9IiMwMDAwMDAiLz4KPHN2ZyB4PSI4NSIgeT0iMTY4IiB3aWR0aD0iMzAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDVWMTlMMTkgMTJMOCA1WiIgZmlsbD0iI0ZGMDA0NCIvPgo8L3N2Zz4KPHR4dCB4PSIxMDAiIHk9IjIyMCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRJS1RPSzwvdGV4dD4KPHR4dCB4PSIxMDAiIHk9IjI0MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MTA4MHgxOTIwPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjI2MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+OToxNjwvdGV4dD4KPC9zdmc+',
    type: 'tiktok-video',
    color: '#000000',
    tags: ['tiktok', 'video', 'vertical', '9:16']
  },
  {
    id: 'youtube-shorts',
    label: 'YouTube Shorts',
    description: 'YouTube Shorts - Vertical format 9:16',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjM1NiIgdmlld0JveD0iMCAwIDIwMCAzNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzU2IiByeD0iMTIiIGZpbGw9IiMxODE4MUIiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjMzNiIgcng9IjgiIGZpbGw9IiNGRjAwMDAiLz4KPHN2ZyB4PSI4NSIgeT0iMTY4IiB3aWR0aD0iMzAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDVWMTlMMTkgMTJMOCA1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjx0ZXh0IHg9IjEwMCIgeT0iMjIwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0hPUlRTPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjI0MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MTA4MHgxOTIwPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjI2MCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+OToxNjwvdGV4dD4KPC9zdmc+',
    type: 'youtube-short',
    color: '#FF0000',
    tags: ['youtube', 'shorts', 'vertical', '9:16']
  },
  {
    id: 'youtube-video-4k',
    label: 'YouTube Video 4K',
    description: 'YouTube Video 4K - 3840x2160 pixels (16:9)',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMyIgdmlld0JveD0iMCAwIDIwMCAxMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTEzIiByeD0iOCIgZmlsbD0iIzE4MTgxQiIvPgo8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iMTg0IiBoZWlnaHQ9Ijk3IiByeD0iNCIgZmlsbD0iI0ZGMDAwMCIvPgo8c3ZnIHg9Ijg1IiB5PSI0NiIgd2lkdGg9IjMwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNOCA1VjE5TDE5IDEyTDggNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8dGV4dCB4PSIxMDAiIHk9Ijg1IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+NEsgVklERU88L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4zODQweDIxNjA8L3RleHQ+CjwvhZ2c+',
    type: 'youtube-video-4k',
    color: '#FF0000',
    tags: ['youtube', 'video', '4k', '16:9', 'uhd']
  },
  {
    id: 'youtube-video-1080p',
    label: 'YouTube Video HD',
    description: 'YouTube Video HD - 1920x1080 pixels (16:9)',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMyIgdmlld0JveD0iMCAwIDIwMCAxMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTEzIiByeD0iOCIgZmlsbD0iIzE4MTgxQiIvPgo8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iMTg0IiBoZWlnaHQ9Ijk3IiByeD0iNCIgZmlsbD0iI0ZGMDAwMCIvPgo8c3ZnIHg9Ijg1IiB5PSI0NiIgd2lkdGg9IjMwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNOCA1VjE5TDE5IDEyTDggNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8dGV4dCB4PSIxMDAiIHk9Ijg1IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SEQgVklERU88L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4xOTIweDEwODA8L3RleHQ+CjwvhZ2c+',
    type: 'youtube-video-hd',
    color: '#FF0000',
    tags: ['youtube', 'video', 'hd', '1080p', '16:9']
  },
  {
    id: 'youtube-video-720p',
    label: 'YouTube Video 720p',
    description: 'YouTube Video 720p - 1280x720 pixels (16:9)',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMyIgdmlld0JveD0iMCAwIDIwMCAxMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTEzIiByeD0iOCIgZmlsbD0iIzE4MTgxQiIvPgo8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iMTg0IiBoZWlnaHQ9Ijk3IiByeD0iNCIgZmlsbD0iI0ZGMDAwMCIvPgo8c3ZnIHg9Ijg1IiB5PSI0NiIgd2lkdGg9IjMwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNOCA1VjE5TDE5IDEyTDggNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8dGV4dCB4PSIxMDAiIHk9Ijg1IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+NzIwcCBWSURFTzwvdGV4dD4KPHR4dCB4PSIxMDAiIHk9IjEwMCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MTI4MHg3MjA8L3RleHQ+CjwvhZ2c+',
    type: 'youtube-video-720p',
    color: '#FF0000',
    tags: ['youtube', 'video', '720p', '16:9']
  },
  {
    id: 'youtube-thumbnail-hd',
    label: 'YouTube Thumbnail',
    description: 'YouTube Thumbnail - 1280x720 pixels (16:9)',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMyIgdmlld0JveD0iMCAwIDIwMCAxMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTEzIiByeD0iOCIgZmlsbD0iIzE4MTgxQiIvPgo8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iMTg0IiBoZWlnaHQ9Ijk3IiByeD0iNCIgZmlsbD0iI0ZGMDAwMCIvPgo8cmVjdCB4PSI3NSIgeT0iNDAiIHdpZHRoPSI1MCIgaGVpZ2h0PSIzMyIgcng9IjQiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iODUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5USFVNQk5BSUw8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4xMjgweDcyMDwvdGV4dD4KPC9zdmc+',
    type: 'youtube-thumbnail',
    color: '#FF0000',
    tags: ['youtube', 'thumbnail', '16:9', 'cover']
  },
  {
    id: 'youtube-banner',
    label: 'YouTube Banner',
    description: 'YouTube Channel Banner - 2560x1440 pixels',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMyIgdmlld0JveD0iMCAwIDIwMCAxMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTEzIiByeD0iOCIgZmlsbD0iIzE4MTgxQiIvPgo8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iMTg0IiBoZWlnaHQ9Ijk3IiByeD0iNCIgZmlsbD0iI0ZGMDAwMCIvPgo8dGV4dCB4PSIxMDAiIHk9IjQwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q0hBTk5FTDwvdGV4dD4KPHR4dCB4PSIxMDAiIHk9IjU4IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QkFOTkVSPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9Ijg1IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4yNTYweDEwNDA8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TYWZlOiAxNTQ2eDQyMzwvdGV4dD4KPC9zdmc+',
    type: 'youtube-banner',
    color: '#FF0000',
    tags: ['youtube', 'banner', 'channel', '16:9', 'header']
  },
  {
    id: 'youtube-profile',
    label: 'YouTube Profile',
    description: 'YouTube Profile Picture - 800x800 pixels (1:1)',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiByeD0iMTAwIiBmaWxsPSIjMTgxODFCIi8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiIHJ4PSI5MCIgZmlsbD0iI0ZGMDAwMCIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iMzAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik03MCAENCBRNjAgMTM1IDcwIDE0NSBRMTAwIDEzMCAxMzAgMTQ1IFExNDAgMTM1IDEzMCAxMjUgUTEwMCAxNDAgNzAgMTI1WiIgZmlsbD0id2hpdGUiLz4KPHR4dCB4PSIxMDAiIHk9IjE3NSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBST0ZJTEU8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTkwIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj44MDB4ODAwPC90ZXh0Pgo8L3N2Zz4=',
    type: 'youtube-profile',
    color: '#FF0000',
    tags: ['youtube', 'profile', 'avatar', '1:1', 'square']
  },
  {
    id: 'youtube-end-screen',
    label: 'YouTube End Screen',
    description: 'YouTube End Screen Template - 1920x1080 pixels',
    category: 'engagement-content',
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMyIgdmlld0JveD0iMCAwIDIwMCAxMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTEzIiByeD0iOCIgZmlsbD0iIzE4MTgxQiIvPgo8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iMTg0IiBoZWlnaHQ9Ijk3IiByeD0iNCIgZmlsbD0iI0ZGMDAwMCIvPgo8cmVjdCB4PSIyMCIgeT0iMzAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI0MCIgcng9IjQiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8cmVjdCB4PSIxMTAiIHk9IjMwIiB3aWR0aD0iNzAiIGhlaWdodD0iNDAiIHJ4PSI0IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPHR4dCB4PSIxMDAiIHk9Ijg1IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RU5EIFNDT0VFTjwvdGV4dD4KPHR4dCB4PSIxMDAiIHk9IjEwMCIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MQUlOWlZCOYQKA=',
    type: 'youtube-end-screen',
    color: '#FF0000',
    tags: ['youtube', 'end-screen', 'outro', '16:9']
  },

  // Engagement Pages
  {
    id: 'survey',
    label: 'Survey',
    description: 'Customer feedback survey',
    category: 'engagement-content',
    previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&h=150&fit=crop&crop=top',
    type: 'survey-page',
    color: '#8B5CF6',
    tags: ['survey', 'feedback', 'form']
  },
  {
    id: 'upsell-oto',
    label: 'Upsell OTO',
    description: 'One-time offer upsell page',
    category: 'lead-sales',
    previewUrl: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=200&h=150&fit=crop&crop=top',
    type: 'upsell-page',
    color: '#F59E0B',
    tags: ['upsell', 'oto', 'offer']
  },
  {
    id: 'webinar-live',
    label: 'Webinar Live',
    description: 'Live webinar registration',
    category: 'engagement-content',
    previewUrl: 'https://images.unsplash.com/photo-1611403119860-57c4937ef987?w=200&h=150&fit=crop&crop=top',
    type: 'webinar-live',
    color: '#EF4444',
    tags: ['webinar', 'live', 'registration']
  },
  {
    id: 'webinar-replay',
    label: 'Webinar Replay',
    description: 'Webinar replay page',
    category: 'engagement-content',
    previewUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&h=150&fit=crop&crop=top',
    type: 'webinar-replay',
    color: '#8B5CF6',
    tags: ['webinar', 'replay', 'recorded']
  },
  {
    id: 'blog-post',
    label: 'Blog Post',
    description: 'Standard blog post template',
    category: 'engagement-content',
    previewUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&h=150&fit=crop&crop=top',
    type: 'blog-post',
    color: '#10B981',
    tags: ['blog', 'article', 'content']
  },
  {
    id: 'blog-list',
    label: 'Blog List',
    description: 'Blog listing page',
    category: 'engagement-content',
    previewUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=200&h=150&fit=crop&crop=top',
    type: 'blog-list',
    color: '#0EA5E9',
    tags: ['blog', 'archive', 'list']
  },
  {
    id: 'course-list',
    label: 'Course List',
    description: 'List of available courses',
    category: 'member-book',
    previewUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=150&fit=crop&crop=top',
    type: 'course-list',
    color: '#F97316',
    tags: ['course', 'membership', 'education']
  },
  {
    id: 'course-single',
    label: 'Course Single',
    description: 'Single course details page',
    category: 'member-book',
    previewUrl: 'https://images.unsplash.com/photo-1532618500676-2e0cbf7ba8b8?w=200&h=150&fit=crop&crop=top',
    type: 'course-single',
    color: '#D97706',
    tags: ['course', 'lesson', 'membership']
  },
  {
    id: 'course-lesson',
    label: 'Course Lesson',
    description: 'Individual course lesson page',
    category: 'member-book',
    previewUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=150&fit=crop&crop=top',
    type: 'course-lesson',
    color: '#FBBF24',
    tags: ['lesson', 'module', 'membership']
  },
  {
    id: 'thank-you',
    label: 'Thank You',
    description: 'Confirmation thank you page',
    category: 'utility',
    previewUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=200&h=150&fit=crop&crop=top',
    type: 'thank-you-page',
    color: '#10B981',
    tags: ['thank you', 'confirmation', 'success']
  },
  {
    id: 'confirmation-page',
    label: 'Confirmation Page',
    description: 'Generic confirmation page for actions',
    category: 'utility',
    previewUrl: 'https://images.unsplash.com/photo-1573496774431-9567376452c6?w=200&h=150&fit=crop&crop=top',
    type: 'confirmation-page',
    color: '#22C55E',
    tags: ['confirmation', 'verified', 'action complete']
  },
  {
    id: 'popup-modal',
    label: 'Popup Modal',
    description: 'Generic popup modal for offers or information',
    category: 'utility',
    previewUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=200&h=150&fit=crop&crop=top',
    type: 'popup-modal',
    color: '#A855F7',
    tags: ['popup', 'modal', 'overlay', 'offer']
  },
  {
    id: 'exit-intent-popup',
    label: 'Exit Intent Popup',
    description: 'Popup triggered on exit intent',
    category: 'utility',
    previewUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=150&fit=crop&crop=top',
    type: 'exit-intent-popup',
    color: '#EC4899',
    tags: ['popup', 'exit intent', 'modal', 'conversion']
  },
  {
    id: 'coming-soon',
    label: 'Coming Soon',
    description: 'Coming soon or under construction page',
    category: 'utility',
    previewUrl: 'https://images.unsplash.com/photo-1542492633-39f8bb328f59?w=200&h=150&fit=crop&crop=top',
    type: 'coming-soon-page',
    color: '#F59E0B',
    tags: ['coming soon', 'under construction', 'placeholder']
  },
  {
    id: 'about-us',
    label: 'About Us',
    description: 'Company or personal about page',
    category: 'engagement-content',
    previewUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c7da?w=200&h=150&fit=crop&crop=top',
    type: 'about-us-page',
    color: '#0EA5E9',
    tags: ['about', 'company', 'team', 'info']
  },
  {
    id: 'contact-us',
    label: 'Contact Us',
    description: 'Contact form and information page',
    category: 'utility',
    previewUrl: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=200&h=150&fit=crop&crop=top',
    type: 'contact-us-page',
    color: '#6366F1',
    tags: ['contact', 'form', 'support', 'info']
  },
  {
    id: 'faq-page',
    label: 'FAQ Page',
    description: 'Frequently asked questions page',
    category: 'engagement-content',
    previewUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=150&fit=crop&crop=top',
    type: 'faq-page',
    color: '#14B8A6',
    tags: ['faq', 'support', 'questions', 'info']
  },
  {
    id: 'terms-of-service',
    label: 'Terms of Service',
    description: 'Terms of service and legal page',
    category: 'utility',
    previewUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=150&fit=crop&crop=top',
    type: 'terms-page',
    color: '#64748B',
    tags: ['terms', 'legal', 'policy']
  },
  {
    id: 'privacy-policy',
    label: 'Privacy Policy',
    description: 'Privacy policy and legal page',
    category: 'utility',
    previewUrl: 'https://images.unsplash.com/photo-1558005753-c04a37834add?w=200&h=150&fit=crop&crop=top',
    type: 'privacy-policy-page',
    color: '#475569',
    tags: ['privacy', 'legal', 'policy']
  }
];

// Category metadata
export const PAGE_CATEGORIES = {
  'lead-capture': {
    label: 'Lead Capture',
    description: 'Pages for capturing leads',
    color: '#3B82F6',
    icon: '🎯'
  },
  'sales': {
    label: 'Sales',
    description: 'Sales and conversion pages',
    color: '#EF4444',
    icon: '🎯'
  },
  'social-media': {
    label: 'Social Media',
    description: 'Social media content formats',
    color: '#E4405F',
    icon: '📱'
  },
  'webinar': {
    label: 'Webinar',
    description: 'Webinar-related pages',
    color: '#8B5CF6',
    icon: '🎥'
  },
  'engagement': {
    label: 'Engagement',
    description: 'User engagement pages',
    color: '#10B981',
    icon: '💬'
  },
  'booking': {
    label: 'Booking',
    description: 'Appointment and booking pages',
    color: '#06B6D4',
    icon: '📅'
  },
  'content': {
    label: 'Content',
    description: 'Content and blog pages',
    color: '#6B7280',
    icon: '📝'
  },
  'membership': {
    label: 'Membership',
    description: 'Member-exclusive pages',
    color: '#059669',
    icon: '👥'
  },
  'confirmation': {
    label: 'Confirmation',
    description: 'Confirmation and thank you pages',
    color: '#10B981',
    icon: '✅'
  },
  'popup': {
    label: 'Popup',
    description: 'Modal and popup pages',
    color: '#7C3AED',
    icon: '📋'
  }
}; 