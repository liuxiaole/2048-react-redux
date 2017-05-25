import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cleanRecentAddedScore, startNewGame } from '../actions';
import './HeaderBox.css';

const ScoreBox = ({ label, score, children }) => {
  return (
    <div className="score-box">
      <div className="score-label">{label}</div>
      <div className="score-content">{score}</div>
      {children}
    </div>
  );
};

ScoreBox.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
};

const HeaderBox = (props) => {
  return (
    <div className="header-box">
      <h1 className="title">2048</h1>
      <ScoreBox score={props.score} label="SCORE">
      {
        props.recentAddedScores.map((score) =>
          <div className="addition-score" key={score.id}
            onAnimationEnd={(e) => props.onAnimationEnd(score.id)}
          >+{score.score}</div>
        )
      }
      </ScoreBox>
      <ScoreBox score={props.bestScore} label="BEST" />
      <div className="desc-txt">
        <span className="bold">Play 2048 Game Online</span><br/>
        Join the numbers and get to the <span className="bold">2048 tile!</span>
      </div>
      <button className="new-game-btn" onClick={props.startNewGame}>New Game</button>
    </div>
  );
};

HeaderBox.propTypes = {
  recentAddedScores: PropTypes.array.isRequired,
  bestScore: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  onAnimationEnd: PropTypes.func.isRequired,
  startNewGame: PropTypes.func.isRequired
};


const mapStateToProps = ({scores}) => scores;

const mapDispatchToProps = (dispatch) => {
  return {
    onAnimationEnd: id => dispatch(cleanRecentAddedScore(id)),
    startNewGame: () => dispatch(startNewGame())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderBox);
