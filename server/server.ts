import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, query, validationResult } from 'express-validator';
import NodeCache from 'node-cache';
import winston from 'winston';
import { getLinkPreview } from 'link-preview-js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security: Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'url-preview-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Security: Cache for validated URLs and domain reputation
const securityCache = new NodeCache({ 
  stdTTL: 3600, // 1 hour cache
  checkperiod: 600 // check for expired keys every 10 minutes
});

// Security: Blocked domains/IPs tracking
const blockedAttempts = new NodeCache({ 
  stdTTL: 86400, // 24 hour cache for blocked IPs
  checkperiod: 3600 // check every hour
});

// Security: Helmet configuration for HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for preview functionality
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Security: Advanced rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Increased from 100 to 300 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the rate limit. Please try again later.',
    retryAfter: 15 * 60 // 15 minutes
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const clientIp = req.ip || 'unknown';
    logger.warn(`Rate limit exceeded for IP: ${clientIp}`, {
      ip: clientIp,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: 15 * 60
    });
  }
});

// Security: More permissive rate limiting for preview endpoints
const previewLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Increased from 10 to 50 preview requests per 5 minutes
  message: {
    error: 'Preview rate limit exceeded',
    message: 'Too many preview requests. Please wait before trying again.',
    retryAfter: 5 * 60
  }
});

// Security: Removed restrictive whitelist - now allowing most domains
// Only blocking obvious security threats and keeping basic SSRF protection
const SECURITY_BLOCKED_DOMAINS = [
  // Keep only obvious security threats
  'localhost',
  '127.0.0.1',
  '0.0.0.0'
];

// Security: Basic SSRF protection - blocking only private/internal ranges
const BLOCKED_RANGES = [
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^127\./,
  /^169\.254\./,
  /^0\./,
  /^localhost$/i,
  /^::1$/,
  /^::$/,
  /^fe80:/i
];

// Security: Reduced suspicious patterns - only keeping obvious malicious ones
const SUSPICIOUS_PATTERNS = [
  /\.onion$/i,  // Dark web
  // Removed URL shorteners as they're commonly used legitimately
];

// Security: Much more permissive URL validation - only basic SSRF protection
const isUrlSafe = async (url: string): Promise<{ safe: boolean; reason?: string }> => {
  const cacheKey = `url_safety_${url}`;
  const cached = securityCache.get(cacheKey);
  
  if (cached) {
    logger.debug(`Cache hit for URL safety check: ${url}`);
    return cached as { safe: boolean; reason?: string };
  }

  try {
    const urlObj = new URL(url);
    
    // Only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      const result = { safe: false, reason: 'Invalid protocol' };
      securityCache.set(cacheKey, result);
      return result;
    }
    
    // Check for obvious malicious patterns (very minimal now)
    const hasSuspiciousPattern = SUSPICIOUS_PATTERNS.some(pattern => 
      pattern.test(urlObj.hostname) || pattern.test(url)
    );
    
    if (hasSuspiciousPattern) {
      const result = { safe: false, reason: 'Suspicious URL pattern detected' };
      securityCache.set(cacheKey, result);
      logger.warn(`Suspicious URL pattern detected: ${url}`);
      return result;
    }
    
    // REMOVED: Domain whitelist check - now allowing all domains except blocked ones
    const domain = urlObj.hostname.toLowerCase();
    const isBlocked = SECURITY_BLOCKED_DOMAINS.some(blockedDomain => 
      domain === blockedDomain || domain.endsWith('.' + blockedDomain)
    );
    
    if (isBlocked) {
      const result = { safe: false, reason: 'Blocked domain' };
      securityCache.set(cacheKey, result);
      logger.warn(`Blocked domain: ${domain}`);
      return result;
    }
    
    // Check for blocked IP ranges (basic SSRF protection)
    const isPrivateRange = BLOCKED_RANGES.some(range => range.test(domain));
    if (isPrivateRange) {
      const result = { safe: false, reason: 'Private IP/domain range not allowed' };
      securityCache.set(cacheKey, result);
      logger.warn(`Private IP/domain blocked: ${domain}`);
      return result;
    }
    
    // Block direct IP access (basic SSRF protection)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
      const result = { safe: false, reason: 'Direct IP access not allowed' };
      securityCache.set(cacheKey, result);
      logger.warn(`Direct IP access attempted: ${domain}`);
      return result;
    }
    
    // ALLOW ALL OTHER DOMAINS
    const result = { safe: true };
    securityCache.set(cacheKey, result);
    return result;
    
  } catch (error) {
    const result = { safe: false, reason: 'Invalid URL format' };
    securityCache.set(cacheKey, result);
    return result;
  }
};

