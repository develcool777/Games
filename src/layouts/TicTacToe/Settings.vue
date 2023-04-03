<template>
  <section class="set">
    <div class="set__btns">
      <button type="button" title="Play" @click="start()">
        <SvgIcon :name="'Play'" class="set__svg" />
      </button>
      <button type="button" title="Cancel">
        <SvgIcon :name="'Cancel'" class="set__svg" @click="cancel()" />
      </button>
      <button type="button" title="Return move">
        <SvgIcon :name="'Return'" class="set__svg" @click="returnMove()" />
      </button>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent, type PropType } from 'vue';
  import SvgIcon from '@/svg/SvgIcon.vue';
  import type { GameStatus } from '@/types/models/tictactoe';

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
    },
    emits: ['start', 'cancel', 'returnMove'],
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

      return {
        start,
        cancel,
        returnMove,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .set {
    @include Flex(column, flex-start);
    width: 250px;

    &__svg {
      width: 24px;
      height: 24px;
      fill: red;
    }
  }
</style>
