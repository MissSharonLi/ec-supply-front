<script setup lang="ts">
import { zhCn } from 'element-plus/es/locales.mjs'
</script>

<template>
  <ElConfigProvider namespace="ep" :locale="zhCn">
    <BaseHeader />
    <div class="main-container flex">
      <BaseSide />
      <div w="full" py="4">
        <RouterView />
      </div>
    </div>
  </ElConfigProvider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 4px);
}
</style>
