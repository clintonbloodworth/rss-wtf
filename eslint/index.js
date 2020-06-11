// Exports
module.exports = {
  extends: ['airbnb-base'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
  },
  rules: {
    'arrow-body-style': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'func-names': ['error', 'never'],
    'import/first': 'off',
    'import/no-mutable-exports': 'off',
    'import/order': ['error', { alphabetize: { order: 'asc', caseInsensitive: true } }],
    'import/prefer-default-export': 'off',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'max-len': ['error', { code: 120, ignoreComments: true }],
    'no-console': 'off',
    'no-continue': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-mixed-operators': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': 'off',
    'no-restricted-globals': 'off',
    'no-restricted-syntax': 'off', // "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them."
    'no-shadow': 'off',
    'no-unused-vars': ['error', { args: 'after-used' }],
    'no-use-before-define': 'off',
    'object-curly-newline': ['error', { consistent: true }],
  },
};
