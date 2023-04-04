<template>
  <Main class="tic">
    <div class="tic__game">
      <Panel :game-status="g.getGameStatus" :result="g.getResult" :player="g.getPlayer" />
      <Board :winCells="g.getWinCells" :player="g.getPlayer" :gameStatus="g.getGameStatus" :board="g.getBoard" @makeMove="g.userMove(g.index1DTo2D($event))" />
    </div>
    <Settings :historyLen="g.getHistoryLength" :gameStatus="g.getGameStatus" @returnMove="g.returnMove()" @start="g.startGame()" @cancel="g.reset()" />
  </Main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Main from '@/layouts/Main.vue';
  import Board from '@/layouts/TicTacToe/Board.vue';
  import Settings from '@/layouts/TicTacToe/Settings.vue';
  import Panel from '@/layouts/TicTacToe/Panel.vue';
  import Game from '@/models/tictactoe/game';

  export default defineComponent({
    name: 'TicTacToe',
    components: {
      Main,
      Board,
      Settings,
      Panel,
    },
    setup() {
      const g = new Game(5);

      return {
        g,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .tic {
    @include Flex(row, center, center);

    &__game {
      @include Flex(column, center, center);
      gap: 50px;
    }
  }
</style>
