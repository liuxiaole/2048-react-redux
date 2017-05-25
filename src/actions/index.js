import * as ActionTypes from './action-types';
import { generateNewTile, preMergeTile, moveTile, mergeTile } from './tiles';

export const startNewGame = () => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.START_NEW_GAME,
    size: getState().size
  });
  dispatch(generateNewTile());
  dispatch(generateNewTile());
};

export const setGameOver = () => {
  return {
    type: ActionTypes.GAME_OVER
  };
};

const MOVE_DIR = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0]
};

export const moveChessBoard = (dir) => (dispatch, getState) => {
  let { size, tiles } = getState();
  let dirOffset = MOVE_DIR[dir];
  let score = 0;
  let movingPromise;

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
      // every iteration, we have to get new state case
      let tile = tiles[row][col];
      if (!tile) continue; // current tile is empty

      // detect next tile in the direction of `dir`
      // firstly, get the next coordinate
      let nextCol = col + dirOffset[0];
      let nextRow = row + dirOffset[1];
      let nextTile;

      // ensure that we're still in game board
      while (nextCol >= 0 && nextCol < size && nextRow >=0 && nextRow < size) {
        nextTile = tiles[nextRow][nextCol];
        if (nextTile) {
          // found a non-empty tile in the dir direction, just break
          break;
        }
        // next cell is empty, so walk forward the direction
        nextCol += dirOffset[0];
        nextRow += dirOffset[1];
      }

      if (nextTile && !nextTile.tileToMerge && nextTile.number === tile.number) {
        // get the same number cell, and the cell is not new merged one
        let payload = {
          col, row,
          destCol: nextCol,
          destRow: nextRow
        };

        dispatch(preMergeTile(payload));
        movingPromise = dispatch(moveTile(payload));

        // then merge tile
        // we don't chain this promise because we want the chess board can reponse immediately after moving not after merging
        movingPromise.then(({destCol: col, destRow: row}) => {
          dispatch(mergeTile({row, col}));
        }).catch(reason => console.trace(reason));

        ({ tiles } = getState());

        score += nextTile.number + tile.number; // calculate score
      } else {
        // step back, put the cell next to nextCell
        nextCol -= dirOffset[0];
        nextRow -= dirOffset[1];
        // if next cell is not the current cell
        if (nextCol !== col || nextRow !== row) {
          movingPromise = dispatch(moveTile({
            row, col,
            destRow: nextRow,
            destCol: nextCol
          }));
          ({ tiles } = getState());
        }
      }
    }
  }

  return {movingPromise, score};
};

export * from './tiles';
export * from './scores';
