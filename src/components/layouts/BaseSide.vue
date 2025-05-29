<script lang="ts" setup>
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'

// const isCollapse = ref(true)
function handleOpen(key: string, keyPath: string[]) {
  // eslint-disable-next-line no-console
  console.log(key, keyPath)
}
function handleClose(key: string, keyPath: string[]) {
  // eslint-disable-next-line no-console
  console.log(key, keyPath)
}
</script>

<template>
  <ElMenu
    router
    default-active="1"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
  >
    <ElSubMenu index="1">
      <template #title>
        <ElIcon>
          <Location />
        </ElIcon>
        <span>Navigator One</span>
      </template>
      <ElMenuItemGroup>
        <template #title>
          <span>Group One</span>
        </template>
        <ElMenuItem index="/nav/1/item-1">item one</ElMenuItem>
        <ElMenuItem index="1-2">item two</ElMenuItem>
      </ElMenuItemGroup>
      <ElMenuItemGroup title="Group Two">
        <ElMenuItem index="1-3">item three</ElMenuItem>
      </ElMenuItemGroup>
      <ElSubMenu index="1-4">
        <template #title>
          <span>item four</span>
        </template>
        <ElMenuItem index="1-4-1">item one</ElMenuItem>
      </ElSubMenu>
    </ElSubMenu>
    <ElMenuItem index="/nav/2">
      <ElIcon>
        <IconMenu />
      </ElIcon>
      <template #title>Navigator Two</template>
    </ElMenuItem>
    <ElMenuItem index="3" disabled>
      <ElIcon>
        <Document />
      </ElIcon>
      <template #title>Navigator Three</template>
    </ElMenuItem>
    <ElMenuItem index="/nav/4">
      <ElIcon>
        <Setting />
      </ElIcon>
      <template #title>Navigator Four</template>
    </ElMenuItem>
  </ElMenu>
</template>
