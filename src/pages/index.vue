<script lang="tsx" setup>
import { ref } from 'vue'
import Table from '~/components/global/Table/index.vue'

const tableRef = ref<InstanceType<typeof Table> | null>(null)

const tableProps = ref({
  columns: [
    {
      prop: 'date',
      label: 'Date',
      width: '180',
      render: ({ row }: any) => {
        return (<div>{row.name}</div>)
      }
    },
    {
      prop: 'name',
      label: 'Name',
      width: '180',
      align: 'left' as 'center' | 'left' | 'right' | undefined,
      headerAlign: 'center'
    },
    { prop: 'address', label: 'Address' }
  ]
})
const dataSource = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
])
setTimeout(() => {
  dataSource.value = [{
    date: '2016-06-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }, {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }, {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }, {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }]
}, 5000)
const formProps = ref({
  inline: true,
  isFilter: true,
  isMore: true,
  isAuto: true,
  values: {}, // add this property
  formItem: [{
    type: 'text',
    label: '名称',
    prop: 'name1',
    placeholder: '请输入名称',
    inputOtherAttrs: {
      clearable: true
    },
    inputNativeOn: {
      click: 'nameClick'
    }
  }, {
    type: 'text',
    label: '名称',
    prop: 'name2',
    placeholder: '请输入名称'
  }, {
    type: 'text',
    label: '名称',
    prop: 'name3',
    placeholder: '请输入名称'
  }, {
    type: 'slot',
    slots: 'buttons',
    prop: 'buttons'
  }]

})
function handleBlur() {
  console.warn('name1Blur')
}
</script>

<template>
  <div style="padding: 20px">
    <CustomForm
      v-bind="formProps"
      v-model:values="formProps.values"
      @name1-blur="handleBlur"
      @name1-click="console.log('nameClick')"
      @toggle="tableRef && tableRef.setTableHeight()"
    >
      <template #footer>
        <div>fo</div>
      </template>
    </CustomForm>

    <Table
      ref="tableRef"
      v-bind="tableProps"
      :data-source="dataSource"
    />
  <!-- <HelloWorld msg="test" /> -->
  </div>
</template>
