module.exports = {
  extends: ['../../.eslintrc.base.js'],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Web & React Specific Rules
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
  },
};
