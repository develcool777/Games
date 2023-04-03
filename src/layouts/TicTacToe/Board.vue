<template>
  <section class="field">
    <Cell
      v-for="(cell, i) in board.flat()"
      :gameStatus="gameStatus"
      :player="player"
      :isWin="winCells.includes(i)"
      :cell="cell"
      :key="i"
      @click="makeMove(i)" />
    <div class="field__line v1"></div>
    <div class="field__line v2"></div>
    <div class="field__line horizontal h1"></div>
    <div class="field__line horizontal h2"></div>
  </section>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import Cell from '@/components/TicTacToe/Cell.vue';
  import type { Board, GameStatus, Player } from '@/types/models/tictactoe';

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
      gameStatus: {
        type: String as PropType<GameStatus>,
        required: true,
      },
      player: {
        type: String as PropType<Player>,
        required: true,
      },
      winCells: {
        type: Array as PropType<number[]>,
        required: true,
      },
    },
    emits: ['makeMove'],
    setup(props, context) {
      // methods
      const makeMove = (index: number): void => {
        if (props.gameStatus !== 'start') return;
        context.emit('makeMove', index);
      };

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
    width: 490px;
    height: 490px;
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
        top: 150px;
      }

      &.v2 {
        top: calc(150px + 10px + 150px);
      }

      &.h1 {
        left: 150px;
      }

      &.h2 {
        left: calc(150px + 10px + 150px);
      }
    }
  }
</style>
