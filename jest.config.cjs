

module.exports = {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: 'tsconfig.test.json'
    }
  },
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/setupTests.js'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json', // Make sure this points correctly to your tsconfig for tests
        useESM: true,
      },
    ],
  },
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)", // Matches test files in __tests__ directories
    "**/?(*.)+(spec|test).[jt]s?(x)", // Matches test files in other directories
    "src/tests/**/*.test.[jt]s?(x)" // Include test files in src/tests directory
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',  // Support for .js extensions in imports in TypeScript
    '^worker-loader!(.*)': '<rootDir>/__mocks__/Worker.cjs'
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [
    '/node_modules/',  // Ignore transformations on node_modules except for ES modules that need it
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
