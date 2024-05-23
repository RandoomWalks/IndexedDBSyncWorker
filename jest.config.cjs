module.exports = {
  preset: 'ts-jest/presets/default-esm',  // Ensuring ES Module support with ts-jest
  testEnvironment: 'node',                // Specifies the environment in which the tests are run
  transform: {
    // Transforms TypeScript and JavaScript files using Babel
    '^.+\\.(t|j)sx?$': [
      'babel-jest', {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' }, modules: 'auto' }],  // Target current Node version
          '@babel/preset-typescript'  // Add TypeScript support through Babel
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-transform-runtime']
        ]
      }
    ]
  },
  moduleNameMapper: {
    // Map module imports without '.js' extension, useful for resolving ES Modules
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // Additional mappings can go here
    '^worker-loader!(.*)': '<rootDir>/__mocks__/Worker.cjs',
    '\\.(worker\\.js)$': '<rootDir>/__mocks__/Worker.cjs'  // Map *.worker.js to your mock if using such patterns  
  },
  moduleDirectories: [
    'node_modules',  // Default directory for modules
    'src'            // If you structure your source files here
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx','.jsx'],  // Treat these extensions as ESM
  transformIgnorePatterns: [
    '/node_modules/',  // Typically, don't transform node_modules
    '^.+\\.module\\.(css|sass|scss)$'  // Ignore stylesheets
  ],
  setupFiles: [
    '<rootDir>/setupTests.js'  // Setup file for initializing test environment (e.g., polyfills)
  ],
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.js'  // Setup file for configuring or adding custom matchers
  ],
  collectCoverage: true,  // Enable coverage collection
  coverageDirectory: "coverage",  // Directory where coverage reports will be saved
  coverageReporters: ["text", "lcov"],  // Specify coverage reporters
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",  // Test files in __tests__ folder
    "**/?(*.)+(spec|test).[jt]s?(x)"  // Any files with spec or test in filename
  ]
};


// module.exports = {
//   preset: 'ts-jest/presets/default-esm',
//   globals: {
//     'ts-jest': {
//       useESM: true,
//     }
//   },
//   testEnvironment: 'node',
//   setupFiles: ['<rootDir>/setupTests.js'],
//   setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
//   transform: {
//     '^.+\\.(t|j)sx?$': [
//       'ts-jest',
//       {
//         tsconfig: '<rootDir>/tsconfig.test.json', // Make sure this points correctly to your tsconfig for tests
//         useESM: true,
//       },
//     ],
//   },
//   testMatch: [
//     "**/__tests__/**/*.test.[jt]s?(x)", // Matches test files in __tests__ directories
//     "**/?(*.)+(spec|test).[jt]s?(x)", // Matches test files in other directories
//     "src/tests/**/*.test.[jt]s?(x)" // Include test files in src/tests directory
//   ],
//   moduleNameMapper: {
//     '^(\\.{1,2}/.*)\\.js$': '$1',  // Support for .js extensions in imports in TypeScript
//     '^worker-loader!(.*)': '<rootDir>/__mocks__/Worker.cjs'
//   },
//   extensionsToTreatAsEsm: ['.ts', '.tsx'],
//   transformIgnorePatterns: [
//     '/node_modules/',  // Ignore transformations on node_modules except for ES modules that need it
//     '^.+\\.module\\.(css|sass|scss)$'
//   ],
//   moduleDirectories: ['node_modules', 'src'],
//   collectCoverage: true,
//   coverageDirectory: "coverage",
//   coverageReporters: ["text", "lcov"],
// };

// // jest.config.cjs
// module.exports = {
//   preset: 'ts-jest/presets/default-esm',
//   globals: {
//     'ts-jest': {
//       useESM: true,
//     }
//   },
//   testEnvironment: 'node',
//   transform: {
//     // Transform both TypeScript and JavaScript files
//     '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json', useESM: true }]
//   },
//   moduleNameMapper: {
//     // Ensure proper module resolution for ESM
//     '^(\\.{1,2}/.*)\\.js$': '$1',
//   },
//   extensionsToTreatAsEsm: ['.ts', '.js'],
//   transformIgnorePatterns: [
//     '/node_modules/', // Ignore node_modules by default, customize if needed
//   ],
//   moduleDirectories: ['node_modules', 'src'],
// };
