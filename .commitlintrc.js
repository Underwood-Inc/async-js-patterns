export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'body-max-line-length': [2, 'always', 200],
  },
};
