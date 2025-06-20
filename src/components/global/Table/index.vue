<script lang="ts" setup>
import { ElTable, ElTableColumn } from 'element-plus'
import { debounce, throttle } from 'lodash'
import { cloneDeep } from 'lodash-es' // 使用高效深拷贝
import { computed, defineEmits, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

// Column 类型定义
interface RenderScope {
  column: any // 当前列
  $index: number // 当前行索引
  row: any // 当前行
}
// Column 类型
interface Column {
  prop: string
  label?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  header?: (scope: { column: any }) => any // 对应 #header 插槽
  render?: (scope: RenderScope) => any // 对应默认插槽
  [key: string]: any
}
// Props 类型
interface Props {
  border?: boolean
  maxHeight?: number
  dataSource?: any[]
  columns?: Column[]
  height?: number
  isfix?: boolean // 是否开启固定
  isHeight?: boolean // 是否开启自定义高度
  loading?: boolean
  size?: string
  pageDisabled?: boolean
  currentPage?: number
  pageSize?: number
  total?: number
  hasPagination?: boolean // 是否开启分页
  isPageBackground?: boolean // 是否开启分页背景
  pageSizeOptions?: number[] // 分页选项
}
// 默认值
const props = withDefaults(defineProps<Props>(), {
  dataSource: () => [],
  columns: () => [],
  isfix: false,
  height: 0,
  isHeight: false,
  loading: false,
  size: 'small',
  pageDisabled: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  border: true,
  hasPagination: true,
  isPageBackground: true,
  pageSizeOptions: () => [10, 50, 100, 150]
})

// Emits
const emit = defineEmits<{
  (e: 'handleSizeChange', value: number): void
  (e: 'handleCurrentChange', value: number): void
}>()

// 窗口高度
const commonTable = ref() // 表格对象
const clientHeight = ref(document.documentElement.clientHeight)// 计算动态表格高度
const tableHeight = computed(() => {
  if (props.isHeight) {
    return props.height || null
  }
  else {
    return clientHeight.value || 600
  }
})
// 设置表格高度
function setTableHeight() {
  clientHeight.value = window.innerHeight - commonTable.value.$el.getBoundingClientRect().top - 70
  nextTick(() => {
    if (commonTable.value && commonTable.value.doLayout) {
      commonTable.value.doLayout()
    }
  })
}
const debouncedSetTableHeight = debounce(setTableHeight, 50) // 调整 debounce 值
const throttledSetTableHeight = throttle(setTableHeight, 50) // 调整 throttle 值

// 挂载时设置表格高度
onMounted(() => {
  window.addEventListener('resize', throttledSetTableHeight)
  nextTick(() => {
    debouncedSetTableHeight()
  })
})
// 销毁时移除事件
onBeforeUnmount(() => {
  window.removeEventListener('resize', throttledSetTableHeight)
})
// 选择每页条数
function handleSizeChange(val: number) {
  console.warn(`${val} items per page`)
  emit('handleSizeChange', val)
}
// 选择当前页
function handleCurrentChange(val: number) {
  console.warn(`current page: ${val}`)
  emit('handleCurrentChange', val)
}
</script>

<template>
  <ElTable
    ref="commonTable"
    v-loading="loading"
    class="standardTable"
    :data="dataSource"
    :border="border"
    :height="isfix ? 360 : (tableHeight ?? 600)"
  >
    <ElTableColumn
      v-for="col in columns"
      v-bind="col"
      :key="col.prop"
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
          :row="cloneDeep(row)"
          :column="column"
          :$index="$index"
        />
      </template>
    </ElTableColumn>
  </ElTable>
  <ElPagination
    v-if="hasPagination"
    class="pagination"
    :current-page="currentPage"
    :page-size="pageSize"
    :page-sizes="pageSizeOptions"
    :size="size === 'default' ? 'default' : size === 'small' ? 'small' : 'large'"
    :disabled="pageDisabled"
    :background="isPageBackground"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<style lang="scss">
.standardTable {
  .ep-table__header-wrapper th {
    background-color: var(--ep-table-row-hover-bg-color);
    color: var(--ep-text-color-primary);
  }
}
.pagination {
  padding: 10px 20px;
  display: block;
  text-align: right;
  line-height: 28px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid var(--ep-border-color-light);
  border-top: none;
  .ep-pagination__total,
  .ep-pagination__sizes {
    float: left;
    vertical-align: middle;
  }
}
.pagination.ep-pagination--small span:not([class*='suffix']) {
  line-height: 28px;
  height: 28px;
}
.pagination.ep-pagination.ep-pagination--small .btn-next,
.pagination.ep-pagination.ep-pagination--small .btn-prev,
.pagination.ep-pagination.ep-pagination--small .ep-pager,
.pagination.ep-pagination.ep-pagination--small .ep-pagination__jump {
  display: inline-block;
  vertical-align: middle;
}
</style>
