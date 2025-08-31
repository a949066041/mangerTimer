import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,

  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  typescript: true,

  jsonc: true,
  yaml: false,

  ignores: [
    'custom.json',
    'routeTree.gen.ts',
  ],
}, {
  rules: {
    'node/prefer-global/process': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'prefer-promise-reject-errors': 'off',
  },
})
