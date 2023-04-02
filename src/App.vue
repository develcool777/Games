<template>
  <Header />
  <router-view></router-view>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Header from '@/layouts/Header.vue';

  export default defineComponent({
    name: 'App',
    components: {
      Header,
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="scss">
  #app {
    height: 100vh;
    width: 100%;
    @include Flex(column, false, false);
  }
</style>
