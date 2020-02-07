module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:vue/recommended',
    'eslint:recommended',
    'standard'
  ],
  plugins: [

  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'off'
  }
}
