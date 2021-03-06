
/**
 * @class 
 * @alias Board
 * @memberof TicTacToe#
 * @classdesc This class have methods to build the board, [`more info`]{@link https://alialaa.com/blog/tic-tac-toe-js}
 * @constructor
 * @param {Array} state - field for game
 * @throws Error - if `state` is not Array
 * @throws Error - if `state` length is not equals to 9
 * @throws Error - if every element of `state` is not String
 * @throws Error - if every element of `state` is not '' or 'x' or 'o'
 */
class Board {
  constructor(state = ['','','','','','','','','']) {
    if (!Array.isArray(state)) {
      throw Error(`Board.constructor(state) state must be Array`);
    }
    if (state.length !== 9) {
      throw Error(`Board.constructor(state) state length must be 9`);
    }
    if (!state.every(item => typeof item === 'string')) {
      throw Error(`Board.constructor(state) every element of state must be String`);
    }
    if (!state.every(item => ['', 'x', 'o'].includes(item))) {
      throw Error(`Board.constructor(state) every element of state must be '' or 'x' or 'o'`);
    }
    this.state = state;
  }
  /**
   * @method 
   * @alias isEmpty
   * @memberof TicTacToe#Board#
   * @description Returns true if every cell is empty otherwise false 
   * @returns {Boolean} Boolean
   * @example const isEmpty = this.isEmpty()
   */
  isEmpty() {
    return this.state.every(cell => !cell);
  }

  /**
   * @method 
   * @alias isFull
   * @memberof TicTacToe#Board#
   * @description Returns true if there is no empty cell otherwise false 
   * @returns {Boolean} Boolean
   * @example const isFull = this.isFull() 
   */
  isFull() {
    return this.state.every(cell => cell);
  }

  /**
   * @method 
   * @alias insert
   * @memberof TicTacToe#Board#
   * @param {String} symbol - Value must be 'x' or 'o'
   * @param {Number} position - Value must be Integer in range(0, 8)
   * @throws Error - if `symbol` is not 'x' or 'o'
   * @throws Error - if `position` is not Integer
   * @throws Error - if `position` is not in range(0, 8)
   * @description Insert `symbol` in `this.state` at the `position` in case of success return true, otherwise false
   * @returns {Boolean} Boolean
   * @example const isInserted = this.insert('x', 4); 
   */
  insert(symbol, position) {
    if(!['x','o'].includes(symbol)) {
      throw new Error(`Board.insert(symbol, position) symbol can only be x or o!`)
    }
    if(!Number.isInteger(position)) {
      throw new Error(`Board.insert(symbol, position) position must be Integer`)
    }
    if(![0,1,2,3,4,5,6,7,8].includes(position)) {
      throw new Error(`Board.insert(symbol, position) position must be in range(0, 8)`)
    }
    if(this.state[position]) {
      return false;
    }
    this.state[position] = symbol;
    return true;
  }

  /**
   * @method 
   * @alias getAvailableMoves
   * @memberof TicTacToe#Board#
   * @description Returns array of available positions
   * @returns {Array} Array
   * @example const availablePos = this.getAvailableMoves()
   */
  getAvailableMoves() {
    const moves = [];
    this.state.forEach((cell, index) => {
      if(!cell) moves.push(index); 
    });
    return moves;
  }

  /**
   * @method 
   * @alias isTerminal
   * @memberof TicTacToe#Board#
   * @description If there is a winner or it's draw returns object otherwise boolean(false)
   * @returns {Boolean|Object} Boolean|Object
   * @example const result = this.isTerminal()
   */
  isTerminal() {
    if(this.isEmpty()) return false;
    //Checking Horisontal Wins
    if(this.state[0] === this.state[1] && this.state[0] === this.state[2] && this.state[0]) {
      return {'winner': this.state[0], 'direction': 'H', 'row': 1};
    }
    if(this.state[3] === this.state[4] && this.state[3] === this.state[5] && this.state[3]) {
      return {'winner': this.state[3], 'direction': 'H', 'row': 2};
    }
    if(this.state[6] === this.state[7] && this.state[6] === this.state[8] && this.state[6]) {
      return {'winner': this.state[6], 'direction': 'H', 'row': 3};
    }

    //Checking Vertical Wins
    if(this.state[0] === this.state[3] && this.state[0] === this.state[6] && this.state[0]) {
      return {'winner': this.state[0], 'direction': 'V', 'column': 1};
    }
    if(this.state[1] === this.state[4] && this.state[1] === this.state[7] && this.state[1]) {
      return {'winner': this.state[1], 'direction': 'V', 'column': 2};
    }
    if(this.state[2] === this.state[5] && this.state[2] === this.state[8] && this.state[2]) {
      return {'winner': this.state[2], 'direction': 'V', 'column': 3};
    }

    //Checking Diagonal Wins
    if(this.state[0] === this.state[4] && this.state[0] === this.state[8] && this.state[0]) {
      return {'winner': this.state[0], 'direction': 'D', 'diagonal': 'main'};
    }
    if(this.state[2] === this.state[4] && this.state[2] === this.state[6] && this.state[2]) {
      return {'winner': this.state[2], 'direction': 'D', 'diagonal': 'counter'};
    }

    // Draw
    if(this.isFull()) {
      return {'winner': 'draw'};
    }

    return false;
  }
}


