import Figures from "../figures";

export default class Knight extends Figures {
  /**
   * @class
   * @alias Knight
   * @memberof Chess#Figures#
   * @augments Figures
   * @classdesc This class represents the logic of Knight figure
   * @param {String} color - color of the figure
   * @param {Object} position - position of the figure 
   * @param {String} side - side of the figure 
   * @constructor
   * @property {String} color - this `color`
   * @property {Object} position - this `position`
   * @property {Object} side - this `side`
   * @property {String} name - name of the figure
   * @throws Error - if `color` is not String
   * @throws Error - if `color` is not 'white' or 'black'
   * @throws Error - if `position` is not Object
   * @throws Error - if `position` is not Object with keys: 'x' and 'y'
   * @throws Error - if `side` is not String
   * @throws Error - if `side` is not 'up' or 'down'
   */
  constructor(color, position, side) {
    super();

    if (typeof color !== 'string') {
      throw Error(`Knight.constructor color must be String`);
    }
    if (!['white', 'black'].includes(color)) {
      throw Error(`Knight.constructor color must be 'white' or 'black'`);
    }
    if (typeof position !== 'object' || position === null || Array.isArray(position)) {
      throw Error(`Knight.constructor position must be Object`);
    }
    if (['x', 'y'].every(prop => !Object.prototype.hasOwnProperty.call(position, prop))) {
      throw Error(`Knight.constructor position must be Object with keys x and y`);
    }
    if (typeof side !== 'string') {
      throw Error(`Knight.constructor side must be String`);
    }
    if (!['up', 'down'].includes(side)) {
      throw Error(`Knight.constructor side must be 'up' or 'down'`);
    }
    const name = 'Knight';
    Object.defineProperties(this, {
      color: {
        get: () => color
      },
      side: {
        get: () => side,
        set: (value) => {
          if (typeof value !== 'string') {
            throw Error(`Knight.side.set(value) value be String`);
          }
          if (!['up', 'down'].includes(value)) {
            throw Error(`Knight.side.set(value) value must be 'up' or 'down'`);
          }
          side = value;
        }
      },
      position: {
        get: () => position
      },
      name: {
        get: () => name
      }
    })
  }


  /**
   * @method available
   * @memberof Chess#Figures#Knight#
   * @description Returns all available moves for the figure
   * @param {Array} field chess board
   * @returns {Object} {
      move: [],
      kill: [],
      check: [],
      wayToKing: [],
      cover: [],
    }
   * @example 
   * const f = new Field()
   * this.available(f.board); 
   */
  available(field) {
    const available = {
      move: [],
      kill: [],
      check: [],
      wayToKing: [],
      cover: [],
    };

    const check = (x, y) => {
      if (field[x][y].figure !== null) {
        if (field[x][y].figure.color !== this.color) { 
          if (field[x][y].figure.name === 'King') {
            available.check.push({x, y});
            return;
          }
          available.kill.push({x, y});
          return;
        } 
        available.cover.push({x, y});
        return;
      }
      available.move.push({x, y});
    }

    //  ##
    //  #
    //  #
    if (this.position.x - 2 >= 0 && this.position.y + 1 < field.length) {
      check(this.position.x - 2, this.position.y + 1);
    }

    // ##
    //  #
    //  #
    if (this.position.x - 2 >= 0 && this.position.y - 1 >= 0) {
      check(this.position.x - 2, this.position.y - 1);
    }

    //  #
    //  #
    // ##
    if (this.position.x + 2 < field.length && this.position.y - 1 >= 0) {
      check(this.position.x + 2, this.position.y - 1);
    }

    //  #
    //  #
    //  ##
    if (this.position.x + 2 < field.length && this.position.y + 1 < field.length) {
      check(this.position.x + 2, this.position.y + 1);
    }

    //    #
    //    ###
    if (this.position.x + 1 < field.length && this.position.y + 2 < field.length) {
      check(this.position.x + 1, this.position.y + 2);
    }

    //    #
    //  ###
    if (this.position.x + 1 < field.length && this.position.y - 2 >= 0) {
      check(this.position.x + 1, this.position.y - 2);
    }

    //    ###
    //    #
    if (this.position.x - 1 >= 0 && this.position.y + 2 < field.length) {
      check(this.position.x - 1, this.position.y + 2);
    }

    //  ###
    //    #
    if (this.position.x - 1 >=0 && this.position.y - 2 >= 0) {
      check(this.position.x - 1, this.position.y - 2);
    }

    available.wayToKing.push({...this.position});

    return available
  }

  /**
   * @method makeMove
   * @memberof Chess#Figures#Knight#
   * @param {Array} cordinates - new position for figure [x, y] 
   * @param {Array} field - chess board
   * @returns {undefined} undefined 
   * @example 
   * const f = new Field()
   * this.makeMove([0, 1], f.board)
   */
  makeMove(cordinates, field) {
    super.makeMove(cordinates, field, this);
  }
}