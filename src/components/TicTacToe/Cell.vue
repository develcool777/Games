<template>
  <button type="button" class="cell" :class="{ win: isWin }" @mouseover="isHovered = gameStatus === 'start'" @mouseleave="isHovered = false">
    <Transition name="fade">
      <div v-if="isShow('o')" class="cell__o" :class="{ hovered: defineHovered('o') }"></div>
    </Transition>
    <Transition name="fade">
      <div v-if="isShow('x')" class="cell__x" :class="{ hovered: defineHovered('x') }"></div>
    </Transition>
  </button>
</template>

<script lang="ts">
  import { defineComponent, ref, type PropType } from 'vue';
  import type { Cell, Player, GameStatus } from '@/types/models/tictactoe';

  export default defineComponent({
    name: 'Cell',
    props: {
      cell: {
        type: String as PropType<Cell>,
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
      isWin: {
        type: Boolean,
        required: true,
      },
    },
    setup(props) {
      const isHovered = ref<boolean>(false);

      const isShow = (type: Player): boolean => {
        return props.cell === type || defineHovered(type);
      };

      const defineHovered = (type: Player): boolean => {
        return props.cell === '' && props.player === type && isHovered.value;
      };

      return {
        isHovered,
        isShow,
        defineHovered,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .cell {
    @include Flex(row, center, center);
    width: 150px;
    height: 150px;
    background: white;
    border: none;
    outline: none;
    cursor: pointer;
    transition-duration: 0.5s;

    &.win {
      background: lightgreen;
    }

    &__o {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 20px solid #5aa5d1;
      transition-duration: 0.5s;

      &.hovered {
        border-color: lighten($color: #5aa5d1, $amount: 20);
      }
    }

    &__x {
      position: relative;
      width: 120px;
      height: 120px;

      &::before,
      &::after {
        position: absolute;
        top: 50%;
        left: 0;
        content: '';
        height: 20px;
        width: 100%;
        background: #e4465b;
        transition-duration: 0.5s;
      }

      &.hovered::before,
      &.hovered::after {
        background: lighten($color: #e4465b, $amount: 20);
      }

      &::before {
        transform: translateY(-50%) rotate(-45deg);
      }

      &::after {
        transform: translateY(-50%) rotate(45deg);
      }
    }
  }
</style>
