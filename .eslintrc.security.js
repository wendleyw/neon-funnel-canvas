// 🛡️ ESLint Security & Best Practices Configuration
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'react-refresh',
  ],
  rules: {
    // 🔒 Security Rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    
    // 🛡️ Prevent XSS
    'react/no-danger': 'error',
    'react/no-danger-with-children': 'error',
    
    // 📊 Type Safety
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    
    // 🧹 Clean Code
    'max-len': ['error', { code: 100, ignoreUrls: true }],
    'max-lines-per-function': ['error', { max: 20 }],
    'complexity': ['error', { max: 10 }],
    'no-magic-numbers': ['error', { ignore: [0, 1, -1] }],
    
    // 📝 Naming Conventions
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'function',
        format: ['camelCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
      },
    ],
    
    // ⚡ Performance
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    
    // 💰 Resource Management
    'no-console': 'warn', // Should use proper logging
    'no-debugger': 'error',
    'no-alert': 'error',
    
    // 🔄 Best Practices
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'prefer-arrow-callback': 'error',
    
    // 🚨 Error Handling
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    
    // 📋 Code Organization
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      },
    ],
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      rules: {
        'max-lines-per-function': 'off', // Tests can be longer
        'no-magic-numbers': 'off', // Tests use many numbers
      },
    },
    {
      files: ['server/**/*.ts'],
      rules: {
        'no-console': 'off', // Server can use console for logging
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}; 