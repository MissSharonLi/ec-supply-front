// eslint.config.js
import antfu from '@antfu/eslint-config'
import vue from 'eslint-plugin-vue'

export default antfu(
  {
    formatters: true,
    unocss: true,
    vue: true,
    typescript: true,
    markdown: true,
    ignores: ['**/dist', '**/.output', '**/node_modules']
  },
  {
    plugins: {
      vue
    }
  },
  {
    rules: {
      'antfu/if-newline': 'off', // 禁用 if-newline
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
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always'
        }
      ],
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'below'
        }
      ],
      // Vue 文件缩进配置
      'vue/script-indent': [
        'error',
        2,
        {
          baseIndent: 0, // 脚本块的基础缩进为0
          switchCase: 1 // switch 语句缩进1级
        }
      ],

      // 针对模板的缩进配置
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true
        }
      ],
      'style/indent': 'off', // 禁用全局缩进规则
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 5,
          multiline: {
            max: 1
          }
        }
      ],
      'no-trailing-spaces': ['error'], // 禁用行尾空格
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style']
        }
      ],
      'no-dupe-keys': 'error', // JS/TS 对象字面量中禁止重复键名
      'vue/no-duplicate-attributes': 'error', // Vue 模板中禁止重复属性
      'vue/no-dupe-keys': 'error', // Vue 组件内属性、methods 等重复
      'no-dupe-class-members': 'error', // 禁止类成员中出现重复的名称
      'quote-props': 'off',
      'arrow-parens': ['error', 'always'],
      'style/arrow-parens': ['error', 'always']
    }
  }
)
