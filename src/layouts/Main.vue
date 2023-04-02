<template>
  <main class="main">
    <slot></slot>
  </main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Main',
    setup() {
      return {};
    },
  });
</script>

<style lang="scss" scoped>
  .main {
    flex: 1;
  }
</style>
