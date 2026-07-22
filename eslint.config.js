import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'functions/**',
    'add-sri.js',
    'createAdmin.js',
    'updateUser.js',
    'vite*.log',
    '**/*.html' // static prototypes
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // Node scripts / functions get Node globals (in case any slip past ignores)
  {
    files: ['functions/**/*.js', 'add-sri.js', 'createAdmin.js', 'updateUser.js'],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 }
    }
  }
])
