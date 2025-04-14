import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player"
import Log from "./components/Log";
import { INITIAL_GAME_BOARD, PLAYERS, WINNING_COMBINATIONS } from "./constants/globals";
import GameOver from "./components/GameOver";

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';

  if(gameTurns.length && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }

  return currentPlayer;
}

function deriveWinner(gameTurns, gameBoard, players) {
  let winner;
  
  if(gameTurns.length > 4) { // First winning combination could happen since fifth turn
    for(const winningCombination of WINNING_COMBINATIONS) {
      const firstSquareSymbol = gameBoard[winningCombination[0].row][winningCombination[0].column];
      const secondSquareSymbol = gameBoard[winningCombination[1].row][winningCombination[1].column];
      const thirdSquareSymbol = gameBoard[winningCombination[2].row][winningCombination[2].column];

      if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
        winner = players[firstSquareSymbol];
      }
    }
  }

  return winner;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map(innerArray => [...innerArray])]; // Deep copy due Array immutability

  for(const turn of gameTurns) {
      const { square, player } = turn;
      const { row, column } = square;

      gameBoard[row][column] = player;
  }

  return gameBoard;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameTurns, gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, columnIndex) { // Used to lift the state up (use state between components by passing from here to child components (activePlayer))
    setGameTurns(prevTurns => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [ { 
        square: { row: rowIndex, column: columnIndex }, 
        player: currentPlayer,
      }, ...prevTurns];

      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName={ PLAYERS.X } symbol="X" isActivePLayer={ activePlayer === 'X' } onChangeName={ handlePlayerNameChange }/>
          <Player initialName={ PLAYERS.O } symbol="O" isActivePLayer={ activePlayer === 'O' } onChangeName={ handlePlayerNameChange }/>
        </ol>
        { (winner || hasDraw) && <GameOver winner={ winner } onRestart={ handleRestart } /> }
        <GameBoard onSelectSquare={handleSelectSquare} board={ gameBoard } />
      </div>
      <Log turns={ gameTurns }/>
    </main>
  );
};

export default App
