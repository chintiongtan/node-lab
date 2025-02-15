export default {
  coveragePathIgnorePatterns: ['index.ts'],
  preset: 'ts-jest',
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testPathIgnorePatterns: ['\\.int\\.test\\.ts'],
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testMatch: ['**/*.int.test.ts'],
    },
  ],
  setupFiles: ['<rootDir>/jest.setup.ts'],
};
