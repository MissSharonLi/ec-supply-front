<script lang="ts" setup>
import type { ColProps, DatePickType, FormInstance, FormRules, RowProps } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import {
  ElAutocomplete,
  ElButton,
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElCol,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElOption,
  ElPopover,
  ElRadio,
  ElRadioGroup,
  ElRow,
  ElSelect,
  ElSwitch,
  ElTimePicker
} from 'element-plus'
import isEqual from 'lodash/isEqual' // 添加深度比较工具
import {
  computed,
  defineEmits,
  defineProps,
  onMounted,
  ref,
  watch,
  withDefaults
} from 'vue'
// import InputFile from './InputFile.vue'
// import InputFileImage from './InputFileImage.vue'

// 类型定义
interface FormItemOption {
  label: string
  value: any
  text?: string
  [key: string]: any
}

interface FormItemLabelAttrs {
  type?: string
  prop?: string
  options?: FormItemOption[]
  slotName?: string
}

// 更新 FormItem 接口，添加 value 属性
interface FormItem {
  prop: string
  label?: string
  type: string
  otherAttrs?: Record<string, any>
  options?: FormItemOption[]
  inputOtherAttrs?: Record<string, any>
  slots?: string | Array<{ name: string, alias?: string, text?: string }>
  colAttrs?: ColProps
  show?: boolean
  txtFormat?: Record<string, string>
  labelAttrs?: FormItemLabelAttrs
  xlLabel?: boolean
  auto?: boolean
  desc?: string
  customValue?: string
  unit?: string
  inputNativeOn?: Record<string, string>
  value?: any // 添加 value 属性
}

interface CustomFormProps {
  rowAttrs?: RowProps
  isFilter?: boolean
  filterLimitSize?: number
  isAuto?: boolean
  isMore?: boolean
  size?: 'large' | 'default' | 'small'
  labelWidth?: string
  values: Record<string, any>
  rules?: FormRules
  loading?: boolean
  formItem: FormItem[]
  inlineMessage?: boolean
}

const props = withDefaults(defineProps<CustomFormProps>(), {
  rowAttrs: () => ({ gutter: 20, justify: 'start', tag: 'ElRow' }),
  isFilter: false,
  filterLimitSize: 1,
  isAuto: false,
  isMore: true,
  size: 'small',
  labelWidth: '85px',
  rules: () => ({}),
  loading: false,
  inlineMessage: false
})

// 允许 emit 任意事件类型
const emit = defineEmits<{
  (e: 'setRef', form: FormInstance | null): void
  (e: 'toggle'): void
  (e: 'update:values', values: Record<string, any>): void
  // 添加动态事件声明
  (e: `${string}Change`, ...args: any[]): void
  (e: `${string}Input`, ...args: any[]): void
  (e: `${string}Focus`, ...args: any[]): void
  (e: `${string}Blur`, ...args: any[]): void
  (e: `${string}Visible-change`, ...args: any[]): void
  (e: string, ...args: any[]): void // 允许任意事件
}>()

// 表单引用
const formRef = ref<FormInstance | null>(null)
const customFormRowRef = ref<HTMLElement | null>(null)

// 响应式状态
const isShift = ref(false)
const isToggle = ref(false)
const selectData = ref<FormItem[]>([])

// 计算属性
const toggleText = computed(() => !isToggle.value ? '更多筛选' : '收起')
const iconClass = computed(() => !isToggle.value ? 'el-icon-arrow-down' : 'el-icon-arrow-up')
const iconComponent = computed(() => !isToggle.value ? ArrowDown : ArrowUp)
const colAttrs = computed(() => props.isAuto ? { sm: 12, md: 8, lg: 6, xl: 4 } : {})
const spanAttrs = computed(() => ({ sm: 8, md: 6, lg: 4, xl: 3 }))
const shiftIcon = computed(() => !isShift.value ? 'el-icon-arrow-up' : 'el-icon-arrow-down')
const shiftIconComponent = computed(() => !isShift.value ? ArrowUp : ArrowDown)

// 使用内部状态管理表单值和可见性
const itemVisibility = ref<Record<string, boolean>>({})
// 使用 computed 创建基于 props 的响应式引用
const formValues = computed({
  get: () => props.values,
  set: (newValue) => {
    // 只有当值实际改变时才触发更新
    if (!isEqual(newValue, props.values)) {
      emit('update:values', newValue)
    }
  }
})

