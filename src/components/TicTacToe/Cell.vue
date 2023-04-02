<template>
  <div class="cell">
    <Transition name="fade">
      <div v-if="cell === 'o'" class="cell__o"></div>
    </Transition>
    <Transition name="fade">
      <div v-if="cell === 'x'" class="cell__x"></div>
    </Transition>
  </div>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import type { Cell } from '@/types/models/tictactoe';

  export default defineComponent({
    name: 'Cell',
    props: {
      cell: {
        type: String as PropType<Cell>,
        required: true,
      },
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="scss" scoped>
  .cell {
    @include Flex(row, center, center);
    width: 200px;
    height: 200px;
    background: white;

    &__o {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 20px solid #5aa5d1;
    }

    &__x {
      position: relative;
      width: 120px;
      height: 120px;

      &::before,
      &::after {
        position: absolute;
        top: 50%;
        left: 0;
        content: '';
        height: 20px;
        width: 100%;
        background: #e4465b;
      }

      &::before {
        transform: translateY(-50%) rotate(-45deg);
      }

      &::after {
        transform: translateY(-50%) rotate(45deg);
      }
    }
  }
</style>
