<script lang="ts" setup>
import { repository } from '~/../package.json'

import { toggleDark } from '~/composables'
</script>

<template>
  <ElMenu
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    router
  >
    <ElMenuItem index="/">
      <div class="flex items-center justify-center gap-2">
        <div class="text-xl" i-ep-element-plus />
        <span>Element Plus</span>
      </div>
    </ElMenuItem>
    <ElSubMenu index="2">
      <template #title>Workspace</template>
      <ElMenuItem index="2-1">item one</ElMenuItem>
      <ElMenuItem index="2-2">item two</ElMenuItem>
      <ElMenuItem index="2-3">item three</ElMenuItem>
      <ElSubMenu index="2-4">
        <template #title>item four</template>
        <ElMenuItem index="2-4-1">item one</ElMenuItem>
        <ElMenuItem index="2-4-2">item two</ElMenuItem>
        <ElMenuItem index="2-4-3">item three</ElMenuItem>
      </ElSubMenu>
    </ElSubMenu>
    <ElMenuItem index="3" disabled>Info</ElMenuItem>
    <ElMenuItem index="4">Orders</ElMenuItem>

    <ElMenuItem h="full" index="5" @click="toggleDark()">
      <button
        class="w-full cursor-pointer border-none bg-transparent"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </ElMenuItem>

    <ElMenuItem index="6" h="full">
      <a class="size-full flex items-center justify-center" :href="repository.url" target="_blank">
        <div i-ri-github-fill />
      </a>
    </ElMenuItem>
  </ElMenu>
</template>

<style lang="scss">
  .el-menu-demo {
  &.ep-menu--horizontal > .ep-menu-item:nth-child(1) {
    margin-right: auto;
  }
}
</style>
