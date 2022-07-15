"use strict"


const players = (() => {
  const playerFactory = (name, icon, color) => {
    return { name, icon, color }
  }
  let one = playerFactory("Good", "X", "red");
  let two = playerFactory("Evil", "O", "blue");
  return { one, two, playerFactory }
})()


const gameBoard = (() => {
  const board = document.querySelector('.board')
  let boardArray = ["", "", "", "", "", "", "", "", ""];
  const winStates = [[0, 4, 8], [2, 4, 6], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
  // Renders the board 
  const renderBoard = () => {
    boardArray.forEach((x, i) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.id = i;
      cell.innerHTML = x;
      board.appendChild(cell);
    })
  }
  /**
   * Bit of a brute force method to check for victory
   * The method takes the winStates array defined above, and then replaces each subarray in sequence
   * with the correponding content from the boardArray. If it matches, then it breaks the loop and returns true
   */
  const checkVictory = () => {
    let result = false;
    for (const winState of winStates) {
      const test = winState.map(idx => boardArray[idx]);
      if (test.every(x => x === players.one.icon) ||
        test.every(x => x === players.two.icon)) {
        result = true;
        break;
      }
    }
    return result;
  }
  // Removes the board and calls for rendering it again.
  const reRender = () => {
    while (board.lastElementChild) {
      board.removeChild(board.lastElementChild);
    }
    renderBoard();
  }
  // Updates the corresponding spot on the board and the array with the player's mark. 
  const updateBoard = (idx, mark, color) => {
    boardArray[idx] = mark;
    const cell = document.getElementById(idx)
    cell.innerHTML = mark;
    cell.style.backgroundColor = color;
  }
  // Resets the array, and calls the rerender function.
  const resetBoard = () => {
    boardArray = boardArray.map(x => x = "");
    reRender();
  }
  return { renderBoard, updateBoard, checkVictory, resetBoard, board };
})()
gameBoard.renderBoard();


const gameController = (() => {
  let currentPlayer;
  let moves = 0;
  // allowPlay and togglePlay makes sure the game doesn't play until the players have received names and icons. 
  let allowPlay = false;
  const togglePlay = () => {
    allowPlay = allowPlay ? false : true;
    currentPlayer = players.one;
  }
  // Updates the currentPlayer so the logic marks correctly. 
  const updatePlayer = () => {
    currentPlayer = currentPlayer === players.one ? players.two : players.one;
  }
  const makeMove = (idx) => {
    // If allowPlay is false, it ends the function.
    if (!allowPlay) {
      return;
    }
    // Else it updates the gameBoard.
    gameBoard.updateBoard(idx, currentPlayer.icon, currentPlayer.color);
    moves += 1;
    // If the number of moves is greater than four, it checks for victory. No need to check otherwise since no legal victory is possible. 
    if (moves > 4) {
      victory();
    }
    // If there's no winner then the updatePlayer function fires, as if there's a draw or win then moves is reduced to 0. 
    if (moves > 0) {
      updatePlayer();
    }
  }
  const victory = () => {
    // First checks with the gameBoard if there's a victory.
    const isVictory = gameBoard.checkVictory();
    // If there's no victory and moves have reached 9, then a draw is called. 
    if (!isVictory && moves >= 9) {
      displayController.updateWinner("It's a draw. No one wins.")
    }
    // If there's a winner then a congratulation message is displayed using the displayController's updateWinner method.
    if (isVictory) {
      displayController.updateWinner(`Congratulations, ${currentPlayer.name} is victorious!`, currentPlayer);
    }
  }
  const resetGame = () => {
    //Resets the relevant properties and calles for a board reset.
    currentPlayer = players.one;
    moves = 0;
    gameBoard.resetBoard();
  }
  return { updatePlayer, makeMove, resetGame, togglePlay }
})()

const displayController = (() => {
  const announceWinner = document.querySelector('.announcement');
  const resultBlock = document.querySelector('.result');
  const resetButton = document.querySelector('.reset');
  const playerOneName = document.getElementById('playerOne')
  const playerTwoName = document.getElementById('playerTwo')
  const playerOneIcon = document.getElementById('playerOneIcon');
  const playerTwoIcon = document.getElementById('playerTwoIcon');
  const playerBlock = document.querySelector('.headerContainer');
  const selection = document.querySelector('.updatePlayers');
  resetButton.addEventListener('click', () => {
    toggleVisibility(resultBlock);
    // resultBlock.style.display = "none";
    announceWinner.innerHTML = "";
    gameController.resetGame();
    playerBlock.style.display = "flex"
    toggleVisibility(gameBoard.board);
  })
  const updateWinner = (text, player) => {
    gameController.togglePlay();
    toggleVisibility(resultBlock)
    // resultBlock.style.display = "flex"
    announceWinner.style.color = player.color;
    announceWinner.innerHTML = `${text}`;
  }
  const toggleVisibility = (el) => {
    if (el.classList.contains('hidden')) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }
  const updatePlayers = () => {
    if (playerOneName.value === playerTwoName.value ||
      playerOneIcon.value === playerTwoIcon.value) {
      alert('You can\'t have the same name or icon. Please select a different one')
      return;
    }
    players.one = players.playerFactory(playerOneName.value, playerOneIcon.value, "lightcoral")
    players.two = players.playerFactory(playerTwoName.value, playerTwoIcon.value, "#5dc5e7")
    toggleVisibility(gameBoard.board);
    gameController.togglePlay();
    playerBlock.style.display = 'none';
  }
  selection.addEventListener('click', updatePlayers);
  return { updateWinner }
})()

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('cell') &&
    e.target.innerHTML === "") {
    gameController.makeMove(e.target.id);
  }
})
