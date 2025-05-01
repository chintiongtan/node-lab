export default {
  coveragePathIgnorePatterns: ['index.ts'],
  preset: 'ts-jest',
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      setupFiles: ['<rootDir>/jest.setup.ts'],
      testPathIgnorePatterns: ['\\.int\\.test\\.ts'],
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      setupFiles: ['<rootDir>/jest.setup.ts'],
      testMatch: ['**/*.int.test.ts'],
    },
  ],
};
