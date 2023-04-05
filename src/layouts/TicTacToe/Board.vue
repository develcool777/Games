<template>
  <section class="field" :style="defineFieldStyle()">
    <Cell
      v-for="(cell, i) in board.flat()"
      :gameStatus="gameStatus"
      :player="player"
      :isWin="winCells.includes(i)"
      :cell="cell"
      :key="i"
      :style="defineCellStyle()"
      @click="makeMove(i, cell)" />
    <div class="field__line" v-for="(n, i) in board.length - 1" :key="n" :style="defineVerticalStyle(i)"></div>
    <div class="field__line horizontal" v-for="(n, i) in board.length - 1" :key="n" :style="defineVerticalStyle(i, true)"></div>
  </section>
</template>

<script lang="ts">
  import { defineComponent, type PropType, type StyleValue } from 'vue';
  import Cell from '@/components/TicTacToe/Cell.vue';
  import type { Board, GameStatus, Player } from '@/types/models/tictactoe';
  import type { Cell as CellInterface } from '@/types/models/tictactoe';

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
      const makeMove = (index: number, cell: CellInterface): void => {
        if (props.gameStatus !== 'start' || cell !== '') return;
        context.emit('makeMove', index);
      };

      const defineCellStyle = (): StyleValue => {
        const size = props.board.length === 3 ? '150px' : props.board.length === 5 ? '100px' : '80px';
        return { width: size, height: size };
      };

      const defineFieldStyle = (): StyleValue => {
        const size = props.board.length === 3 ? '490px' : props.board.length === 5 ? '560px' : '640px';
        return { width: size, height: size };
      };

      const defineVerticalStyle = (index: number, isHorizontal?: boolean): StyleValue => {
        const cellSize = props.board.length === 3 ? 150 : props.board.length === 5 ? 100 : 80;
        return isHorizontal ? { top: `${cellSize + index * (cellSize + 10)}px` } : { left: `${cellSize + index * (cellSize + 10)}px` };
      };

      return {
        makeMove,
        defineCellStyle,
        defineFieldStyle,
        defineVerticalStyle,
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
    border: 10px solid darkseagreen;
    border-radius: 5px;

    &__line {
      position: absolute;
      width: 10px;
      height: 100%;
      background: darkseagreen;

      &.horizontal {
        width: 100%;
        height: 10px;
      }
    }
  }
</style>
