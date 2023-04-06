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
        <button type="button" class="set__variant" :class="{ active: boardSize === 3 }" @click="setSize(3)">3x3</button>
        <button type="button" class="set__variant" :class="{ active: boardSize === 5 }" @click="setSize(5)">5x5</button>
        <button type="button" class="set__variant" :class="{ active: boardSize === 7 }" @click="setSize(7)">7x7</button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import SvgIcon from '@/svg/SvgIcon.vue';
  import type { GameStatus, BoardSize } from '@/types/models/tictactoe';

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
      boardSize: {
        type: Number as PropType<3 | 5 | 7>,
        required: true,
      },
    },
    emits: ['start', 'cancel', 'returnMove', 'setSize'],
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

      const setSize = (size: BoardSize): void => {
        if (props.gameStatus === 'start' || props.boardSize === size) return;
        context.emit('setSize', size);
      };

      return {
        start,
        cancel,
        returnMove,
        setSize,
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
