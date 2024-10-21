// jest.config.ts
import { createDefaultPreset, type JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest', // Use ts-jest preset for TypeScript support
  testEnvironment: 'node', // Set the test environment to Node.js
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Supported file extensions
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'], // Patterns for test files
  transform: {
    ...createDefaultPreset().transform,


  },
};
export default jestConfig;
