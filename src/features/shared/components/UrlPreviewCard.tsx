import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { 
  Globe, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Image as ImageIcon,
  Loader2,
  Shield
} from 'lucide-react';
import { useDebounce } from 'use-debounce';

// Security: HTML sanitization function
const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary element to decode HTML entities
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Get text content only (removes all HTML tags)
  let text = temp.textContent || temp.innerText || '';
  
  // Additional sanitization and cleanup
  text = text
    .replace(/[<>]/g, '') // Remove any remaining angle brackets
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim()
    .substring(0, 500); // Limit length
    
  return text;
};

// Security: URL validation for images
const isImageUrlSafe = (url: string): boolean => {
  if (!url) return false;

  console.log(`[UrlPreviewCard] Validating image URL: ${url}`);
  
  try {
    const urlObj = new URL(url);
    
    // RELAXED: Allow both HTTP and HTTPS for preview images.
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      console.warn(`[UrlPreviewCard] Image blocked due to invalid protocol: ${urlObj.protocol}`);
      return false;
    }
    
    // Block suspicious domains/IPs (e.g., localhost, private networks)
    const hostname = urlObj.hostname.toLowerCase();
    const blockedPatterns = [
      /^localhost$/i, /^127\./, /^10\./, /^192\.168\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^169\.254\./
    ];
    
    if (blockedPatterns.some(pattern => pattern.test(hostname))) {
      console.warn(`[UrlPreviewCard] Image blocked due to suspicious hostname: ${hostname}`);
      return false;
    }
    
    console.log(`[UrlPreviewCard] Image URL is considered safe.`);
    return true;
  } catch (e) {
    console.error(`[UrlPreviewCard] Image URL parsing failed:`, e);
    return false;
  }
};

// Security: Validate external links
const isSafeExternalUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Type definitions
interface UrlPreviewData {
  url: string;
  title: string;
  description: string;
  image: string | null;
  images?: string[];
  domain: string;
  siteName: string;
  favicon: string;
  success: boolean;
  timestamp: string;
}

interface UrlPreviewError {
  error: string;
  message: string;
  fallback?: {
    title: string;
    description: string;
    domain: string;
  };
}

interface UrlPreviewCardProps {
  onPreviewFetched?: (previewData: UrlPreviewData | null) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  initialUrl?: string;
  initialPreviewData?: UrlPreviewData | null;
  placeholder?: string;
  className?: string;
  showUrlInput?: boolean;
  compact?: boolean;
}

const API_BASE_URL = 'http://localhost:3001';

