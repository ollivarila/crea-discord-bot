module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    indent: [
      'error',
      2,
    ],
    semi: 0,
    'no-restricted-syntax': [
      'error', 'ForInStatement', 'LabeledStatement', 'WithStatement',
    ],
    'arrow-parens': 0,
    'consistent-return': 0,
    'no-plusplus': 0,
    'no-await-in-loop': 0,
    'no-underscore-dangle': 0,
  },
};
