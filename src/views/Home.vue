<template>
  <div class="">
    <router-link to="/tic-tac-toe">TicTacToe</router-link>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Home',
    setup() {
      return {};
    },
  });
</script>

<style lang="scss" scoped></style>
