module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', {allowTemplateLiterals: true}],
    semi: ['error', 'always'],
    'no-console': 'off',
  },
};
