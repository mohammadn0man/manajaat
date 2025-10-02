module.exports = {
  root: true,
  extends: ['expo', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['dist/', 'node_modules/'],
  rules: {
    'prettier/prettier': 'error',
  },
};

module.exports = {
  extends: ['expo'],
  npmparser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  ignorePatterns: ['node_modules/', '.expo/', 'dist/', 'build/'],
  env: {
    node: true,
    es6: true,
  },
};