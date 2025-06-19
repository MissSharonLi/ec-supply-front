<script lang="tsx" setup>
const tableProps = {
  dataSource: [
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
  ],
  border: true,
  columns: [
    {
      prop: 'date',
      label: 'Date',
      width: '180',
      render: ({ row }: any) => {
        return (<div>{row.name}</div>)
      }
    },
    { prop: 'name', label: 'Name', width: '180' },
    { prop: 'address', label: 'Address' }
  ]
}
</script>

<template>
  <Logos my="4" />
  <Table v-bind="tableProps" />
  <HelloWorld msg="test" />
</template>
