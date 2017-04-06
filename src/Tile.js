import React, { Component } from 'react';
import './Tile.css';

const TILE_WIDTH = 100;
const TILE_GAP = 10;

export default class Tile extends Component {
  render () {
    let {cell, col, row} = this.props;
    let classMap = {
      tile: true,
      [`tile-${cell.number}`]: true,
      'tile-new': cell.newGenerated,
      'tile-merged': !!cell.newMerged
    };
    let classNames = Object.keys(classMap).filter(cls => !!classMap[cls]).join(' ');
    let x = col * ( TILE_WIDTH + TILE_GAP) + 'px';
    let y = row * ( TILE_WIDTH + TILE_GAP) + 'px';
    let style = {transform: `translate3d(${x}, ${y}, 0)`};
    return (
      <div className={classNames} style={style}>
        <div className="tile-inner">{cell.number}</div>
      </div>
    );
  }
}
