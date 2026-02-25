import type { Config } from 'jest';

const config: Config = {
  prettierPath: 'prettier-2',
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "assets/images/generated-icons": "identity-obj-proxy",
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    "^.+\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/test-utils/fileMock.ts"
  },
  modulePaths: [
    "<rootDir>/src"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/test-utils/setupTests.ts"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/assets/images/generated-icons/",
    ".styled.ts",
    ".types.ts",
    "index.ts",
    "reportWebVitals.ts",
    "routes.ts",
    "router.tsx",
    "main.tsx"
  ],
  modulePathIgnorePatterns: ["server"],
  transformIgnorePatterns: [
    "node_modules/(?!(dayjs)/)"
  ]
};

export default config;
