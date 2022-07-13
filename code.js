const playerFactory = (name, icon) => {
  return { name, icon }
}

const playerOne = playerFactory("Good", "X");
const playerTwo = playerFactory("Evil", "O");

const board = document.querySelector('.board')

function check() {
  let result = false;
  winStates.forEach(x => {
    const test = x.map(y => boardArray[y]);
    if (test.every(x => x === 'X')) {
      result = true;
    }
  })
  return result;
}

const gameBoard = (() => {
  const boardArray = ["O", "O", "", "O", "X", "", "X", "5", ""];
  const winStates = [[0, 4, 8], [2, 4, 6], [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
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
   * with the correponding contet from the boardArray. If it matches, then it ultimately gives true
   * Unfortunately it currently continues to loop through all subarrays, even if the first is correct. 
   */
  const checkVictory = () => {
    let result = false;
    winStates.forEach(x => {
      const test = x.map(y => boardArray[y]);
      if (test.every(x => x === 'X') ||
        test.every(x => x === 'O')) {
        result = true;
      }
    })
    return result;
  }
  const reRender = () => {
    while (board.lastElementChild) {
      board.removeChild(board.lastElementChild);
    }
    renderBoard();
  }
  const updateBoard = (idx, mark) => {
    boardArray[idx] = mark;
    reRender();
  }
  return { renderBoard, updateBoard, checkVictory };
})()
gameBoard.renderBoard();

const displayController = (() => {

})()