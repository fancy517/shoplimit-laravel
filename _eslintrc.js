module.exports = {
  extends: ["standard", "plugin:vue/recommended"],
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true
  },
  rules: {
    "space-before-function-paren": 0,
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 5,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
