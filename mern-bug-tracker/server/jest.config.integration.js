module.exports = {
  // preset: "@shelf/jest-mongodb",
  testEnvironment: "node",

  testMatch: ["**/tests/integration/**/*.test.js"],

  clearMocks: true,
  coverageDirectory: "./coverage/integration",
  collectCoverageFrom: ["controllers/**/*.js", "routes/**/*.js"],
  transform: {
    "^.+\\.js$": "@swc/jest",
  },
};
