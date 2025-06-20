<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
const input = ref('element-plus')

const curDate = ref('')

function toast() {
  ElMessage.success('Hello')
}

const value1 = ref(true)
</script>

<template>
  <h1 color="$ep-color-primary">
    {{ msg }}
  </h1>

  <p>
    See
    <a href="https://element-plus.org" target="_blank">element-plus</a>
    for more information.
  </p>

  <!-- example components -->
  <div class="mb-4">
    <ElButton size="large" @click="toast">El Message</ElButton>

    <MessageBoxDemo />
  </div>

  <div class="my-2 flex flex-wrap items-center justify-center text-center">
    <ElButton @click="count++">count is: {{ count }}</ElButton>
    <ElButton type="primary" @click="count++">count is: {{ count }}</ElButton>
    <ElButton type="success" @click="count++">count is: {{ count }}</ElButton>
    <ElButton type="warning" @click="count++">count is: {{ count }}</ElButton>
    <ElButton type="danger" @click="count++">count is: {{ count }}</ElButton>
    <ElButton type="info" @click="count++">count is: {{ count }}</ElButton>
  </div>

  <div>
    <ElTag type="success" class="m-1">Tag 1</ElTag>
    <ElTag type="warning" class="m-1">Tag 1</ElTag>
    <ElTag type="danger" class="m-1">Tag 1</ElTag>
    <ElTag type="info" class="m-1">Tag 1</ElTag>
  </div>

  <div>
    <ElSwitch v-model="value1" />
    <ElSwitch
      v-model="value1"
      class="m-2"
      style="--ep-switch-on-color: black; --ep-switch-off-color: gray"
    />
  </div>

  <div class="my-2">
    <ElInput v-model="input" class="m-2" style="width: 200px" />
    <ElDatePicker
      v-model="curDate"
      class="m-2"
      type="date"
      placeholder="Pick a day"
    />
  </div>

  <p>For example, we can custom primary color to 'green'.</p>

  <p>
    Edit
    <code>components/HelloWorld.vue</code>
    to test components.
  </p>
  <p>
    Edit
    <code>styles/element/var.scss</code>
    to test scss variables.
  </p>

  <p>
    Full Example:
    <a href="https://github.com/MissSharonLi/ec-supply-front" target="_blank">ec-supply-front</a>
    | On demand Example:
    <a href="https://github.com/element-plus/unplugin-element-plus" target="_blank">
      unplugin-element-plus/examples/vite
    </a>
  </p>
</template>

<style>
.ep-button {
  margin: 4px;
}
.ep-button + .ep-button {
  margin-left: 0;
  margin: 4px;
}
</style>