// Security: Enhanced text sanitization
const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  // Remove potential XSS vectors
  let cleaned = text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
    
  // Limit length and remove excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').substring(0, 500);
  
  return cleaned;
};

// Security: Enhanced image URL validation
const isImageUrlSafe = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTPS for images
    if (urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Check against blocked ranges
    const hostname = urlObj.hostname.toLowerCase();
    const isBlocked = BLOCKED_RANGES.some(range => range.test(hostname));
    if (isBlocked) {
      return false;
    }
    
    // Validate image extensions
    const validImageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
    const hasValidExt = validImageExts.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext)
    );
    
    // Allow if it's a known image URL pattern or has valid extension
    return hasValidExt || 
           urlObj.hostname.includes('imgur') ||
           urlObj.hostname.includes('github') ||
           urlObj.hostname.includes('githubusercontent');
           
  } catch {
    return false;
  }
};

// Security: More permissive tracking - only block obvious attacks
const trackSuspiciousActivity = (ip: string, activity: string, url?: string) => {
  const key = `blocked_${ip}`;
  const attempts = (blockedAttempts.get(key) as number) || 0;
  blockedAttempts.set(key, attempts + 1);
  
  logger.warn(`Activity tracked`, {
    ip,
    activity,
    url,
    attempts: attempts + 1,
    timestamp: new Date().toISOString()
  });
  
  // Much more permissive - auto-block only after 50 suspicious attempts
  // This prevents legitimate users from being blocked for normal usage
  if (attempts >= 49) {
    logger.error(`IP auto-blocked due to repeated suspicious activity: ${ip}`);
    // In production, this could trigger firewall rules
  }
};

// Configure CORS
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite default
    'http://localhost:8080', // Alternative port
    'http://localhost:8081', // Alternative port
    'http://localhost:8082', // Alternative port
    'http://localhost:8083', // Current frontend port
    'http://localhost:3000', // Alternative port
  ],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply rate limiting
app.use('/api/', apiLimiter);

// Security: Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer')
  });
  next();
});

app.use(express.json({ limit: '1mb' }));

// Input validation middleware
const validatePreviewRequest = [
  query('url')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Invalid URL format')
    .isLength({ max: 2000 })
    .withMessage('URL too long')
    .custom((value) => {
      // Additional custom validation
      if (value.includes('<script') || value.includes('javascript:')) {
        throw new Error('Invalid URL content');
      }
      return true;
    })
];

const validateBatchRequest = [
  body('urls')
    .isArray({ min: 1, max: 5 })
    .withMessage('URLs must be an array with 1-5 items'),
  body('urls.*')
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Each URL must be valid')
    .isLength({ max: 2000 })
    .withMessage('URL too long')
];

// Health check endpoint with enhanced monitoring
app.get('/health', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    environment: process.env.NODE_ENV || 'development',
    cache: {
      securityCacheKeys: securityCache.keys().length,
      blockedAttempts: blockedAttempts.keys().length
    }
  };
  
  logger.debug('Health check requested', healthData);
  res.json(healthData);
});

// Endpoint to clear blocked IPs (for development/testing)
app.post('/api/admin/clear-blocks', (req, res) => {
  const clearedKeys = blockedAttempts.keys();
  blockedAttempts.flushAll();
  securityCache.flushAll();
  
  logger.info(`Cleared ${clearedKeys.length} blocked IPs and security cache`);
  res.json({
    success: true,
    message: `Cleared ${clearedKeys.length} blocked IPs and security cache`,
    clearedBlocks: clearedKeys.length
  });
});

