module.exports = {
  extends: ['eslint:recommended', 'plugin:jest/recommended'],
  env: {
    commonjs: true,
    'jest/globals': true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['jest'],
  rules: {
    'no-console': 'off',
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
  },
}
