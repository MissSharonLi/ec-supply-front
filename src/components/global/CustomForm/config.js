// 输入框类型
export const inputs = 'text|hidden|textarea|file|password'

// 时间类型
export const times
  = 'year|years|month|months|date|dates|week|datetime|datetimerange|daterange|monthrange'

export default {
  events: [
    {
      // input 输入框事件列表 https://element.eleme.cn/#/zh-CN/component/input#input-events
      type: 'file',
      event: ['blur', 'focus', 'change']
    },
    {
      // input 输入框事件列表 https://element.eleme.cn/#/zh-CN/component/input#input-events
      type: inputs,
      event: ['blur', 'focus', 'change', 'clear', 'input']
    },
    {
      // select 选择器 https://element.eleme.cn/#/zh-CN/component/select#select-events
      type: 'select',
      event: ['change', 'visibleChange', 'removeTag', 'clear', 'blur', 'focus']
    },
    {
      // cascader 联级选择器 https://element.eleme.cn/#/zh-CN/component/cascader#events
      type: 'cascader',
      event: ['change', 'activeItemChange', 'blur', 'focus', 'visibleChange']
    },
    {
      // checkbox 多选框 https://element.eleme.cn/#/zh-CN/component/checkbox#checkbox-events
      // radio 单选框 https://element.eleme.cn/#/zh-CN/component/radio#radio-events
      // switch 开关 https://element.eleme.cn/#/zh-CN/component/switch#events
      type: 'checkbox|radio|switch',
      event: ['change']
    },
    {
      // cascader 联级选择器 https://element.eleme.cn/#/zh-CN/component/cascader#events
      type: 'cascader',
      event: ['change', 'activeItemChange', 'blur', 'focus', 'visibleChange']
    },
    {
      // time 时间选择器 https://element.eleme.cn/#/zh-CN/component/time-picker#events
      type: 'time',
      event: ['change', 'blur', 'focus']
    },
    {
      // datePicker 日期选择器 https://element.eleme.cn/#/zh-CN/component/date-picker#events
      // datetimePicker 时间日期选择器
      type: times,
      event: ['change', 'blur', 'focus']
    },
    {
      // elAutocomplete 自定义输入框选择 https://element.eleme.cn/#/zh-CN/component/input#autocomplete-events
      type: 'autocomplete',
      event: ['select', 'clear']
    }
  ]
}
