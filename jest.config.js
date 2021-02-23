// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
}
