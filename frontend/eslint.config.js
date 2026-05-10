/**
 * ============================================================
 * 🛡️ TITAN STATIC ANALYSIS PROTOCOL (v4.2 - Production)
 * Ref: Report Section 4.1 (Quality Control & Standards)
 * Purpose: Enforcing architectural consistency and code hygiene.
 * ============================================================
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // 🚫 BUFFER_EXCLUSION: Ignoring build artifacts
  globalIgnores(['dist', 'node_modules', 'public']),

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022, // Upgraded for modern syntax support
      globals: {
        ...globals.browser,
        ...globals.node, // Added Node support for config files
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // 🛰️ RECOMMENDED BASELINE
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // 🕹️ INDUSTRIAL HANDSHAKE RULES
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // 📝 NODE_HYGIENE: Custom variable suppression for constants
      'no-unused-vars': [
        'error', 
        { 
          vars: 'all', 
          args: 'after-used', 
          ignoreRestSiblings: true,
          varsIgnorePattern: '^[A-Z_]' 
        }
      ],

      // 🛡️ SECURITY_STRIKE: Preventing console clutter in production
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
])