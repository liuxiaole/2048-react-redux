import * as ActionTypes from './action-types';

import { v4 } from 'node-uuid';

export const addScore = (score) => {
  return {
    type: ActionTypes.ADD_SCORE,
    id: v4(),
    score
  };
};

export const cleanRecentAddedScore = (id) => {
  return {
    type: ActionTypes.CLEAN_RECENT_ADDED_SCORE,
    id
  };
};

export const updateBestScore = (score) => (dispatch, getState) => {
  let { scores: { bestScore }} = getState();
  bestScore = Math.max(bestScore, score);
  localStorage.setItem('bestScore', bestScore);

  dispatch({
    type: ActionTypes.UPDATE_BEST_SCORE,
    bestScore
  });
};
