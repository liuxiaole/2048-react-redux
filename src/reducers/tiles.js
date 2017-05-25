import * as ActionTypes from '../actions/action-types';

const getInitialTiles = size => {
  let tiles = [];
  for (let i = 0; i < size; i++) {
    let row = tiles[i] = [];
    for (let j = 0; j < size; j++) {
      row[j] = null;
    }
  }
  return tiles;
};

const mapTiles = (tiles, row, col) => {
  return mapper => {
    return tiles.map((rows, rowNum) => {
      if(rowNum !== row) return rows;
      return rows.map((tile, colNum) => {
        if(colNum !== col) return tile;
        return mapper(tile);
      });
    });
  };
};

const tile = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.GENERATE_NEW_TILE:
      return {
        number: action.number,
        newGenerated: true,
        newMerged: false,
        tileToMerge: null,
        uuid: action.uuid,
        col: action.col,
        row: action.row
      };

    case ActionTypes.RESET_NEW_GENERATED_TILE_TAG:
      return {
        ...state,
        newGenerated: false
      };

    case ActionTypes.MERGE_TILE:
      return {
        ...state,
        number: state.number + state.tileToMerge.number,
        newMerged: true
      };
    case ActionTypes.PRE_MERGE_TILE:
      return {
        ...state,
        tileToMerge: action.tileToMerge
      };

    case ActionTypes.RESET_NEW_MERGED_TILE_TAG:
      return {
        ...state,
        newMerged: false,
        tileToMerge: null
      };

    default:
      return state;
  }
};

const tiles = (state = [], action) => {
  switch(action.type) {
    case ActionTypes.START_NEW_GAME:
      return getInitialTiles(action.size);

    case ActionTypes.GENERATE_NEW_TILE:
    case ActionTypes.RESET_NEW_MERGED_TILE_TAG:
    case ActionTypes.RESET_NEW_GENERATED_TILE_TAG:
    case ActionTypes.MERGE_TILE:
      return mapTiles(state, action.row, action.col)(item => tile(item, action));

    case ActionTypes.PRE_MERGE_TILE:
      let tileToMerge = state[action.destRow][action.destCol];
      state = mapTiles(state, action.row, action.col)(item =>
        tile(item, {...action, tileToMerge})
      );
      return mapTiles(state, action.destRow, action.destCol)(item => null);

    case ActionTypes.MOVE_TILE:
      let tileToMove = state[action.row][action.col];
      state = mapTiles(state, action.row, action.col)(item => null); // delete source tile
      return mapTiles(state, action.destRow, action.destCol)(item => {
        return {
          ...tileToMove,
          col: action.destCol,
          row: action.destRow
        };
      });

    default:
      return state;
  }
};

export default tiles;
