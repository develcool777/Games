<template>
  <section class="field">
    <Cell v-for="(cell, i) in board.flat()" :cell="cell" :key="i" @click="makeMove(i)" />
    <div class="field__line v1"></div>
    <div class="field__line v2"></div>
    <div class="field__line horizontal h1"></div>
    <div class="field__line horizontal h2"></div>
  </section>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import Cell from '@/components/TicTacToe/Cell.vue';
  import type { Board } from '@/types/models/tictactoe';

  export default defineComponent({
    name: 'Board',
    components: {
      Cell,
    },
    props: {
      board: {
        type: Object as PropType<Board>,
        required: true,
      },
    },
    emits: ['makeMove'],
    setup(_, context) {
      // methods
      const makeMove = (index: number) => context.emit('makeMove', index);

      return {
        makeMove,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .field {
    @include Flex(row, center, center);
    gap: 10px;
    position: relative;
    flex-wrap: wrap;
    width: 640px;
    height: 640px;
    border: 10px solid darkseagreen;
    border-radius: 5px;

    &__line {
      position: absolute;
      width: 100%;
      height: 10px;
      background: darkseagreen;

      &.horizontal {
        width: 10px;
        height: 100%;
      }

      &.v1 {
        top: 200px;
      }

      &.v2 {
        top: calc(200px + 10px + 200px);
      }

      &.h1 {
        left: 200px;
      }

      &.h2 {
        left: calc(200px + 10px + 200px);
      }
    }
  }
</style>
