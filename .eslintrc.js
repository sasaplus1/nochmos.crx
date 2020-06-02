module.exports = {
  env: {
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended-script',
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'plugin:node/recommended-module',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint'
      ],
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint']
    },
    {
      files: ['rollup.config.js'],
      rules: {
        'node/no-unpublished-import': 'off',
        'node/no-unsupported-features/es-syntax': 'off'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  root: true,
  settings: {
    node: {
      allowModules: [
        '@storybook/addon-actions',
        '@storybook/addon-knobs',
        'preact'
      ],
      tryExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.node']
    },
    react: {
      pragma: 'h',
      version: 'detect'
    }
  }
};