// 初始化可见性状态（不再需要初始化表单值）
function initVisibility() {
  props.formItem.forEach((item, index) => {
    itemVisibility.value[item.prop]
      = !props.isFilter
        || index < props.filterLimitSize
        || item.type === 'slot'
  })
}

// 监听表单项变化
watch(() => props.formItem, () => {
  initVisibility()
  if (props.isFilter && props.isMore) {
    setFilterHeight()
  }
}, { deep: true, immediate: true }) // 立即执行初始化

// 值变化时触发更新事件
watch(formValues, (newValues) => {
  if (newValues === props.values) return
  emit('update:values', newValues)
}, { deep: true })

// 修复 setFilterHeight
function setFilterHeight() {
  props.formItem.forEach((item, index) => {
    if (index + 1 > props.filterLimitSize && item.type !== 'slot') {
      itemVisibility.value[item.prop] = isToggle.value
    }
  })
}

// 修复 shiftForm
function shiftForm() {
  isShift.value = !isShift.value
  props.formItem.forEach((item, index) => {
    if (
      !isToggle.value
      && index + 1 > props.filterLimitSize
      && item.type !== 'slot'
      && props.isMore
    ) {
      itemVisibility.value[item.prop] = isToggle.value
    }
    else {
      itemVisibility.value[item.prop] = !isShift.value
    }
  })
  emit('toggle')
  setSelectArray()
  setTableHeight()
}

// 方法
function labelFormat(label?: string) {
  if (label !== undefined) return `${label}：`
  return label
}

function getArrayFromString(str?: string): string[] {
  if (!str) return []
  return str
    .replace(/[\n,，；;]/g, ' ')
    .split(' ')
    .filter((item) => item !== '')
}

function slotFormat(value: string | { name?: string, text?: string, alias?: string }) {
  if (typeof value === 'object') {
    return {
      name: value.name || '',
      text: value.text || '',
      alias: value.alias || ''
    }
  }
  return { name: '', text: '', alias: '' }
}

function nativeOnEmit(item: FormItem, type: string, event: Event) {
  if (item.inputNativeOn && item.inputNativeOn[type]) {
    emit(item.inputNativeOn[type], item, event)
  }
}

function getEvents(item: FormItem) {
  const events: Record<string, (event: Event) => void> = {}

  // 通用事件处理
  const commonEvents = ['change', 'input', 'focus', 'blur', 'visible-change']
  commonEvents.forEach((eventName) => {
    events[eventName] = (...args: any[]) => {
      emit(`${item.prop}${capitalize(eventName)}`, ...args)
    }
  })

  // 特殊处理原生事件
  if (item.inputNativeOn) {
    Object.entries(item.inputNativeOn).forEach(([eventName, emitName]) => {
      events[eventName] = (event: Event) => {
        emit(emitName, item, event)
      }
    })
  }

  return events
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function isInput(type: string) {
  const inputTypes = ['text', 'textarea', 'password', 'url', 'email', 'search']
  return inputTypes.includes(type)
}

// 修复日期选择器类型检查
function isDatePickerOrDatetimePicker(type: string): type is DatePickType {
  const dateTypes: DatePickType[] = [
    'year',
    'month',
    'date',
    'dates',
    'week',
    'datetime',
    'datetimerange',
    'daterange',
    'monthrange',
    'yearrange'
  ]
  return dateTypes.includes(type as DatePickType)
}

// 添加日期选择器类型转换方法
function getDatePickerType(type: string): DatePickType {
  return type as DatePickType
}

function toggleMore() {
  isToggle.value = !isToggle.value
  setFilterHeight()
  setTableHeight()
}

function setTableHeight() {
  emit('toggle')
}

// 修复 setSelectArray 函数
function setSelectArray() {
  // 创建临时类型以包含 value 属性
  type FormItemWithValue = FormItem & { value?: string }

  const newItems: FormItemWithValue[] = JSON.parse(JSON.stringify(props.formItem))

  newItems.forEach((item) => {
    const value = formValues.value[item.prop]
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const separator = item.type === 'select' || item.type === 'cascader' ? '；' : ' 至 '
          if (item.type === 'select' || item.type === 'cascader') {
            const labels: string[] = []
            value.forEach((val) => {
              const option = item.options?.find((opt) => opt.value === val)
              if (option) labels.push(option.label || option.text || '')
            })
            item.value = labels.join(separator)
          }
          else if (item.type === 'datetimerange' || item.type === 'daterange') {
            item.value = value.join(separator)
          }
          else {
            item.value = value.join(separator)
          }
        }
      }
      else {
        if (item.type === 'textarea' || item.labelAttrs) {
          const separators = [' ', ',', '，', ';', '；', '\n']
          const separator = separators.find((sep) => value.includes(sep)) || ' '
          item.value = value.split(separator).join('；')
        }
        else if (item.type === 'select' || item.type === 'checkbox' || item.type === 'cascader') {
          const option = item.options?.find((opt) => opt.value === value)
          item.value = option ? option.label || option.text || '' : ''
        }
        else {
          item.value = value
        }
      }
    }
  })

  selectData.value = newItems.filter((item) => item.value !== undefined) as FormItem[]
}