export const UrlPreviewCard: React.FC<UrlPreviewCardProps> = ({
  onPreviewFetched,
  onLoadingChange,
  initialUrl = '',
  initialPreviewData,
  placeholder = 'Cole uma URL aqui (ex: https://github.com)',
  className = '',
  showUrlInput = true,
  compact = false
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [previewData, setPreviewData] = useState<UrlPreviewData | null>(initialPreviewData || null);
  const [error, setError] = useState<UrlPreviewError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // Debounce the URL input to avoid excessive API calls
  const [debouncedUrl] = useDebounce(url, 500);

  // Report loading state changes to the parent
  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  // Sync internal URL state with the initialUrl prop when it changes from the parent
  useEffect(() => {
    // This effect ensures the internal 'url' state is always in sync
    // with the 'initialUrl' prop passed from the parent component.
    setUrl(initialUrl);
  }, [initialUrl]);

  // Set the initial image when preview data is fetched
  useEffect(() => {
    if (previewData) {
      // Prioritize the 'image' field, but fall back to the first item in 'images'
      const imageList = previewData.images || [];
      const initialImage = previewData.image || (imageList.length > 0 ? imageList[0] : null);
      
      let foundSafeImage = false;
      if (initialImage && isImageUrlSafe(initialImage)) {
        setCurrentImage(initialImage);
        foundSafeImage = true;
      } else if (imageList.length > 0) {
        // If the primary image is no good, find the first safe one from the list
        const safeFallback = imageList.find(img => isImageUrlSafe(img));
        if (safeFallback) {
          setCurrentImage(safeFallback);
          foundSafeImage = true;
        }
      }

      if (!foundSafeImage) {
        setCurrentImage(null);
      }
    } else {
      setCurrentImage(null);
    }
  }, [previewData]);

  // Also track immediate URL state for instant feedback
  const [immediateUrlValid, setImmediateUrlValid] = useState<boolean | null>(null);

  // Check URL validity immediately on change
  useEffect(() => {
    if (url && url.trim()) {
      const isValid = isValidUrl(url);
      setImmediateUrlValid(isValid);
    } else {
      setImmediateUrlValid(null);
    }
  }, [url]);

  // Validate URL format
  const isValidUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      const isValid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      return isValid;
    } catch (error) {
      return false;
    }
  };

  // Fetch preview data from our backend
  const fetchPreviewData = async (targetUrl: string): Promise<void> => {
    if (!isValidUrl(targetUrl)) {
      setError({
        error: 'Invalid URL',
        message: 'Por favor, forneça uma URL válida (deve começar com http:// ou https://)'
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasAttempted(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/preview?url=${encodeURIComponent(targetUrl)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setPreviewData(data);
        setError(null);
        onPreviewFetched?.(data);
      } else {
        throw new Error(data.message || 'Failed to fetch preview');
      }

    } catch (err: any) {
      const errorData: UrlPreviewError = {
        error: 'Fetch failed',
        message: err.message || 'Não foi possível carregar o preview da URL',
        fallback: {
          title: `Preview de ${new URL(targetUrl).hostname}`,
          description: 'Não foi possível carregar o conteúdo do preview',
          domain: new URL(targetUrl).hostname
        }
      };
      
      setError(errorData);
      setPreviewData(null);
      onPreviewFetched?.(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch preview when debounced URL changes
  useEffect(() => {
    if (debouncedUrl && debouncedUrl.trim() && isValidUrl(debouncedUrl)) {
      fetchPreviewData(debouncedUrl);
    } else if (debouncedUrl && debouncedUrl.trim()) {
      setError({
        error: 'Invalid URL format',
        message: 'A URL deve começar com http:// ou https://'
      });
      // Do not clear preview data here, let the user see the last valid one
      setHasAttempted(true);
    } else {
      // When the URL is cleared, reset error/attempt states but keep the preview.
      setError(null);
      setHasAttempted(false);
    }
  }, [debouncedUrl]);

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center space-x-2 mt-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render error state
  const renderError = () => (
    <Alert className="border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="space-y-2">
          <p className="font-medium">{error?.error}</p>
          <p className="text-sm">{error?.message}</p>
          {error?.fallback && (
            <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
              <p className="font-medium text-red-900">{error.fallback.title}</p>
              <p className="text-sm text-red-700">{error.fallback.description}</p>
              <Badge variant="outline" className="mt-2 text-red-600 border-red-300">
                <Globe className="w-3 h-3 mr-1" />
                {error.fallback.domain}
              </Badge>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );

  // Render successful preview
  const renderPreview = () => {
    if (!previewData) {
      console.log('[UrlPreviewCard] renderPreview called but no previewData');
      return null;
    }

    console.log('[UrlPreviewCard] Rendering preview with data:', previewData);

    // Security: Sanitize all text content
    const safeTitle = sanitizeHtml(previewData.title);
    const safeDescription = sanitizeHtml(previewData.description);
    const safeSiteName = sanitizeHtml(previewData.siteName);
    const safeDomain = sanitizeHtml(previewData.domain);
    
    const safeFavicon = previewData.favicon && isImageUrlSafe(previewData.favicon) ? previewData.favicon : null;
    
    // Security: Validate main URL
    const safeUrl = isSafeExternalUrl(previewData.url) ? previewData.url : '#';
    const isUrlSafe = safeUrl !== '#';

    const handleImageError = () => {
      if (!currentImage) return;

      console.error(`[UrlPreviewCard] Failed to load image: ${currentImage}. Trying fallback.`);
      
      const imageList = previewData?.images || [];
      const currentIndex = imageList.indexOf(currentImage);
      
      // Find the next *valid* image to try
      for (let i = currentIndex + 1; i < imageList.length; i++) {
        if (isImageUrlSafe(imageList[i])) {
          setCurrentImage(imageList[i]);
          return; // Found a new one, stop here.
        }
      }
      
      // If no more valid fallbacks, give up.
      setCurrentImage(null);
    };

    return (
      <Card className={`w-full transition-shadow duration-200 ${compact ? 'shadow-sm' : 'hover:shadow-lg'} ${className?.includes('preview-card-dark') ? 'bg-white' : ''}`}>
        <CardContent className="p-0">
          {/* Security Warning for Unsafe URLs */}
          {!isUrlSafe && (
            <div className="bg-yellow-50 border-b border-yellow-200 p-2">
              <div className="flex items-center space-x-2 text-yellow-800 text-xs">
                <Shield className="w-3 h-3" />
                <span>URL validation failed - external link disabled for security</span>
              </div>
            </div>
          )}
          
          {/* Image Section: Now uses state to handle image fallbacks */}
          {currentImage ? (
            <div className={`relative w-full overflow-hidden rounded-t-lg ${compact ? 'h-40' : 'h-48'}`}>
              <img
                key={currentImage} // Add key to force re-render on src change
                src={currentImage}
                alt={safeTitle || 'Preview'}
                className="w-full h-full object-cover"
                onError={handleImageError}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            </div>
          ) : (
            // Show this fallback if there is no currentImage, but we expected one
            (previewData.image || (previewData.images && previewData.images.length > 0)) && (
              <div className={`relative w-full overflow-hidden rounded-t-lg ${compact ? 'h-40' : 'h-48'}`}>
                <div className="flex w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              </div>
            )
          )}

          {/* Content Section */}
          <div className={`space-y-3 ${compact ? 'p-3' : 'p-4'}`}>
            {/* Title */}
            <h3 className={`font-semibold ${className?.includes('preview-card-dark') ? 'text-white' : 'text-gray-900'} line-clamp-2 ${compact ? 'text-base' : 'text-lg'}`}>
              {safeTitle || 'No title available'}
            </h3>

            {/* Description */}
            {!compact && safeDescription && (
              <p className={`${className?.includes('preview-card-dark') ? 'text-gray-300' : 'text-gray-600'} text-sm line-clamp-3`}>
                {safeDescription}
              </p>
            )}

            {/* Site Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {safeFavicon && (
                  <img 
                    src={safeFavicon} 
                    alt="Favicon" 
                    className="w-4 h-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                )}
                <Badge variant="outline" className={`${className?.includes('preview-card-dark') ? 'text-gray-300 border-gray-600' : 'text-gray-600'}`}>
                  <Globe className="w-3 h-3 mr-1" />
                  {safeDomain || 'Unknown domain'}
                </Badge>
              </div>

              {!compact && isUrlSafe && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Security: Open in new tab with security measures
                    if (safeUrl && safeUrl !== '#') {
                      window.open(safeUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className={className?.includes('preview-card-dark') ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Visitar
                </Button>
              )}
              
              {!compact && !isUrlSafe && (
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled
                  title="Link disabled for security reasons"
                  className={className?.includes('preview-card-dark') ? 'border-gray-600 text-gray-500' : ''}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Blocked
                </Button>
              )}
            </div>

            {/* Metadata - Only show in full mode */}
            {!compact && (
              <div className={`flex items-center justify-between text-xs ${className?.includes('preview-card-dark') ? 'text-gray-400' : 'text-gray-500'} pt-2 border-t ${className?.includes('preview-card-dark') ? 'border-gray-600' : ''}`}>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Preview carregado com sucesso</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {previewData.timestamp ? 
                      new Date(previewData.timestamp).toLocaleTimeString() : 
                      'Unknown time'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* URL Input */}
      {showUrlInput && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            URL para Preview
          </label>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            {url && isValidUrl(url) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPreviewData(url)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Recarregar'
                )}
              </Button>
            )}
          </div>
          
          {/* URL Status Indicator */}
          {url && (
            <div className="flex items-center space-x-2 text-xs">
              {isValidUrl(url) ? (
                <>
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-green-600">URL válida</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-red-600">URL inválida - deve começar com http:// ou https://</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && renderLoadingSkeleton()}
      
      {/* Preview State - Show whenever we have preview data, regardless of other states */}
      {previewData && !isLoading && renderPreview()}
      
      {/* Error State - Only show if there's an error AND no preview data AND not loading */}
      {error && !previewData && !isLoading && renderError()}
      
      {/* Empty State - Only show if no data has ever been loaded and no error and not loading and showUrlInput is true */}
      {!previewData && !hasAttempted && !isLoading && !error && showUrlInput && (
        <div className="text-center py-8 text-gray-500">
          <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Cole uma URL acima para ver o preview</p>
          <p className="text-sm text-gray-400 mt-1">
            Suporte para sites, imagens e conteúdo web
          </p>
        </div>
      )}
    </div>
  );
};

export default UrlPreviewCard; 