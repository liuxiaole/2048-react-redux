import React from 'react';
import HeaderBox from './HeaderBox';
import GameOver from './GameOver';
import Tiles from './Tiles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './GameBoard.css';

const BackgroundGrids = ({size}) => {
  let row = i => {
    return new Array(size).fill().map((_, j) =>
      <div className="grid-cell" key={`grid-cell-${i * size + j}`}></div>
    );
  };
  let grids = new Array(size).fill().map((_, i) => row(i));

  return (
    <div className="grid-container">{grids}</div>
  );
};

BackgroundGrids.propTypes = {
  size: PropTypes.number.isRequired
};

const GameBoard = (props) => (
  <div className="game-board">
    <HeaderBox />
    <div className="game-box">
      <BackgroundGrids size={props.size}/>
      <Tiles/>
      {props.gameOver && <GameOver />}
    </div>
    <a href="https://github.com/liuxiaole/2048-react-redux" className="view-score-link">view source on github</a>
  </div>
);

GameBoard.propTypes = {
  size: PropTypes.number.isRequired,
  gameOver: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    size: state.size,
    gameOver: state.gameStatus === 'over'
  };
};

export default connect(mapStateToProps)(GameBoard);
