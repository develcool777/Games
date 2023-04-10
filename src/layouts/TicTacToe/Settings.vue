<template>
  <section class="set">
    <div class="set__btns">
      <button type="button" class="set__btn" title="Play" @click="start()">
        <SvgIcon :name="'Play'" class="set__svg" />
      </button>
      <button type="button" class="set__btn" title="Cancel" @click="cancel()">
        <SvgIcon :name="'Cancel'" class="set__svg" />
      </button>
      <button type="button" class="set__btn" title="Return move" @click="returnMove()">
        <SvgIcon :name="'Return'" class="set__svg" />
      </button>
    </div>
    <div class="set__mode">
      <h4 class="set__modeName">Board Size</h4>
      <div class="set__variants">
        <button type="button" class="set__variant" :class="{ active: config?.boardSize === 3 }" @click="setSize(3)">3x3</button>
        <button type="button" class="set__variant" :class="{ active: config?.boardSize === 5 }" @click="setSize(5)">5x5</button>
        <button type="button" class="set__variant" :class="{ active: config?.boardSize === 7 }" @click="setSize(7)">7x7</button>
      </div>
    </div>
    <div class="set__mode">
      <h4 class="set__modeName">Opponent</h4>
      <div class="set__variants">
        <button type="button" class="set__variant" :class="{ active: config?.opponent === 'user' }" @click="setOpponent('user')">User</button>
        <button type="button" class="set__variant" :class="{ active: config?.opponent === 'comp' }" @click="setOpponent('comp')">Computer</button>
      </div>
    </div>
    <div class="set__mode">
      <h4 class="set__modeName">Side</h4>
      <div class="set__variants">
        <button type="button" class="set__variant" :class="{ active: config?.side === 'x' }" @click="setSide('x')">X</button>
        <button type="button" class="set__variant" :class="{ active: config?.side === 'o' }" @click="setSide('o')">O</button>
      </div>
    </div>
    <div class="set__mode">
      <h4 class="set__modeName">Difficulty</h4>
      <div class="set__variants">
        <button type="button" class="set__variant" :class="{ active: config?.difficulty === 'easy' }" @click="setDifficulty('easy')">Easy</button>
        <button type="button" class="set__variant" :class="{ active: config?.difficulty === 'hard' }" @click="setDifficulty('hard')">Hard</button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import SvgIcon from '@/svg/SvgIcon.vue';
  import type { GameStatus, BoardSize, Config, Level, Player, Opponent } from '@/types/models/tictactoe';

  export default defineComponent({
    name: 'Settings',
    components: {
      SvgIcon,
    },
    props: {
      gameStatus: {
        type: String as PropType<GameStatus>,
        required: true,
      },
      historyLen: {
        type: Number,
        required: true,
      },
      config: {
        type: Object as PropType<Config>,
        requird: true,
      },
    },
    emits: ['start', 'cancel', 'returnMove', 'setConfig'],
    setup(props, context) {
      // methods
      const start = (): void => {
        if (props.gameStatus === 'start') return;
        context.emit('start');
      };

      const cancel = (): void => {
        if (props.gameStatus === '') return;
        context.emit('cancel');
      };

      const returnMove = (): void => {
        if (props.gameStatus !== 'start' || props.historyLen === 0) return;
        context.emit('returnMove');
      };

      const setSize = (boardSize: BoardSize): void => {
        if (props.gameStatus === 'start' || props.config?.boardSize === boardSize) return;
        context.emit('setConfig', { boardSize } as Config);
      };

      const setOpponent = (opponent: Opponent): void => {
        context.emit('setConfig', { opponent } as Config);
      };

      const setSide = (side: Player): void => {
        context.emit('setConfig', { side } as Config);
      };

      const setDifficulty = (difficulty: Level): void => {
        context.emit('setConfig', { difficulty } as Config);
      };

      return {
        start,
        cancel,
        returnMove,
        setSize,
        setOpponent,
        setSide,
        setDifficulty,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .set {
    @include Flex(column, flex-start);
    gap: 10px;
    background: darkslategray;
    border-radius: 8px;
    padding-bottom: 10px;

    &__svg {
      width: 24px;
      height: 24px;
      fill: white;
      transition-duration: 0.5s;
    }

    &__btns {
      @include Flex(row, space-around, center);
      height: 40px;
      border-bottom: 1px solid white;
    }

    &__btn {
      @include Flex(row, center, center);
      background: none;
      border: none;
      outline: none;
      cursor: pointer;
    }

    &__btn:hover &__svg {
      fill: cadetblue;
    }

    &__mode {
      @include Flex(column, center);
      gap: 5px;
    }

    &__modeName {
      color: white;
      text-align: center;
    }

    &__variants {
      @include Flex(row, space-between, center);
      border-bottom: 1px solid white;
    }

    &__variant {
      @include Flex(row, center, center);
      flex: 1;
      height: 30px;
      border: none;
      outline: none;
      background: none;
      color: white;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      transition-duration: 0.5s;

      &:hover,
      &.active {
        background: cadetblue;
      }
    }
  }
</style>
