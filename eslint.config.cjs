const jest = require('eslint-plugin-jest')
const globals = require('globals')
const js = require('@eslint/js')

const { FlatCompat } = require('@eslint/eslintrc')

const { includeIgnoreFile } = require('@eslint/compat')

const path = require('node:path')
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})
const gitignorePath = path.resolve(__dirname, '.gitignore')

module.exports = [
  {
    ignores: ['**/dist/', '**/coverage/', '**/reports/'],
  },
  includeIgnoreFile(gitignorePath),
  ...compat.extends('eslint:recommended', 'plugin:jest/recommended'),
  {
    plugins: {
      jest,
    },

    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...jest.environments.globals.globals,
        ...globals.node,
      },

      ecmaVersion: 2018,
      sourceType: 'module',
    },

    rules: {
      'no-console': 'off',
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],

      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
        },
      ],
    },
  },
]
