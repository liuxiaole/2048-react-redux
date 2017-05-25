import * as ActionTypes from '../actions/action-types';
import { combineReducers } from 'redux';


const score = (state=0, action) => {
  switch(action.type) {
    case ActionTypes.START_NEW_GAME:
      return 0;
    case ActionTypes.ADD_SCORE:
      return state + action.score;
    default:
      return state;
  }
};

const recentAddedScores = (state=[], action) => {
  switch(action.type) {
    case ActionTypes.START_NEW_GAME:
      return [];

    case ActionTypes.ADD_SCORE:
      return [...state, {score: action.score, id: action.id}];

    case ActionTypes.CLEAN_RECENT_ADDED_SCORE:
      return state.filter(score => score.id !== action.id);

    default:
      return state;
  }
};

const bestScore = (state=0, action) => {
  switch(action.type) {
    case ActionTypes.UPDATE_BEST_SCORE:
      return action.bestScore;
    default:
      return state;
  }
};

export default combineReducers({
  score, bestScore, recentAddedScores
});
