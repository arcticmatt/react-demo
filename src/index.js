import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square"
      onClick={props.onClick}
      style={props.isWinner ? {backgroundColor: 'yellow'} : {}}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = this.props.winner;
    const index = winner ? winner.indexOf(i) : -1;
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinner={index !== -1}
      />);
  }

  render() {
    let rows = [0, 1, 2].map((i) => {
      let row = [null, null, null];
      for (let j = 0; j < 3; j++) {
        row[j] = this.renderSquare(i * 3 + j);
      }
      return (
        <div key={i} className="board-row">
          {row}
        </div>
      );
    });

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      asc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  flipMoves() {
    this.setState({
      asc: !this.state.asc,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.slice(0, this.state.stepNumber + 1).map((step, move) => {
      const desc = move ?
        'Move at (' + getMovePos(history[move - 1], step) + ')' :
        'Game start';
      const isBold = move === history.length - 1;
      return (<li key={move}>
        <a href='#' role='button' style={isBold ? {fontWeight: "bold"} : {}}
          onClick={() =>this.jumpTo(move)}>{desc}</a>
      </li>);
    })

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else {
      status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.asc ? moves : moves.reverse()}</ol>
        </div>
        <div>
          <button className="flip-button" onClick={() => this.flipMoves()}>
            Flip!
          </button>
        </div>
      </div>
    );
  }
}

// ========================================
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function getMovePos(oldBoard, newBoard) {
  // No length check
  for (let i = 0; i < newBoard.squares.length; i++) {
    let [o, n] = [oldBoard.squares[i], newBoard.squares[i]];
    if (o !== n) {
      return [Math.floor(i / 3) + 1, (i % 3) + 1];
    }
  }
  return null; // this shouldn't happen
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