// Enhanced URL Preview endpoint
app.get('/api/preview', previewLimiter, validatePreviewRequest, async (req: any, res: any) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed for preview request', {
        errors: errors.array(),
        ip: req.ip,
        url: req.query.url
      });
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid request parameters',
        details: errors.array()
      });
    }

    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const { url } = req.query;

    // Check if IP is auto-blocked (much more permissive)
    const blockedCount = (blockedAttempts.get(`blocked_${clientIp}`) as number) || 0;
    if (blockedCount >= 50) { // Updated from 5 to 50
      logger.error(`Blocked IP attempted access: ${clientIp}`);
      return res.status(403).json({
        error: 'Access denied',
        message: 'Your IP has been temporarily blocked'
      });
    }

    // Enhanced security check
    const urlSafety = await isUrlSafe(url);
    if (!urlSafety.safe) {
      trackSuspiciousActivity(clientIp, 'unsafe_url_attempt', url);
      return res.status(403).json({
        error: 'URL not allowed',
        message: `This URL is not permitted: ${urlSafety.reason}`,
        reason: urlSafety.reason
      });
    }

    logger.info(`Fetching preview for safe URL: ${url}`, { ip: clientIp });

    // Get link preview data with enhanced error handling
    const previewData: any = await getLinkPreview(url, {
      timeout: 8000, // Reduced timeout for better performance
      followRedirects: 'follow',
      handleRedirects: (baseURL: string, forwardedURL: string) => {
        // Security: Basic synchronous validation for redirects
        try {
          const forwardedUrlObj = new URL(forwardedURL);
          const isValidProtocol = ['http:', 'https:'].includes(forwardedUrlObj.protocol);
          const hostname = forwardedUrlObj.hostname.toLowerCase();
          
          // Quick check for obvious blocked patterns
          const hasBlockedPattern = BLOCKED_RANGES.some(range => range.test(hostname)) ||
                                  SUSPICIOUS_PATTERNS.some(pattern => pattern.test(hostname));
          
          if (!isValidProtocol || hasBlockedPattern) {
            logger.warn(`Blocked redirect to suspicious URL: ${forwardedURL}`);
            return false;
          }
          
          const urlObj = new URL(baseURL);
          const forwardedURLObj = new URL(forwardedURL);
          
          // Allow redirects to same domain or common redirects
          return urlObj.hostname === forwardedURLObj.hostname ||
                 forwardedURLObj.hostname.includes('www.') ||
                 urlObj.hostname.includes('www.');
        } catch {
          return false;
        }
      },
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; SecureLinkPreviewBot/2.0)',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.5',
        'accept-encoding': 'gzip, deflate',
        'connection': 'keep-alive',
        'upgrade-insecure-requests': '1',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none'
      }
    });

    // Enhanced data processing with security measures
    const processedData = {
      url: previewData.url || url,
      title: sanitizeText(previewData.title || 'No title available'),
      description: sanitizeText(previewData.description || 'No description available'),
      images: previewData.images?.filter(isImageUrlSafe)?.slice(0, 5) || [], // Limit to 5 images
      mediaType: previewData.mediaType || 'website',
      contentType: previewData.contentType || 'text/html',
      charset: previewData.charset || 'UTF-8',
      siteName: sanitizeText(previewData.siteName || ''),
      favicon: isImageUrlSafe(previewData.favicons?.[0]) ? previewData.favicons[0] : '',
      image: previewData.images?.find(isImageUrlSafe) || null,
      domain: new URL(url).hostname,
      success: true,
      timestamp: new Date().toISOString(),
      cached: false
    };

    logger.info(`Preview fetched successfully for: ${processedData.domain}`, {
      ip: clientIp,
      domain: processedData.domain,
      hasImage: !!processedData.image
    });
    
    res.json(processedData);

  } catch (error: any) {
    const clientIp = req.ip || 'unknown';
    logger.error(`Preview fetch error for IP ${clientIp}:`, {
      error: error.message,
      stack: error.stack,
      url: req.query.url,
      ip: clientIp
    });
    
    // Return sanitized error response
    const url = req.query.url as string;
    let domain = 'unknown';
    try {
      domain = url ? new URL(url).hostname : 'unknown';
    } catch {}
    
    res.status(500).json({
      error: 'Failed to fetch preview',
      message: 'Unable to load preview content',
      url,
      domain,
      success: false,
      fallback: {
        title: sanitizeText(`Preview of ${domain}`),
        description: sanitizeText('Unable to load preview content'),
        image: null,
        domain,
        siteName: sanitizeText(domain)
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced Batch preview endpoint
app.post('/api/preview/batch', previewLimiter, validateBatchRequest, async (req: any, res: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid request parameters',
        details: errors.array()
      });
    }

    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const { urls } = req.body;

    // Check if IP is auto-blocked (much more permissive)
    const blockedCount = (blockedAttempts.get(`blocked_${clientIp}`) as number) || 0;
    if (blockedCount >= 50) { // Updated from 5 to 50
      return res.status(403).json({
        error: 'Access denied',
        message: 'Your IP has been temporarily blocked'
      });
    }

    // Validate all URLs before processing
    const urlSafetyChecks = await Promise.all(
      urls.map(async (url: string) => ({
        url,
        safety: await isUrlSafe(url)
      }))
    );
    
    const invalidUrls = urlSafetyChecks.filter(check => !check.safety.safe);
    if (invalidUrls.length > 0) {
      trackSuspiciousActivity(clientIp, 'batch_unsafe_urls', JSON.stringify(invalidUrls));
      return res.status(403).json({
        error: 'Invalid URLs detected',
        message: 'Some URLs are not permitted for security reasons',
        invalidUrls: invalidUrls.map(u => ({ url: u.url, reason: u.safety.reason }))
      });
    }

    logger.info(`Batch fetching previews for ${urls.length} URLs`, { ip: clientIp });

    const results = await Promise.allSettled(
      urls.map(async (url: string) => {
        const previewData = await getLinkPreview(url, { timeout: 6000 });
        return {
          url,
          success: true,
          data: {
            title: sanitizeText((previewData as any).title || ''),
            description: sanitizeText((previewData as any).description || ''),
            image: (previewData as any).images?.find(isImageUrlSafe),
            domain: new URL(url).hostname
          }
        };
      })
    );

    const processedResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          url: urls[index],
          success: false,
          error: 'Failed to fetch preview'
        };
      }
    });

    logger.info(`Batch processing completed`, {
      ip: clientIp,
      total: urls.length,
      successful: processedResults.filter(r => r.success).length
    });

    res.json({
      results: processedResults,
      total: urls.length,
      successful: processedResults.filter(r => r.success).length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error(`Batch preview error:`, {
      error: error.message,
      ip: req.ip
    });
    
    res.status(500).json({
      error: 'Batch preview failed',
      message: 'Unable to process batch request'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(`Unhandled error:`, {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, () => {
  // Clear any existing blocks on startup for fresh start
  const clearedBlocks = blockedAttempts.keys().length;
  blockedAttempts.flushAll();
  securityCache.flushAll();
  
  logger.info(`🚀 Secure URL Preview Server running on http://localhost:${PORT}`);
  logger.info(`🧹 Cleared ${clearedBlocks} blocked IPs on startup for fresh start`);
  logger.info(`📋 Available endpoints:`);
  logger.info(`   GET  /health                 - Health check`);
  logger.info(`   GET  /api/preview?url=...    - Single URL preview`);
  logger.info(`   POST /api/preview/batch      - Batch URL previews`);
  logger.info(`   POST /api/admin/clear-blocks - Clear blocked IPs`);
  logger.info(`🛡️  Enhanced security measures enabled:`);
  logger.info(`   - Domain blacklist: ${SECURITY_BLOCKED_DOMAINS.length} blocked domains`);
  logger.info(`   - SSRF protection: Basic protection against private IPs`);
  logger.info(`   - Rate limiting: Permissive (300 req/15min, 50 preview/5min)`);
  logger.info(`   - Auto-blocking: Very permissive (50 attempts threshold)`);
  logger.info(`   - Content sanitization: XSS protection enabled`);
  logger.info(`   - Security headers: Helmet.js enabled`);
  logger.info(`   - Logging: Winston with structured logs`);
  logger.info(`   - Input validation: Express-validator enabled`);
  logger.info(`   - Whitelist: REMOVED - All domains allowed except private/malicious`);
});

// Graceful shutdown with cleanup
const gracefulShutdown = (signal: string) => {
  logger.info(`🛑 Received ${signal}. Shutting down gracefully...`);
  
  server.close(() => {
    logger.info('✅ HTTP server closed');
    
    // Clear caches
    securityCache.flushAll();
    blockedAttempts.flushAll();
    
    // Close logger
    logger.end();
    
    process.exit(0);
  });
  
  // Force exit after 30 seconds
  setTimeout(() => {
    logger.error('❌ Forced exit due to timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

export default app; 