function visibleChange(val: boolean) {
  if (val) {
    setTimeout(() => {
      const elements = document.querySelectorAll('.ep-cascader-panel .ep-cascader-node[aria-owns]')
      elements.forEach((el) => el.removeAttribute('aria-owns'))
    }, 100)
  }
}

// 生命周期钩子
onMounted(() => {
  // 设置ref
  emit('setRef', formRef.value)

  // 如果是筛选模式，初始化显示状态
  if (props.isFilter) {
    props.formItem.forEach((item) => {
      item.show = true
    })
    if (props.isMore) {
      setFilterHeight()
    }
  }
})

// onUpdated(() => {
//   if (props.isFilter) {
//     setTableHeight()
//   }
// })

// 监听表单项变化
watch(() => props.formItem, () => {
  if (props.isFilter) {
    props.formItem.forEach((item) => {
      item.show = true
    })
    if (props.isMore) {
      setFilterHeight()
    }
  }
}, { deep: true })
</script>

<template>
  <ElForm
    ref="formRef"
    v-loading="loading"
    :model="formValues"
    :rules="rules"
    :label-width="labelWidth"
    :size="size"
    :inline-message="inlineMessage"
    v-bind="$attrs"
    class="custom-form"
    :class="[(isFilter || isAuto) && 'filter-form-content']"
    element-loading-text="正在提交中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    @submit.prevent
  >
    <ElRow ref="customFormRowRef" v-bind="rowAttrs" class="custom-form__row">
      <template v-if="isFilter">
        <ElCol
          v-for="item in selectData"
          v-show="isShift"
          :key="item.label"
          v-bind="item.colAttrs ? item.colAttrs : spanAttrs"
          class="custom-form__cell"
          :class="[`custom-form__cell__${item.prop}`]"
        >
          <span>{{ item.label || item.desc }}：</span>
          <ElPopover
            v-if="
              getArrayFromString(item.value).length >= 2
                && !['datetimerange', 'daterange'].includes(item.type)
            "
            placement="top-start"
            :title="item.label || item.desc"
            width="500"
            trigger="hover"
            :content="`${item.value || item.customValue}${item.unit ? item.unit : ''}`"
          >
            <template #reference>
              <span>
                {{ getArrayFromString(item.value)[0] || getArrayFromString(item.customValue)[0]
                }}{{ item.unit ? item.unit : '' }}...
              </span>
            </template>
          </ElPopover>
          <span v-else>{{ item.value || item.customValue }}{{ item.unit ? item.unit : '' }}</span>
        </ElCol>
      </template>
      <ElCol
        v-for="(item, index) in formItem"
        v-show="item.show || !isFilter"
        :key="index"
        v-bind="item.colAttrs ? item.colAttrs : colAttrs"
        class="custom-form__cell"
        :class="[`custom-form__cell__${item.prop}`]"
      >
        <!-- 小标题 -->
        <div v-if="item.type === 'title'" class="custom-form__subtitle">
          <p v-if="!item.slots" class="custom-form__subtitle_p">
            {{ labelFormat(item.label) }}
          </p>
          <slot v-else :name="item.slots" />
        </div>

        <ElFormItem
          v-else
          v-show="item.type !== 'hidden'"
          :label="labelFormat(item.label)"
          :prop="item.prop"
          v-bind="item.otherAttrs"
          class="custom-form__form-item"
          :class="[
            item.xlLabel && 'xl-label',
            item.auto && 'auto',
            item.labelAttrs && 'custom-form__form-item-label-attrs',
          ]"
        >
          <template v-if="item.labelAttrs" #label>
            <ElSelect
              v-if="item.labelAttrs.type === 'select' && item.labelAttrs.prop"
              v-model="formValues[item.labelAttrs.prop]"
            >
              <ElOption
                v-for="option in item.labelAttrs.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
            <slot v-else :name="item.labelAttrs.slotName" :data="{ item, formValues }" />
          </template>

          <p v-if="item.type === 'txt'" class="txt">
            {{
              item.txtFormat
                ? item.txtFormat[formValues[item.prop]] || formValues[item.prop]
                : formValues[item.prop]
            }}
          </p>

          <!-- slot 自定义传递插槽 -->
          <slot v-else-if="item.type === 'slot'" :name="item.slots" :data="{ item, formValues }" />

          <!-- 上传文件 -->
          <!-- <InputFile
            v-else-if="item.type === 'file'"
            :ref="`${item.type}_${item.prop}`"
            v-model:value="formValues[item.prop]"
            v-bind="item.inputOtherAttrs"
            v-on="getEvents(item)"
          /> -->

          <!-- 上传图片 -->
          <!-- <InputFileImage
            v-else-if="item.type === 'fileImage'"
            :ref="`${item.type}_${item.prop}`"
            v-model:value="formValues[item.prop]"
            v-bind="item.inputOtherAttrs"
            v-on="getEvents(item)"
          /> -->

          <!-- input输入框 -->
          <ElInput
            v-else-if="isInput(item.type)"
            :ref="`${item.type}_${item.prop}`"
            v-model="formValues[item.prop]"
            :type="item.type"
            v-bind="item.inputOtherAttrs"
            v-on="getEvents(item)"
            @click="nativeOnEmit(item, 'click', $event)"
          >
            <template
              v-for="slotItem in item.slots"
              #[slotFormat(slotItem).name]
            >
              <slot :name="slotFormat(slotItem).alias" :data="{ item, formValues }">
                {{ slotFormat(slotItem).text }}
              </slot>
            </template>
          </ElInput>

          <!-- inputNumber -->
          <ElInputNumber
            v-else-if="item.type === 'inputNumber'"
            :ref="`${item.type}_${item.prop}`"
            v-model="formValues[item.prop]"
            v-bind="item.inputOtherAttrs"
            v-on="getEvents(item)"
            @click="nativeOnEmit(item, 'click', $event)"
          />

          <!-- select 选择框 -->
          <ElSelect
            v-else-if="item.type === 'select'"
            :ref="`${item.type}_${item.prop}`"
            v-model="formValues[item.prop]"
            v-bind="item.inputOtherAttrs"
            :popper-class="`form-select-popper ${
              typeof item.inputOtherAttrs === 'object' ? item.inputOtherAttrs.popperClass || '' : ''
            }`"
            v-on="getEvents(item)"
          >
            <ElOption
              v-for="list in item.options"
              v-bind="list"
              :key="list.value"
              :label="Array.isArray(item.slots) ? list.text : list.label"
              :value="list.value"
            >
              <template v-if="Array.isArray(item.slots)">
                <span>{{ list.text }}</span>
              </template>
            </ElOption>
          </ElSelect>

          <!-- cascader 联级选择器 -->
          <ElCascader
            v-else-if="item.type === 'cascader'"
            :ref="`${item.type}_${item.prop}`"
            v-model="formValues[item.prop]"
            v-bind="item.inputOtherAttrs"
            :options="item.options"
            @visible-change="visibleChange"
            v-on="getEvents(item)"
          />

          <!-- checkbox 多选框 -->
          <ElCheckboxGroup
            v-else-if="item.type === 'checkbox'"
            :ref="`${item.type}_${item.prop}`"
            v-model="formValues[item.prop]"
            v-bind="item.inputOtherAttrs"
            v-on="getEvents(item)"
          >
            <ElCheckbox
              v-for="list in item.options"
              v-bind="list"
              :key="list.value"
              :label="list.value"
            >
              {{ list.label }}
            </ElCheckbox>
          </ElCheckboxGroup>

          <!-- radio 单选框 -->
          <ElRadioGroup
            v-else-if="item.type === 'radio'"
            :ref="`${item.type}_${item.prop}`"
            v-model="formValues[item.prop]"
            v-bind="item.inputOtherAttrs"
            v-on="getEvents(item)"
          >
            <ElRadio
              v-for="list in item.options"
              v-bind="list"
              :key="list.value"
              :label="list.value"
            >
              {{ list.label }}
            </ElRadio>
          </ElRadioGroup>

          <!-- switch 开关 -->
          <ElSwitch
            v-else-if="item.type === 'switch'"
            :ref="`${item.type}_${item.prop}`"
            v-model="formValues[item.prop]"
            v-bind="item.inputOtherAttrs"
            v-on="getEvents(item)"
          />

          <!-- time 时间选择器 -->
          <ElTimePicker
            v-else-if="item.type === 'time'"
            :ref="`${item.type}_${item.prop}`"
            v-model="formValues[item.prop]"
            v-bind="item.inputOtherAttrs"
            v-on="getEvents(item)"
          />

          <!-- autocomplete 带建议的搜索输入框 -->
          <ElAutocomplete
            v-else-if="item.type === 'autocomplete'"
            :ref="`${item.type}_${item.prop}`"
            v-model="formValues[item.prop]"
            v-bind="item.inputOtherAttrs"
            v-on="getEvents(item)"
          />

          <!-- date 日期选择器 -->
          <ElDatePicker
            v-else-if="isDatePickerOrDatetimePicker(item.type)"
            :ref="`${item.type}_${item.prop}`"
            v-model="formValues[item.prop]"
            :type="getDatePickerType(item.type)"
            v-bind="item.inputOtherAttrs"
            :popper-class="`form-date-popper ${
              typeof item.inputOtherAttrs === 'object' ? item.inputOtherAttrs.popperClass || '' : ''
            }`"
            v-on="getEvents(item)"
          />

          <ElButton
            v-if="isFilter && item.type === 'slot' && item.slots === 'buttons' && isMore"
            class="more"
            type="text"
            @click="toggleMore"
          >
            {{ toggleText }}
            <ElIcon :class="iconClass">
              <component :is="iconComponent" />
            </ElIcon>
          </ElButton>
        </ElFormItem>
      </ElCol>
    </ElRow>
    <div class="custom-form__footer center-xy">
      <slot name="footer" />
    </div>
    <div v-if="isFilter" class="custom-form__shift" @click="shiftForm">
      <ElIcon :class="shiftIcon">
        <component :is="shiftIconComponent" />
      </ElIcon>
    </div>
  </ElForm>
</template>

<style scoped lang="scss">
.custom-form {
  padding: 4px;
  display: flex;
  position: relative;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  &__row {
    flex: 1;
    overflow: auto;
    scroll-snap-type: y;
    padding: 16px;
  }

  &__cell {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 38px;
    margin-bottom: 16px;

    &__title {
      font-size: 16px;
      font-weight: bold;
      margin: 16px 0;
      color: #333;
      border-left: 4px solid #409eff;
      padding-left: 12px;
    }
  }

  &__subtitle {
    font-size: 16px;
    font-weight: bold;
    margin: 16px 0;
    color: #333;
    border-left: 4px solid #409eff;
    padding-left: 12px;

    &_p {
      margin: 0;
    }
  }

  &__form-item {
    margin-bottom: 20px;

    &.xl-label :deep(.ep-form-item__label) {
      line-height: 1.2;
      padding-top: 8px;
    }

    .txt {
      margin: 0;
      padding: 8px 0;
      color: #606266;
    }

    .more {
      text-align: right;
      float: right;
      margin-top: 8px;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    border-top: 1px solid #ebeef5;
    margin-top: auto;
  }

  &__shift {
    position: absolute;
    bottom: 0;
    width: 100px;
    height: 20px;
    text-align: center;
    cursor: pointer;
    line-height: 20px;
    background-color: #ecf5ff;
    left: calc(50% - 50px);
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    transition: background-color 0.3s;
    z-index: 10;

    &:hover {
      background-color: #d9ecff;
    }

    .ep-icon {
      color: #79bbff;
      font-size: 16px;
      vertical-align: middle;
    }
  }

  &.filter-form-content {
    background-color: #fff;
    padding: 20px 16px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    :deep(.ep-form-item) {
      width: 100%;
      margin-bottom: 16px !important;

      .ep-form-item__content {
        width: calc(100% - 85px);
      }
    }

    :deep(.custom-form__form-item-label-attrs) {
      .ep-form-item__label-wrap {
        max-width: 30%;
        overflow: hidden;
      }

      .ep-form-item__label {
        padding-right: 8px;

        .ep-input__inner {
          text-align: right;
          border: 1px solid transparent !important;
        }
      }

      .ep-select {
        font-size: 14px;
      }
    }
  }
}

:deep(.ep-form-item__label) {
  color: #606266;
  font-weight: 500;
}

:deep(.ep-input) {
  width: 100%;
}

:deep(.ep-select) {
  width: 100%;
}

:deep(.ep-date-editor) {
  width: 100%;
}

:deep(.ep-cascader) {
  width: 100%;
}

:deep(.form-select-popper),
:deep(.form-date-popper) {
  .ep-popper__arrow {
    display: none;
  }

  .ep-select-dropdown,
  .ep-picker-panel {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
</style>