class minMax {
/**
 * @class 
 * @alias minMax
 * @memberof TicTacToe#
 * @classdesc This class represent logic of computer thinking, otherwise determine the best move for computer, 
 * [`more info`]{@link https://alialaa.com/blog/tic-tac-toe-js-minimax}
 * @constructor 
 * @param {Integer} maxDepth - max depth
 * @throws Error - if `maxDepth` is not Integer
 */
  constructor(maxDepth = -1) {
    if (!Number.isInteger(maxDepth)) {
      throw Error(`minMax.constructor(maxDepth) maxDepth must be Integer`);
    }
    this.maxDepth = maxDepth;
    this.nodesMap = new Map();
  }
  /**
   * @method getBestMove
   * @memberof TicTacToe#minMax#
   * @param {Instance} board - instance of [`Board`]{@link TicTacToe#Board}
   * @param {Boolean} maximizing - if value is `true` will calculate best move for `x`, otherwise for `o`
   * @param {Function} callback - callback function
   * @param {Number} depth - depth of calculation
   * @description This method define the best move for computer with MinMax algorithm, if best move needed for `x`, `maximazing` must be `true`, for `o` `false`. Returns position of cell
   * @throws Error - if `board` is not instance of [`Board`]{@link TicTacToe#Board}
   * @throws Error - if `maximazing` is not Boolean
   * @throws Error - if `callback` is not Function
   * @throws Error - if `depth` is not Integer
   * @returns {Number} Number
   * @example 
   * const b = new Board();
   * b.state = [
   *  'x', 'o', 'x',
   *  '',  'o',  '',
   *  '',  '',  'x',
   * ]
   * const best = this.getBestMove(b, false); // best move for 'o' is to put 'o' on 7 cell 
   */
  getBestMove(board, maximizing = true, callback = () => {}, depth = 0) {
    if (!(board instanceof Board)) {
      throw Error(`minMax.getBestMove(board, maximizing = true, callback = () => {}, depth = 0) board must be instance of Board`);
    }
    if (typeof maximizing !== 'boolean') {
      throw Error(`minMax.getBestMove(board, maximizing = true, callback = () => {}, depth = 0) maximizing must be Boolean`);
    }
    if (!(callback instanceof Function)) {
      throw Error(`minMax.getBestMove(board, maximizing = true, callback = () => {}, depth = 0) callback must be Function`);
    }
    if (!Number.isInteger(depth)) {
      throw Error(`minMax.getBestMove(board, maximizing = true, callback = () => {}, depth = 0) depth must be Integer`);
    }
    if(depth == 0) this.nodesMap.clear();
  
    if(board.isTerminal() || depth === this.maxDepth ) {
      if(board.isTerminal().winner === 'x') {
          return 100 - depth;
      } else if (board.isTerminal().winner === 'o') {
          return -100 + depth;
      } 
      return 0;
    }
    if(maximizing) {
      let best = -100;
      board.getAvailableMoves().forEach(index => {
        const child = new Board([...board.state]);
        child.insert('x', index);
        const nodeValue = this.getBestMove(child, false, callback, depth + 1);
        best = Math.max(best, nodeValue);
      
        if(depth == 0) {
          const moves = this.nodesMap.has(nodeValue) ? `${this.nodesMap.get(nodeValue)},${index}` : index;
          this.nodesMap.set(nodeValue, moves);
        }
      });
      if(depth == 0) {
        let returnValue;
        if(typeof this.nodesMap.get(best) == 'string') {
          const arr = this.nodesMap.get(best).split(',');
          const rand = Math.floor(Math.random() * arr.length);
          returnValue = arr[rand];
        } else {
          returnValue = this.nodesMap.get(best);
        }
        callback(returnValue);
        return returnValue;
      }
      return best;
    }

    if(!maximizing) {
      let best = 100;
      board.getAvailableMoves().forEach(index => {
        const child = new Board([...board.state]);
        child.insert('o', index);
        let nodeValue = this.getBestMove(child, true, callback, depth + 1);
        best = Math.min(best, nodeValue);
        if(depth == 0) {
          const moves = this.nodesMap.has(nodeValue) ? this.nodesMap.get(nodeValue) + ',' + index : index;
          this.nodesMap.set(nodeValue, moves);
        }
      });

      if(depth == 0) {
        let returnValue;
        if(typeof this.nodesMap.get(best) == 'string') {
          const arr = this.nodesMap.get(best).split(',');
          const rand = Math.floor(Math.random() * arr.length);
          returnValue = arr[rand];
        } else {
          returnValue = this.nodesMap.get(best);
        }
        callback(returnValue);
        return returnValue;
      }
      return best;
    }
  }
}

module.exports = {
  minMax,
  Board 
}