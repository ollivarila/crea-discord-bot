module.exports = {
  root: true,
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    indent: ['error', 2],
    semi: 0,
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'arrow-parens': 0,
    'consistent-return': 0,
    'no-plusplus': 0,
    'no-await-in-loop': 0,
    'no-underscore-dangle': 0,
    'object-curly-newline': 0,
  },
}
