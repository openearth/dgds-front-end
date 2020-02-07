module.exports = {
  moduleNameMapper: {
    '\\.md$': '<rootDir>/__mocks__/fileMock.js',
    '^~\\/(.*)(icon-.+\\.svg)$': '<rootDir>/$1/icon-empty.svg',
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: ['js', 'vue', 'json', 'md'],
  setupFiles: [
    '<rootDir>/.jest/register-context.js'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    // '<rootDir>/components/**/*.vue',
    '<rootDir>/layouts/**/*.vue',
    '<rootDir>/lib/**/*.js',
    '<rootDir>/middleware/**/*.js',
    // '<rootDir>/pages/**/*.vue',
    '<rootDir>/plugins/**/*.js',
    '<rootDir>/store/**/*.js'
  ]
}
