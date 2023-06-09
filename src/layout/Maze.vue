<template>
  <div class="maze">
    <div class="maze__game">
      <div class="maze__field">
        <div class="maze__row" v-for="(row, i) in fieldForDraw" :key="i">
          <div :class="cell.class" v-for="(cell, j) in row" :key="j"></div>
        </div>
      </div>
    </div>
    <Instruction 
      class="maze__instruction" 
      :timer="gameTimeForPrint"
      :gameStatus="gameStatus"
      :currentLevel="getCurrentLevel"
      :amountOfLevels="getAmountOfLevels"
      v-on:startGame="startLoop()"
      v-on:stopGame="stopLoop()"
      v-on:restart="restartGame()"
      v-on:finishGame="cleanField()"
      v-on:changeLevel="changeLevel($event)"
      v-on:clicked="arrowPressed($event)"
    />
    <GameInfoButton :path="{ name: 'Information', params: { name: 'maze' }}"/>
  </div>
  <ResultMaze
    :gameResult="gameResult"
    :status="gameStatus"
    :timeInMs="gameResultTime"
    :currentLevel="getCurrentLevel"
    :amountOfLevels="getAmountOfLevels"
    v-on:changeLevel="changeLevel($event)"
    v-on:restart="restartGame()"
    v-on:close="cleanField()"
  />
  <transition name="fade">
    <Loading v-if="loading" class="LOADING" :step="1.5"/>
  </transition>  
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('maze');
import Field from '@/model/maze/field' 
import Game from '@/model/maze/game'
import ResultMaze from '@/components/Maze/Result'
import Instruction from '@/components/Maze/Instruction'
import Loading from '@/components/Loading'
import GameInfoButton from '@/components/GameInfoButton'
export default {
  components: {
    Instruction,
    ResultMaze,
    Loading,
    GameInfoButton
  },
  data() {
    return {
      FIELD: {},
      GAME: {},
      fieldForDraw: [],
      loading: true,
    }
  },
  watch: {
    gameTime(newTime) {
      if (newTime === 0) { 
        this.isFinish(true);
      }
    },

    showPath: function(newValue) {
      this.fieldForDraw = this.FIELD.render(this.GAME.field, newValue, this.getShowHint);
    },

    showHint: function(newValue) {
      this.fieldForDraw = this.FIELD.render(this.GAME.field, this.getShowPath, newValue);
    }
  },
  computed: {
    ...mapState(['showPath', 'showHint']),
    ...mapGetters(['getShowPath', 'getShowHint', 'getData']),

    gameTimeForPrint() {
      return this.GAME?.timer?.timeForPrint || '0:00';
    },

    gameTime() {
      return this.GAME?.timer?.time 
    },

    gameStatus() {
      return this.GAME.gameStatus;
    },

    gameResult() {
      return this.GAME.result;
    },

    gameResultTime() {
      return this.GAME.resultTime;
    },

    getCurrentLevel() {
      return this.FIELD.level;
    },

    getAmountOfLevels() {
      return this.FIELD.amountOfLevels;
    }
  },
  async created() {
    setTimeout(() => {this.loading = false}, 1000);
    await this.init();
  },
  methods: {
    ...mapActions(['INIT_STATE', 'CHANGE_ARROW', 'SET_DATA', 'CHANGE_SHOW_HINT', 'CLEAR_STATE']),

    async init() {
      await this.SET_DATA();
      this.FIELD = new Field(this.getData);
      this.createGame();
    },

    createGame() {
      this.INIT_STATE();
      this.GAME = new Game(...this.FIELD.dataForGame());
      this.render();
    },

    changeLevel(direction) {
      const level = this.FIELD.level;
      const amount = this.FIELD.amountOfLevels;
      let step;
      switch (direction) {
        case 'First':
          step = 1
          break;
      
        case 'Prev':
          step = level === 1 ? 1 : level - 1;
          break;

        case 'Next':
          step = level === amount ? amount : level + 1;
          break;

        case 'Last':
          step = amount; 
          break;

        default: break;
      }
      this.FIELD.changeLevel(step);
      this.createGame();
    },

    restartGame() {
      this.cleanField();
      this.startLoop();
    },

    cleanField() {
      this.stopLoop();
      this.GAME.clean();
      this.CHANGE_SHOW_HINT(false);
      this.render()
    },

    startLoop() {   
      this.GAME.startGame();
      window.addEventListener('keyup', this.arrowPressed); 
    },

    stopLoop() {
      this.GAME.stopGame();
      window.removeEventListener('keyup', this.arrowPressed);
    },

    arrowPressed(event) {
      const eventChecker = e => typeof e === 'string' ? e : e.key;
      const key = eventChecker(event);
      this.keyPressed(key);
      this.render();
      this.isFinish(false);
    },

    render() {
      this.fieldForDraw = this.FIELD.render(this.GAME.field, this.getShowPath, this.getShowHint);
    },

    keyPressed(key) {
      if (key === 'ArrowUp') {
        this.GAME.moves('W');
        this.CHANGE_ARROW(1)
      }
      if (key === 'ArrowLeft') {
        this.GAME.moves('A');
        this.CHANGE_ARROW(2)
      }
      if (key === 'ArrowDown') {
        this.GAME.moves('S');
        this.CHANGE_ARROW(3)
      }
      if (key === 'ArrowRight') {
        this.GAME.moves('D');
        this.CHANGE_ARROW(4)
      }

      setTimeout(() => { this.CHANGE_ARROW(0) }, 250);
    },

    isFinish(lost=false) {
      if (lost) { 
        this.GAME.gameFinished('Lost');
      }

      const [x, y] = this.GAME.player.getPosition();
      if (!lost && this.GAME.checkWin(x, y)) {
        this.GAME.gameFinished('Won');
      }

      if (this.GAME.gameStatus === 'finish') {
        window.removeEventListener('keyup', this.arrowPressed);
      }
    }
  },
  beforeUnmount() {
    this.CLEAR_STATE();
  }
}
</script>

<style lang="scss" scoped>
.maze {
	display: flex;
  align-items: center;
  flex: 1;

  &__game {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center; 
  }

  &__instruction {
    flex-basis: rem(300);
    margin-right: 10px;
  }

  &__row {
    @include Flex(center);
  }
}

.empty {
  @include Size();
}

.block {
  @include Size();
  background: $black;
}

.startPosition {
  @include Size();
  background: plum;
}

.endPosition {
  @include Size();
  background: $win;
}

.player {
  position: relative;
}

.player::after {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: rem(15);
  height: rem(15);
  border-radius: rem(5);
  background: darkgreen;
}

.path {
  position: relative;
}

.hint {
  position: relative;
}

.path::after, .hint::after {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: rem(10);
  height: rem(10);
  border-radius: 50%;
}

.path::after {
  background: green;
}

.hint::after {
  background: red;
}
</style>