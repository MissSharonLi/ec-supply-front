const modules = import.meta.glob('./**/*.ts', { eager: true })
const result: Record<string, any> = {}

for (const path in modules) {
  const mod = modules[path] as { default: any }

  // 提取 key 名逻辑
  const isIndex = /\/index\.ts$/.test(path)
  const key = isIndex
    ? path.split('/')[1]
    : path.replace(/^\.\/|\.ts$/g, '').split('/')[1]

  result[key] = mod.default
}

export default result
