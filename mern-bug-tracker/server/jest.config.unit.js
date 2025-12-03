// backend/jest.config.unit.js (Adjusted)
module.exports = {
  testEnvironment: 'node',
  // ADJUSTED: Look specifically inside the 'tests/unit' directory
  testMatch: ['**/tests/unit/**/*.test.js'],
  clearMocks: true,
  coverageDirectory: './coverage/unit',
  // Ensure paths reflect your structure (e.g., middleware, utils)
  collectCoverageFrom: ['middleware/**/*.js', 'utils/**/*.js'],
};