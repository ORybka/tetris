document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".main-container");
  let squares = Array.from(document.querySelectorAll(".main-container div"));
  const scoreDisplay = document.querySelector("#score");
  const levelDisplay = document.querySelector("#level");
  const startBtn = document.querySelector("#start-button");
  const closeBtn = document.querySelector("#close-button");
  const leftBtn = document.querySelector("#left-button");
  const rotateBtn = document.querySelector("#rotate-button");
  const rightBtn = document.querySelector("#right-button");
  const downBtn = document.querySelector("#down-button");
  const width = 10;
  let startGame = 0;
  let startCount = 0;
  let nextRandom = 0;
  let timerId;
  let time = 1000;
  let score = 0;
  let level = 1;
  let button = "Start/Pause";
  let buttonState = 0; // 0 = play , 1 = new game
  const colors = [
    "#660033",
    "#990099",
    "#6600cc",
    "#0059b3",
    "#00b386",
    "#39acac",
    "#8957c7",
  ];

  //Popup
  if (window.matchMedia("(min-width: 1024px)").matches) {
    setTimeout("document.querySelector('#overlay').style.display='block'", 1000);
  };

  function closePopup() {
    document.querySelector('#overlay').style.display='none';
  };

  closeBtn.addEventListener("click", closePopup);

  //Tetrominoes
  const jTetromino = [
    [1, width + 1, width * 2, width * 2 + 1],
    [0, width, width + 1, width + 2],
    [1, 2, width + 1, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 2],
  ];

  const sTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
    [1, 2, width, width + 1],
  ];

  const tTetromino = [
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const lTetromino = [
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width, width + 1, width + 2, width * 2],
  ];

  const zTetromino = [
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width * 2],
    [0, 1, width + 1, width + 2],
    [1, width, width + 1, width * 2],
  ];

  const theTetrominoes = [
    jTetromino,
    sTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
    lTetromino,
    zTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //draw the Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.background = colors[random];
    });
  }

  //undraw the Tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    } else if (e.keyCode === 13) {
      closePopup();
    }
  }
  document.addEventListener("keydown", control, false);

  leftBtn.addEventListener("click", moveLeft);
  rotateBtn.addEventListener("click", rotate);
  rightBtn.addEventListener("click", moveRight);
  downBtn.addEventListener("click", moveDown);

  //move down function
  function moveDown() {
    if (startGame >= 1) {
      undraw();
      currentPosition += width;
      draw();
      freeze();
    }
  }

  //freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //start a new Tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    if (startGame >= 1) {
      undraw();
      const isAtLeftEdge = current.some(
        (index) => (currentPosition + index) % width === 0
      );
      if (!isAtLeftEdge) currentPosition -= 1;
      if (
        current.some((index) =>
          squares[currentPosition + index].classList.contains("taken")
        )
      ) {
        currentPosition += 1;
      }
      draw();
    }
  }

  //move the Tetromino left, unless is at the edge or there is a blockage
  function moveRight() {
    if (startGame >= 1) {
      undraw();
      const isAtRightEdge = current.some(
        (index) => (currentPosition + index) % width === width - 1
      );
      if (!isAtRightEdge) currentPosition += 1;
      if (
        current.some((index) =>
          squares[currentPosition + index].classList.contains("taken")
        )
      ) {
        currentPosition -= 1;
      }
      draw();
    }
  }

  //rotate the Tetromino
  function rotate() {
    if (startGame >= 1) {
      const isAtLeftEdge = current.some(
        (index) => (currentPosition + index) % width === 0
      );
      const isAtRightEdge = current.some(
        (index) => (currentPosition + index) % width === width - 1
      );
  
      if (!(isAtLeftEdge | isAtRightEdge)) {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
          //if currentRotation value is greater that 4 than reset same to 0
          currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
      }
      draw();
    }
  }

  //show up-next Tetromino in mini-container display
  const displaySquares = document.querySelectorAll(".mini-container div");
  const displayWidth = 4;
  let displayIndex = 0;

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2, displayWidth * 2 + 1], //jTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //sTetromino
    [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], //lTetromino
    [0, 1, displayWidth + 1, displayWidth + 2] //zTetromino
  ];

  //display the shape in the mini-container display
  function displayShape() {
    //remove any trace of a tetromino from the entire container
    displaySquares.forEach((squares) => {
      squares.classList.remove("tetromino");
      squares.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  startBtn.addEventListener("click", () => {
    if (buttonState === 0) {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
        startCount++;
        startBtn.style.background = "radial-gradient(ellipse at center, rgba(73,155,234,1) 0%, rgba(57,172,172,1) 100%)";
        button = "Continue";
        startBtn.innerHTML = button;
        } else {
          startGame++;
          draw();
          timerId = setInterval(moveDown, time);
          startBtn.style.background = "";
          button = "Pause";
          startBtn.innerHTML = button;
          if (startCount < 1) {
          nextRandom = Math.floor(Math.random() * theTetrominoes.length);
          displayShape();
        }
      }
    } else {
      clearBoard();
    }
  });


  //add score and level
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        if (score % 50 === 0) {
          level++
          levelDisplay.innerHTML = level;
          time -= 100;
        }
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.background = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => container.appendChild(cell));
      }
    }
    clearInterval(timerId);
    timerId= setInterval(moveDown, time);
  }

  //game over
  function gameOver() {
    if (current.some((index) =>squares[currentPosition + index].classList.contains("taken"))) 
    {
      scoreDisplay.style.paddingTop = "2rem";
      document.querySelector('#gameover').style.display='inline';
      clearInterval(timerId);
      timerId = null;
      document.removeEventListener("keydown", control, false);
      button = "New Game";
      startBtn.innerHTML = button;
      startBtn.style.background = "radial-gradient(ellipse at center, rgba(230,0,54,1) 0%, rgba(189,0,44,1) 44%, rgba(143,0,33,1) 100%)";
      startBtn.style.marginTop = "4rem";
      buttonState = 1;
    }
  }

  function clearBoard() {
    for (let i = 0; i < 200; i++) {
      squares[i].classList.remove("tetramino", "taken");
      squares[i].style.background = "";
    }
    score = 0;
    scoreDisplay.innerHTML = score;
    level = 1;
    levelDisplay.innerHTML = level;
    scoreDisplay.style.paddingTop = "0";
    document.querySelector('#gameover').style.display='none';
    startCount = 0; 
    startGame = 1;
    button = "Start";
    startBtn.innerHTML = button;
    startBtn.style.background = "";
    startBtn.style.marginTop = "10rem";
    buttonState = 0;
    document.addEventListener("keydown", control, false);
    draw();
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    displayShape();
    time = 1000;
    timerId = setInterval(moveDown, time);
  }
});
