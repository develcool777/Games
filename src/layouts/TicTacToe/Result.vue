<template>
  <section class="result">
    <div class="result__panel">
      <div class="result__side left">
        <div class="result__x"></div>
      </div>
      <p class="result__vs">VS</p>
      <div class="result__side rigth">
        <div class="result__o"></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import type { Result, Player } from '@/types/models/tictactoe';

  export default defineComponent({
    name: 'Result',
    props: {
      result: {
        type: String as PropType<Result>,
        required: true,
      },
      player: {
        type: String as PropType<Player>,
        required: true,
      },
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="scss" scoped>
  .result {
    width: 400px;

    &__panel {
      @include Flex(row, space-between, center);
      width: 100%;
      height: 50px;
      border-bottom-left-radius: 50px;
      border-bottom-right-radius: 50px;
      background: grey;
    }

    &__side {
      @include Flex(row, center, center);
      width: 100px;
      height: 100%;
      background: azure;

      &.left {
        padding-left: 10px;
        border-bottom-left-radius: 50px;
      }

      &.rigth {
        padding-right: 10px;
        border-bottom-right-radius: 50px;
      }
    }

    &__x {
      position: relative;
      width: 40px;
      height: 40px;

      &::before,
      &::after {
        position: absolute;
        top: 50%;
        left: 0;
        content: '';
        height: 10px;
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

    &__o {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 10px solid #5aa5d1;
    }

    &__vs {
      font-weight: 600;
      font-size: 30px;
    }
  }
</style>
