// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  vue: true,
  typescript: true,
  markdown: true,
  ignores: [
    '**/dist',
    '**/.output',
    '**/node_modules'
  ]
}, {
  rules: {
    'ts/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': true,
        'ts-ignore': true,
        'ts-nocheck': false,
        'ts-check': false
      }
    ],
    'style/semi': ['error', 'never'],
    'style/comma-dangle': ['error', 'never'],
    'style/function-paren-newline': ['error', 'consistent'],
    'style/linebreak-style': ['error', 'unix'],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: []
      }
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'vue/no-unused-vars': 'error',
    'vue/no-unused-components': 'error',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    // 添加这些关键规则修复换行问题
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always'
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: 3,
      multiline: 1
    }],
    'vue/first-attribute-linebreak': ['error', {
      singleline: 'ignore',
      multiline: 'below'
    }]
  }
})
