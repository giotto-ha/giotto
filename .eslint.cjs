/* eslint-env node */
module.exports = {
  parser: '@typescript-eslint/parser',
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  "parserOptions": {
    project: ['./packages/*/tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  "env": {
    "es6": true,
    "node": true
  },
  root: true,
  "rules": {
    "@typescript-eslint/strict-boolean-expressions": "error"
  }
};