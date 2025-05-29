// .cz-config.cjs
module.exports = {
  types: [
    { value: 'feat', name: '✨ feat: 新功能' },
    { value: 'fix', name: '🐛 fix: Bug修复' },
    { value: 'docs', name: '📝 docs: 文档更新' },
    { value: 'style', name: '💄 style: 样式/格式' },
    { value: 'refactor', name: '♻️ refactor: 代码重构' },
    { value: 'perf', name: '⚡️ perf: 性能优化' },
    { value: 'test', name: '✅ test: 测试相关' },
    { value: 'chore', name: '🔧 chore: 构建/工具' },
    { value: 'revert', name: '⏪ revert: 回退提交' }
  ],
  messages: {
    type: '选择提交类型:',
    subject: '简短描述(必填):',
    body: '详细描述(可选):',
    confirmCommit: '确认提交?'
  },
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['scope', 'body', 'breaking', 'footer'],
  subjectLimit: 100
}
