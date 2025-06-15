import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PreRenderedAsset } from 'rollup';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseRollupOptions = {
    output: {
      // Manual chunk splitting for optimal caching
      manualChunks: {
        // Core React libraries
        'vendor-react': ['react', 'react-dom'],
        
        // UI component libraries
        'vendor-ui': [
          '@radix-ui/react-dialog',
          '@radix-ui/react-dropdown-menu',
          '@radix-ui/react-tooltip',
          '@radix-ui/react-popover',
          '@radix-ui/react-select',
          '@radix-ui/react-tabs',
          '@radix-ui/react-accordion',
          '@radix-ui/react-checkbox',
          '@radix-ui/react-switch'
        ],
        
        // Canvas and flow libraries
        'vendor-canvas': ['reactflow'],
        
        // Charts and visualization
        'vendor-charts': ['recharts'],
        
        // Utilities and smaller libraries
        'vendor-utils': [
          'clsx',
          'class-variance-authority',
          'tailwind-merge',
          'cmdk',
          'date-fns',
          'sonner',
          'zod'
        ],
        
        // Supabase and API
        'vendor-api': ['@supabase/supabase-js', '@tanstack/react-query'],
        
        // Form libraries
        'vendor-forms': ['react-hook-form', '@hookform/resolvers'],
        
        // Router
        'vendor-router': ['react-router-dom'],
        
        // Icons
        'vendor-icons': ['lucide-react']
      },
      
      // Optimize chunk naming for better caching
      chunkFileNames: () => `chunks/[name]-[hash].js`,
      
      // Optimize asset naming
      assetFileNames: (assetInfo: PreRenderedAsset) => {
        const name = assetInfo.name || 'asset';
        
        if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(name)) {
          return `images/[name]-[hash][extname]`;
        }
        
        if (/\.(css)$/i.test(name)) {
          return `styles/[name]-[hash][extname]`;
        }
        
        if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
          return `fonts/[name]-[hash][extname]`;
        }
        
        return `assets/[name]-[hash][extname]`;
      },
    },
    
    // External dependencies (if any need to be excluded)
    external: mode === 'production' ? [] : undefined,
  };

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Target modern browsers for smaller bundles
      target: 'es2020',
      
      // Optimize chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // Source maps only in development
      sourcemap: mode === 'development',
      
      // Optimize minification
      minify: 'esbuild',
      
      rollupOptions: mode === 'production' ? {
        ...baseRollupOptions,
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        },
      } : baseRollupOptions,
      
      // Additional optimizations
      cssCodeSplit: true,
      assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@supabase/supabase-js',
        'reactflow',
        'lucide-react',
        'sonner',
        'clsx',
        'tailwind-merge'
      ],
      exclude: ['lovable-tagger'], // Development only
    },
    
    // Preview configuration for production builds
    preview: {
      port: 3000,
      host: true,
    },
    
    // Development optimizations
    ...(mode === 'development' && {
      esbuild: {
        // Remove console.log in production builds but keep in development
        drop: [],
      },
    }),
    
    // Production optimizations
    ...(mode === 'production' && {
      esbuild: {
        // Remove console.log, console.warn, debugger in production
        drop: ['console', 'debugger'],
        legalComments: 'none',
      },
      define: {
        // Remove development-only code
        'process.env.NODE_ENV': '"production"',
      },
    }),
  };
});
