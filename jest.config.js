module.exports = {
  // verbose: true,
  setupFiles: ['jest-localstorage-mock', '<rootDir>/tests/testSetups.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
  },
  rootDir: 'client',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/../coverage/client',
  collectCoverageFrom: ['**/*.{js,jsx}'],
  coveragePathIgnorePatterns:
    ['<rootDir>/tests',
      '<rootDir>/components/RecipeDetails',
      '<rootDir>/components/Root.jsx',
      '<rootDir>/index.jsx',
      '<rootDir>/store.js'],
  setupTestFrameworkScriptFile: '<rootDir>/../node_modules/jest-enzyme/lib/index.js',
};
