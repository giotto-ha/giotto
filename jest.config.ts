/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  projects: [
    {
      extensionsToTreatAsEsm: [".ts"],
      moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
      },
      preset: "ts-jest",
      testEnvironment: "node",
      transform: {},
      displayName: "Bus Connector",
      rootDir: "<rootDir>/packages/bus-connector",
      testMatch: ["<rootDir>/**/*.test.ts"],
    },
  ],
};
