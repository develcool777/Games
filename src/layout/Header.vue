<template>
  <header>
    <div class="head">
      <router-link tag="div" class="head__logo" to="/">
        <img class="head__img" src="@/assets/header/videogame.png" alt="logo">
        Games
      </router-link>
      <div class="head__wrapperDiv" @click="showHideUser()" draggable="false" title="Account">
        <fontAwesome icon="user-circle" v-if="getUser === null"/>
        <img :src="getUser.avatar" class="head__avatar" alt="Avatar" v-else>
      </div>
    </div>
  </header>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('user');
export default {
  name: 'Header',
  computed: {
    ...mapGetters(['getShowUser', 'getUser'])
  },
  methods: {
    ...mapActions(['SET_SHOW_USER']),

    showHideUser() {
      this.SET_SHOW_USER(!this.getShowUser)
    }
  }
}
</script>

<style lang="scss" scopped>
.head {
  @include Flex(center);
  position: relative;
  width: 100%;
  height: 55px;
  background: $black;
  color: white;

  &__img {
    width: 35px;
    height: 30px;
    transition-duration: .5s;
  }

  &__logo, &__link {
    font-size: 30px;
    text-decoration: none;
    color: $white;
  }

  &__logo {
    display: flex;
  }

  &__link {
    font-size: 20px;
  }

  &__wrapperDiv {
    position: absolute;
    top: 50%;
    right: 20px;
    width: 30px;
    height: 30px;
    transform: translateY(-50%);
    transition-duration: .5s;
    font-size: 30px;
    color: white;
    cursor: pointer;
  }

  &__avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.head__logo:hover  .head__img{
  transform: scale(1.1, 1.1);
}
</style>