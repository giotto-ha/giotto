/* eslint-env node */
module.exports = {
  parser: '@typescript-eslint/parser',
  "extends": [
    'eslint:recommended',
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  "parserOptions": {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
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