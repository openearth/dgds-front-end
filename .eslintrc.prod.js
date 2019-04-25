const merge = require('lodash/merge')
const baseConfig = require('./.eslintrc.js')

const prodRules = {
  rules: {
    'no-console': 'error',
    'no-unused-vars': 'error'
  }
}

module.exports = merge(baseConfig, prodRules)
