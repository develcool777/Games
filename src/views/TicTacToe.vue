<template>
  <Main class="tic">
    <Board :player="g.getPlayer" :gameStatus="g.getGameStatus" :board="g.getBoard" @makeMove="g.userMove(g.index1DTo2D($event))" />
    <Settings :historyLen="g.getHistoryLength" :gameStatus="g.getGameStatus" @returnMove="g.returnMove()" @start="g.startGame()" @cancel="g.reset()" />
  </Main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Main from '@/layouts/Main.vue';
  import Board from '@/layouts/TicTacToe/Board.vue';
  import Settings from '@/layouts/TicTacToe/Settings.vue';
  import Game from '@/models/tictactoe/game';

  export default defineComponent({
    name: 'TicTacToe',
    components: {
      Main,
      Board,
      Settings,
    },
    setup() {
      const g = new Game();

      return {
        g,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .tic {
    @include Flex(row, center, center);
  }
</style>
