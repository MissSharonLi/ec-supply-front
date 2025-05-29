<script lang="ts" setup>
import { ElTable, ElTableColumn } from 'element-plus'

// Column 类型定义
interface RenderScope {
  column: any
  $index: number
  row: any
}

interface Column {
  prop: string
  label?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  header?: (scope: { column: any }) => any // 对应 #header 插槽
  render?: (scope: RenderScope) => any // 对应默认插槽
  [key: string]: any
}

defineProps<{
  dataSource: any[]
  columns: Column[]
  tableProps?: Record<string, any>
}>()
</script>

<template>
  <ElTable v-bind="tableProps" :data="dataSource" style="width: 100%">
    <ElTableColumn
      v-for="col in columns"
      :key="col.prop"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
      :align="col.align || 'center'"
    >
      <!-- Header slot -->
      <template v-if="col.header" #header="{ column }">
        <component :is="col.header" :column="column" />
      </template>

      <!-- Cell slot -->
      <template v-if="col.render" #default="{ row, column, $index }">
        <component
          :is="col.render"
          :row="row"
          :column="column"
          :$index="$index"
        />
      </template>
    </ElTableColumn>
  </ElTable>
</template>
