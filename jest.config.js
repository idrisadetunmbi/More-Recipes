module.exports = {
  // verbose: true,
  setupFiles: ['jest-localstorage-mock'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  rootDir: 'client',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/../coverage/client',
  collectCoverageFrom: ['**/*.{js,jsx}'],
  setupTestFrameworkScriptFile: '<rootDir>/../node_modules/jest-enzyme/lib/index.js',
};
