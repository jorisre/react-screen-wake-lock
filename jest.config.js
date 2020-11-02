module.exports = {
  setupFiles: [
    '@testing-library/react/dont-cleanup-after-each',
    'jest-wake-lock-mock',
  ],
  restoreMocks: true,
  globals: {
    __DEV__: true,
  },
};
