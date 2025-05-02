// import { browser, node, jest } from 'globals';
import pkg from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const { browser, node, jest } = pkg;

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    ignores: ['node_modules', 'dist', 'public'],
    languageOptions: {
      globals: {
        // ...globals.browser,
        // ...globals.node,
        // ...global.jest,
        ...browser,
        ...node,
        ...jest,
      },
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
  },
);
