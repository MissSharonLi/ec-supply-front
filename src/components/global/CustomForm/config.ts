// 输入框类型
export const inputs: string = 'text|hidden|textarea|file|password'

// 时间类型
export const times: string = 'year|years|month|months|date|dates|week|datetime|datetimerange|daterange|monthrange'

export default {
  events: [
    {
      // input 输入框事件列表 https://element-plus.org/zh-CN/component/input.html#events
      type: 'file',
      event: ['blur', 'focus', 'change', 'clear', 'input', 'click']
    },
    {
      // input 输入框事件列表 https://element-plus.org/zh-CN/component/input.html#events
      type: inputs,
      event: ['blur', 'focus', 'change', 'clear', 'input', 'click']
    },
    {
      // select 选择器 https://element-plus.org/zh-CN/component/select.html#select-events
      type: 'select',
      event: ['change', 'visibleChange', 'removeTag', 'clear', 'blur', 'focus']
    },
    {
      // cascader 联级选择器 https://element-plus.org/zh-CN/component/cascader.html#cascader-events
      type: 'cascader',
      event: ['change', 'activeItemChange', 'blur', 'focus', 'visibleChange']
    },
    {
      // checkbox 多选框 https://element-plus.org/zh-CN/component/checkbox.html#checkbox-events
      // radio 单选框 https://element-plus.org/zh-CN/component/radio.html#radio-events
      // switch 开关 https://element-plus.org/zh-CN/component/switch.html
      type: 'checkbox|radio|switch',
      event: ['change']
    },
    {
      // time 时间选择器 https://element-plus.org/zh-CN/component/time-picker.html
      type: 'time',
      event: ['change', 'blur', 'focus', 'visibleChange', 'clear']
    },
    {
      // datePicker 日期选择器 https://element-plus.org/zh-CN/component/date-picker.html
      // datetimePicker 时间日期选择器
      type: times,
      event: ['change', 'blur', 'focus']
    },
    {
      // elAutocomplete 自定义输入框选择 https://element-plus.org/zh-CN/component/autocomplete.html#events
      type: 'autocomplete',
      event: ['select', 'clear', 'blur', 'focus', 'change', 'input']
    }
  ]
}
