import React from 'react';
import PropTypes from 'prop-types';
import * as actions from '../actions';
import flatten from 'lodash.flatten';
import { connect } from 'react-redux';
import './Tiles.css';

const TILE_WIDTH = 100;
const TILE_GAP = 10;

let Tile = (props) => {
  let {col, row} = props;
  let classMap = {
    tile: true,
    [`tile-${props.number}`]: true,
    'tile-new': props.newGenerated,
    'tile-merged': !!props.newMerged
  };
  let classNames = Object.keys(classMap).filter(cls => !!classMap[cls]).join(' ');
  let x = col * ( TILE_WIDTH + TILE_GAP) + 'px';
  let y = row * ( TILE_WIDTH + TILE_GAP) + 'px';
  let style = {transform: `translate3d(${x}, ${y}, 0)`};
  return (
    <div className={classNames} style={style}>
      <div className="tile-inner" onAnimationEnd={props.onAnimationEnd}>{props.number}</div>
    </div>
  );
};

Tile.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
  newGenerated: PropTypes.bool.isRequired,
  newMerged: PropTypes.bool.isRequired,
  onAnimationEnd: PropTypes.func.isRequired
};

const mapDispatchToTileProps = (dispatch, ownProps) => {
  return {
    onAnimationEnd({animationName}) {
      // designed in css file
      let { col, row } = ownProps;
      if (animationName === 'a-tile-new') {
        dispatch(actions.resetNewGeneratedTileTag({ col, row }));
      } else if(animationName === 'a-tile-merged') {
        dispatch(actions.resetNewMergedTileTag({ col, row }));
      }
    }
  };
};

Tile = connect(null, mapDispatchToTileProps)(Tile);


const Tiles = ({flatTiles}) => (
  <div className="tile-container">{flatTiles.map(tile =>
    <Tile key={'tile-'+tile.uuid} {...tile}></Tile>
  )}</div>
);

Tiles.propTypes = {
  flatTiles: PropTypes.array.isRequired
};

const flattenTiles = tiles => {
  let flatTiles = [];
  flatten(tiles).filter(tile => !!tile).forEach(tile => {
    flatTiles.push(tile);
    if(tile.tileToMerge) {
      flatTiles.push(tile.tileToMerge);
    }
  });
  return flatTiles.sort((tile1, tile2) => tile1.uuid > tile2.uuid ? 1 : -1);
};

const mapStateToProps = ({tiles}) => {
  return {
    flatTiles: flattenTiles(tiles)
  };
};

export default connect(mapStateToProps)(Tiles);
