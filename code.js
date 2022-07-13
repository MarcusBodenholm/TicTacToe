const playerFactory = (name, icon) => {
  return { name, icon }
}

const playerOne = playerFactory("Good", "X");
const playerTwo = playerFactory("Evil", "O");

const board = document.querySelector('.board')

const gameBoard = (() => {
  const boardArray = ["", "", "3", "", "1", "", "", "5", "6"];
  const renderBoard = () => {
    boardArray.forEach((x, i) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.id = i;
      cell.innerHTML = x;
      board.appendChild(cell);
    })
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
  return { renderBoard, updateBoard };
})()
gameBoard.renderBoard();