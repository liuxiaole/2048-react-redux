import React, { Component } from 'react';
import GameBoard from './GameBoard';
import GameOver from './GameOver';
import Promise from 'promise';

const MOVE_DIR = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0]
};

let tileUUID = 0;

export default class Game extends Component {
  constructor (props) {
    super(props);
    this.state = this.getInitialState();
  }

  componentDidMount () {
    this.newTile();
    this.newTile();
    this.handleKeyPress = this.handleKeyPress.bind(this);
    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress (ev) {
    let { key } = ev;

    if (!this.state.gameStarted) return;
    let match = key.toLowerCase().match(/arrow(up|right|down|left)/);
    if (match) {
      this.move(match[1]);
      ev.preventDefault();
    }
  }

  getInitialState () {
    let size = this.props.size || 4;
    let cells = [];
    for (let i = 0; i < size; i++) {
      let row = cells[i] = [];
      for (let j = 0; j < size; j++) {
        row[j] = null;
      }
    }
    return {
      size, cells,
      gameStarted: true,
      additionScores: [],
      score: 0,
      bestScore: +localStorage.getItem('bestScore')
    };
  }

  eachCell (state, fn) {
    return state.cells.forEach((row, i) =>
        row.forEach((cell, j) => fn(cell, i, j))
      );
  }

  newTile () {
    this.setState(state => {
      let cells = this.state.cells;
      let emptyCells = [];
      // get emptyCells and merge wait-to-merge items
      this.eachCell(state, (cell, i, j) => {
        if(!cell) {
          emptyCells.push([i, j]);
        } else if(cell.mergedItem) {
          // do merge operation
          cell.number += cell.mergedItem.number;
          cell.newMerged = true; // set newMerged flag for animation
        }
      });
      if (emptyCells.length) {
        let index = Math.floor(Math.random() * emptyCells.length);
        let [row, cell] = emptyCells[index];
        cells[row][cell] = {
          number: Math.random() > 0.8 ? 4 : 2,
          newGenerated: true,
          newMerged: false,
          mergedItem: null,
          uuid: tileUUID++
        };
      }
      return {cells};
    });
  }

  isMovable () {
    let movable = false;
    let cells = this.state.cells;
    let size = this.state.size;
    // check each cell,
    // if there is any empty cell, sets movable to true
    // if there are any adjacent cells which has the same number, sets movable to true
    this.eachCell(this.state, (cell, i, j) => {
      if (movable) return; // break;
      if (!cell) {
        movable = true;
        return;
      }
      if (i < size - 1) {
        let bottomCell = cells[i+1][j];
        if (bottomCell && bottomCell.number === cell.number) {
          movable = true;
          return;
        }
      }
      if (j < size - 1) {
        let rightCell = cells[i][j+1];
        if (rightCell && rightCell.number === cell.number) {
          movable = true;
          return;
        }
      }
    });

    return movable;
  }

  sleep (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  move (dir) {
    if (this.isMoving) return;
    let size = this.state.size;
    let cells = this.state.cells;
    let dirOffset = MOVE_DIR[dir];
    let hasMovingTile = false;
    let score = 0;

    for (let i=0; i<size; i++) {
      for (let j=0; j<size; j++) {
        let row = i, col = j;
        if (dir === 'right') {
          // reverse col to get right-to-left iteration
          col = size - j - 1;
        }
        if (dir === 'down') {
          // reverse row to get bottom-to-top iteration
          row = size - i - 1;
        }

        // map <i, j> to <row, col> according direction `dir`
        let cell = cells[row][col];
        if (!cell) continue; // current cell is empty

        // reset tags
        cell.newGenerated = false;
        cell.newMerged = false;
        cell.mergedItem = null;

        // detect next cell in the direction of `dir`
        // firstly, get the next coordinate
        let nextCol = col + dirOffset[0];
        let nextRow = row + dirOffset[1];
        let nextCell;

        // ensure that we're still in game board
        while (nextCol >= 0 && nextCol < size && nextRow >=0 && nextRow < size) {
          nextCell = cells[nextRow][nextCol];
          if (nextCell) {
            // found a non-empty cell in the dir direction, just break
            break;
          }
          // next cell is empty, so walk forward the direction
          nextCol += dirOffset[0];
          nextRow += dirOffset[1];
        }

        if (nextCell && !nextCell.mergedItem && nextCell.number === cell.number) {
          // get the same number cell, and the cell is not new merged one
          // store the merged item, in the later, we'll do merge operation
          // this is for better animation effect reason
          cell.mergedItem = nextCell;
          cells[nextRow][nextCol] = cell;
          cells[row][col] = null;
          hasMovingTile = true;
          score += nextCell.number + cell.number; // calculate score
        } else {
          // step back, put the cell next to nextCell
          nextCol -= dirOffset[0];
          nextRow -= dirOffset[1];
          // if next cell is not the current cell
          if (nextCol !== col || nextRow !== row) {
            cells[nextRow][nextCol] = cell;
            cells[row][col] = null;
            hasMovingTile = true;
          }
        }
      }
    }

    if (hasMovingTile) {
      this.isMoving = true;

      this.setState(state => {
        let nextState = {
          cells,
          score: state.score + score
        };
        if (score) {
          // store the scores in array
          // this is for better animation effect, additionScores is a queue
          // when get score, enqueue score item, when animation end (there is an '+score' rasing up)
          // dequeue the score item, key is for react list rendering
          nextState.additionScores = [...state.additionScores, {score, key: 'score' + Date.now()}];
        }
        return nextState;
      });

      // sleep 80ms for move animation
      this.sleep(80)
        .then(() => {
          this.newTile();
          this.checkGameStatus();
          this.isMoving = false;
        });
    }
  }

  checkGameStatus () {
    let movable = this.isMovable();
    if (!movable) {
      // game over
      let bestScore = this.state.bestScore;
      if (bestScore < this.state.score) {
        bestScore = this.state.score;
        localStorage.setItem('bestScore', bestScore);
      }
      this.setState({gameStarted: false, bestScore});
    }
  }

  render () {
    return (
      <div>
        <GameBoard
          {...this.state}
          onAdditionScoreAnimationEnd={this.handleAdditionScoreAnimationEnd.bind(this)}
          onNewGame={this.startNewGame.bind(this)}
          onSwipe={this.move.bind(this)}
        >
          {!this.state.gameStarted &&
            <GameOver onNewGame={this.startNewGame.bind(this)}></GameOver>
          }
        </GameBoard>
      </div>
    );
  }

  handleAdditionScoreAnimationEnd (ev, scoreItem, index) {
    this.setState(state => {
      let additionScores = state.additionScores;
      // when score item is `raised up`, dequeue score item from additionScores
      return {additionScores: [...additionScores.slice(0, index), ...additionScores.slice(index+1)]};
    });
  }

  startNewGame () {
    setTimeout(() => {
      tileUUID = 0;
      this.setState(this.getInitialState());
      this.newTile();
      this.newTile();
    }, 0);
  }
}
