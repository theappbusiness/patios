const jsExtends = [
  'eslint:recommended',
  'plugin:import/recommended',
  'prettier',
]

const tsExtends = [
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:import/recommended',
  'plugin:import/typescript',
  'prettier',
]

const jsPlugins = ['prettier', 'import', 'jest-formatting']

const tsPlugins = ['@typescript-eslint', ...jsPlugins]

const jsParserOptions = {
  ecmaVersion: 'latest',
  sourceType: 'module',
}

const tsParserOptions = {
  ...jsParserOptions,
  project: './tsconfig.json',
}

const jsRules = {
  eqeqeq: 'error',
  'import/no-default-export': 'error',
  'import/no-unresolved': 'error',
  'import/order': [
    'error',
    {
      pathGroups: [
        {
          group: 'external',
          pattern: '~shared/**',
          position: 'after',
        },
      ],
      pathGroupsExcludedImportTypes: ['builtin'],
    },
  ],
  'prettier/prettier': [
    'warn',
    {
      endOfLine: 'auto',
    },
  ],
  'jest-formatting/padding-around-describe-blocks': 2,
  'jest-formatting/padding-around-test-blocks': 2,
}

const tsRules = {
  ...jsRules,
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
}

module.exports = {
  env: {
    node: true,
  },
  extends: jsExtends,
  ignorePatterns: ['**/node_modules'],
  parserOptions: jsParserOptions,
  plugins: jsPlugins,
  root: true,
  rules: jsRules,
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: tsExtends,
      parser: '@typescript-eslint/parser',
      parserOptions: tsParserOptions,
      plugins: tsPlugins,
      rules: tsRules,
    },
  ],
}
