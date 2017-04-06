import React, { Component } from 'react';
import Tile from './Tile';
import './GameBoard.css';

export default class GameBoard extends Component {
  grids () {
    let size = this.props.size;
    let row = i =>
      new Array(size).fill().map((_, j) =>
        <div className="grid-cell" key={`grid-cell-${i * size + j}`}></div>
      );

    return new Array(size).fill().map((_, i) => row(i));
  }

  tiles () {
    return this.props.cells.reduce((tiles, row, i) =>
      row.reduce((tiles, cell, j) => {
        if (cell) {
          tiles.push({cell, row: i, col: j});
          if (cell.mergedItem) {
            tiles.push({cell: cell.mergedItem, row: i, col: j});
          }
        }
        return tiles;
      }, tiles)
    , [])
    .sort((a, b) => a.cell.uuid - b.cell.uuid)
    .map(tile => <Tile key={'tile-'+tile.cell.uuid} cell={tile.cell} col={tile.col} row={tile.row}></Tile>);
  }

  render () {
    return (
      <div className="game-board">
        <div className="title-box">
          <h1 className="title">2048</h1>
          <div className="score-box">
            <div className="score-label">SCORE</div>
            <div className="score-content">{this.props.score}</div>
            {
              this.props.additionScores.map((score, i) =>
                <div className="addition-score" key={score.key}
                  onAnimationEnd={(e) => this.props.onAdditionScoreAnimationEnd(e, score, i)}
                >+{score.score}</div>
              )
            }
          </div>
          <div className="score-box">
            <div className="score-label">BEST</div>
            <div className="score-content">{this.props.bestScore}</div>
          </div>
          <div className="desc-txt">
            <span className="bold">Play 2048 Game Online</span><br/>
            Join the numbers and get to the <span className="bold">2048 tile!</span>
          </div>
          <button className="new-game-btn" onClick={this.props.onNewGame}>New Game</button>
        </div>
        <div className="game-box">
          <div className="grid-container">{this.grids()}</div>
          <div className="tile-container">{this.tiles()}</div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
