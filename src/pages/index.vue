<script lang="tsx" setup>
import { ref } from 'vue'

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
</script>

<template>
  <div style="padding: 20px">
    <Logos my="4" />
    <Table v-bind="tableProps" :data-source="dataSource" />
  <!-- <HelloWorld msg="test" /> -->
  </div>
</template>
