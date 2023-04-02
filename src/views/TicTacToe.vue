<template>
  <Main class="tic">
    <Board :board="g.getBoard" @makeMove="makeMove($event)" />
  </Main>
</template>

<script lang="ts">
  import { defineComponent, onMounted } from 'vue';
  import Main from '@/layouts/Main.vue';
  import Board from '@/layouts/TicTacToe/Board.vue';
  import Game from '@/models/tictactoe/game';
  // import type { Index } from '@/types/models/tictactoe';

  export default defineComponent({
    name: 'TicTacToe',
    components: {
      Main,
      Board,
    },
    setup() {
      const g = new Game();
      g.startGame();

      // mounted
      onMounted(() => init());

      // methods
      const init = (): void => {
        // g.value = new Game();
        console.log(g.getBoard);
      };

      const makeMove = (index: number): void => {
        g.userMove(g.index1DTo2D(index));
      };

      return {
        g,
        makeMove,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .tic {
    @include Flex(row, center, center);
  }
</style>
