<template>
  <Main class="pnf">
    <img class="pnf__img" src="@/assets/404.svg" alt="404 Error" />
    <router-link class="pnf__link" to="/">Back to home</router-link>
  </Main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Main from '@/layouts/Main.vue';

  export default defineComponent({
    name: 'PageNotFound',
    components: {
      Main,
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="scss" scoped>
  .pnf {
    @include Flex(column, center, center);

    &__img {
      width: 600px;
      height: 600px;
    }

    &__link {
      @include Flex(row, center, center);
      width: 250px;
      height: 40px;
      text-decoration: none;
      color: $greenMain;
      border: 1px solid $greenMain;
      transition-duration: 0.5s;

      &:hover {
        border-color: $greenMainHover;
        color: $greenMainHover;
      }
    }
  }
</style>
