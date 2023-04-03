<template>
  <section class="panel">
    <div class="panel__side left" :class="defineClass('x')">
      <div class="panel__x"></div>
    </div>
    <p class="panel__vs">VS</p>
    <div class="panel__side rigth" :class="defineClass('o')">
      <div class="panel__o"></div>
    </div>
    <Transition name="fade">
      <div v-if="result !== ''" class="panel__result">{{ specifyResult() }}</div>
    </Transition>
  </section>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import type { Result, Player, GameStatus } from '@/types/models/tictactoe';

  export default defineComponent({
    name: 'Panel',
    props: {
      result: {
        type: String as PropType<Result>,
        required: true,
      },
      player: {
        type: String as PropType<Player>,
        required: true,
      },
      gameStatus: {
        type: String as PropType<GameStatus>,
        required: true,
      },
    },
    setup(props) {
      // methods
      const specifyResult = (): string => {
        switch (props.result) {
          case 'x': 
            return 'Winner X';
          case 'o':
            return 'Winner O';
          case 'd':
            return 'Draw';
          case '': 
            return ''
        }
      }

      const defineClass = (type: 'x' | 'o'): string => {
        if (props.gameStatus === '') return '';
        if (props.gameStatus === 'start') return props.player === type ? 'active' : '';
        
        if (props.result === type) return 'win';
        else if (props.result === 'd') return 'draw';
        else return 'lose';
      }

      return {
        specifyResult,
        defineClass
      };
    },
  });
</script>

<style lang="scss" scoped>
  .panel {
    @include Flex(row, space-between, center);
    position: relative;
    width: 400px;
    height: 50px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    background: darkseagreen;

    &__side {
      @include Flex(row, center, center);
      width: 120px;
      height: 100%;
      background: darkslategray;
      transition-duration: .5s;

      &.active {
        background: cadetblue;
      }

      &.win {
        background: lightgreen;
      }

      &.lose {
        background: crimson;
      }

      &.draw {
        background: grey;
      }

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
        background: white;
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
      border: 10px solid white;
    }

    &__vs {
      font-weight: 600;
      font-size: 30px;
    }

    &__result {
      @include Flex(row, center, center);
      position: absolute;
      width: 220px;
      height: 30px;
      border-bottom-left-radius: 30px;
      border-bottom-right-radius: 30px;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: gainsboro;
    }
  }
</style>
