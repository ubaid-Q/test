export default {
  // The root of your source code and test files
  roots: ['.'],

  // A list of file extensions your modules use
  moduleFileExtensions: ['js'],

  // Test environment (you can change this based on your needs)
  testEnvironment: 'node',

  // Test file patterns (assuming your test files have a .test.js extension)
  testMatch: ['**/*.test.js'],

  // Transform JavaScript files using Babel
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
