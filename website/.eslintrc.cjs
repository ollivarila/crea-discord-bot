module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['react-app', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
}
