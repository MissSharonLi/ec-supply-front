<script lang="tsx" setup>
const tableProps = {
  border: true,
  columns: Array<any> = [
    {
      prop: 'date',
      label: 'Date',
      width: '180',
      render: ({ row }) => {
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
