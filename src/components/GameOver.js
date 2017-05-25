import React from 'react';
import PropTypes from 'prop-types';
import { startNewGame } from '../actions';
import { connect } from 'react-redux';
import './GameOver.css';


let GameOver = ({dispatch}) => {
  return <div className="game-over">
    <h1 className="title">Game Over!</h1>
    <button onClick={() => dispatch(startNewGame())}>Try Again</button>
  </div>;
};

GameOver.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(GameOver);
