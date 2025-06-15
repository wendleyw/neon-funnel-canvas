// Security Configuration
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  PREVIEW_RATE_LIMIT_WINDOW: parseInt(process.env.PREVIEW_RATE_LIMIT_WINDOW || '300000'), // 5 minutes
  PREVIEW_RATE_LIMIT_MAX: parseInt(process.env.PREVIEW_RATE_LIMIT_MAX || '10'),
  
  // Security thresholds
  MAX_SUSPICIOUS_ATTEMPTS: parseInt(process.env.MAX_SUSPICIOUS_ATTEMPTS || '5'),
  BLOCK_DURATION: parseInt(process.env.BLOCK_DURATION || '86400000'), // 24 hours
  
  // Content limits
  MAX_URL_LENGTH: parseInt(process.env.MAX_URL_LENGTH || '2000'),
  MAX_CONTENT_LENGTH: parseInt(process.env.MAX_CONTENT_LENGTH || '500'),
  MAX_BATCH_SIZE: parseInt(process.env.MAX_BATCH_SIZE || '5'),
  MAX_IMAGES_PER_PREVIEW: parseInt(process.env.MAX_IMAGES_PER_PREVIEW || '5'),
  
  // Timeouts
  PREVIEW_TIMEOUT: parseInt(process.env.PREVIEW_TIMEOUT || '8000'),
  BATCH_TIMEOUT: parseInt(process.env.BATCH_TIMEOUT || '6000'),
  SHUTDOWN_TIMEOUT: parseInt(process.env.SHUTDOWN_TIMEOUT || '30000'),
  
  // Cache configuration
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour
  CACHE_CHECK_PERIOD: parseInt(process.env.CACHE_CHECK_PERIOD || '600'), // 10 minutes
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE_MAX_SIZE: process.env.LOG_FILE_MAX_SIZE || '10m',
  LOG_FILE_MAX_FILES: parseInt(process.env.LOG_FILE_MAX_FILES || '5'),
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001'),
  
  // CORS origins
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:8083',
    'http://localhost:3000'
  ]
};

// Allowed domains for preview (can be extended via environment)
export const ALLOWED_DOMAINS = [
  'github.com',
  'www.github.com',
  'google.com',
  'www.google.com',
  'wikipedia.org',
  'www.wikipedia.org',
  'youtube.com',
  'www.youtube.com',
  'twitter.com',
  'www.twitter.com',
  'linkedin.com',
  'www.linkedin.com',
  'stackoverflow.com',
  'www.stackoverflow.com',
  'medium.com',
  'www.medium.com',
  'dev.to',
  'www.dev.to',
  'npmjs.com',
  'www.npmjs.com',
  'reddit.com',
  'www.reddit.com',
  'hackernews.com',
  'news.ycombinator.com',
  'producthunt.com',
  'www.producthunt.com',
  ...(process.env.ADDITIONAL_ALLOWED_DOMAINS?.split(',') || [])
];

// Blocked IP ranges and patterns
export const BLOCKED_RANGES = [
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

// Suspicious URL patterns
export const SUSPICIOUS_PATTERNS = [
  /\.onion$/i,
  /bit\.ly/i,
  /tinyurl/i,
  /t\.co/i,
  /goo\.gl/i,
  /ow\.ly/i,
  /\.tk$/i,
  /\.ml$/i,
  /\.ga$/i,
  /\.cf$/i,
  /\.pw$/i,
  /\.cc$/i,
  /short\.link/i,
  /tiny\.cc/i,
  /x\.co/i
];

// Content Security Policy configuration
export const CSP_CONFIG = {
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
    baseUri: ["'self'"],
    formAction: ["'self'"],
    upgradeInsecureRequests: [],
  }
};

// Security headers configuration
export const SECURITY_HEADERS = {
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  crossdomain: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
};

// Validation schemas
export const VALIDATION_RULES = {
  url: {
    isURL: { protocols: ['http', 'https'] },
    isLength: { max: SECURITY_CONFIG.MAX_URL_LENGTH },
    custom: (value: string) => {
      if (value.includes('<script') || value.includes('javascript:')) {
        throw new Error('Invalid URL content');
      }
      return true;
    }
  },
  batchUrls: {
    isArray: { min: 1, max: SECURITY_CONFIG.MAX_BATCH_SIZE }
  }
};

export default SECURITY_CONFIG; 