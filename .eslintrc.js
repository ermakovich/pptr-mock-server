module.exports = {
  extends: [
    './node_modules/dev-configs/.eslintrc.js',
    'plugin:jest/recommended',
  ],
  env: {
    commonjs: true,
    'jest/globals': true,
  },
  plugins: ['jest'],
  rules: {
    'no-console': 'off',
  },
};
