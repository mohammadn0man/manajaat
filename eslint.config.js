// Flat config for ESLint v8+ using compat to consume legacy shareable configs
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');

const compat = new FlatCompat();

module.exports = [
  // Ignore patterns
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Base JS recommended
  js.configs.recommended,

  // Bring in legacy shareable configs under flat config
  ...compat.extends('expo', 'prettier'),

  // TypeScript + Prettier integration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
  