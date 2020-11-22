module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: [
    '@testing-library/react/dont-cleanup-after-each',
    'jest-wake-lock-mock',
  ],
  restoreMocks: true,
  clearMocks: true,
};
