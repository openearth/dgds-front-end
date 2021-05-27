module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleFileExtensions: ['js', 'vue', 'json', 'md'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/layouts/**/*.vue',
    'src/lib/**/*.js',
    'src/plugins/**/*.js',
    'src/store/**/*.js'
  ]
}
