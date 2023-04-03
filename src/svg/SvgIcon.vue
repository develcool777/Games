<template>
  <component class="SVG" :class="defineClass()" :is="svgComponent" />
</template>

<script lang="ts">
  import { computed, defineAsyncComponent, defineComponent } from 'vue';

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      name: {
        type: String,
        required: true,
      },
      disableTransition: {
        type: Boolean,
        default: false,
      },
      disableColorinheritance: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      // computed
      const svgComponent = computed(() => {
        return defineAsyncComponent(() => import(`@/svg/icons/${props.name}.vue`));
      });
      // methods
      const defineClass = (): object => {
        return {
          inherit: !props.disableColorinheritance,
          tr: !props.disableTransition,
        };
      };
      return {
        svgComponent,
        defineClass,
      };
    },
  });
</script>

<style lang="scss">
  .SVG {
    &.tr {
      transition-duration: 0.5s;
    }
    &.inherit path,
    &.inherit g {
      fill: inherit;
    }
  }
</style>
