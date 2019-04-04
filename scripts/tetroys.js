const fps = 60;
const tickRatio = 4;
const fpsTopCanvas = 18;
const bgcolor = '#b3ff47';

const rowsNumber = 20;
const colsNumber = 10;


var canvaWidth = 200;
var canvaHeight = 400;
var blockSizeWidth = canvaWidth / colsNumber;
var blockSizeHeight = canvaHeight / rowsNumber;

var actualPiece;
var tetrisMatrix = [];
var currentX, currentY;
var pieceSize;
var gameOver = false;
var totalScore = 0;
const pointToClearLine = 1;
var paused = false;
var holdUpControl = false;

var tickLoopId;
var drawLoopBoardId;
var drawLoopTopId;
var drawLoopSidesId;

var mainCanvas = document.getElementById("main");
var ctxMain = mainCanvas.getContext("2d");

var topCanvas = document.getElementById("topcanvas");
var topCTX = topCanvas.getContext("2d");

var rightCanvas = document.getElementById("rightcanvas");
var ctxRightCanvas = rightCanvas.getContext('2d');

var leftCanvas = document.getElementById("leftcanvas");
var ctxLeftCanvas = leftCanvas.getContext('2d');

window.addEventListener("keydown", gameInput, false);

function gameInput(e) {
  if (e.keyCode == 38) { // up key
    e.preventDefault();
    var rotShape = rotate();
    if (valid(0, 0, rotShape) && !paused) {
      blockRot.play();
      actualPiece = rotShape;
    }
  }

  if (e.keyCode == 39) { // right key
    e.preventDefault();
    if (valid(1)) {
      currentX++;
    }
  }

  if (e.keyCode == 37) { // left key
    e.preventDefault();
    if (valid(-1)) {
      currentX--;
    }
  }

  if (e.keyCode == 40) { // down key
    e.preventDefault();
    if (valid(0, 1)) {
      currentY++;
    }
  }

  if (e.keyCode == 32) { // spacebar
    e.preventDefault();
    killTetramine();
  }

  if (e.keyCode == 13) { // reset 'r'
    newGame();
  }

  if (e.keyCode == 27) { // pause 'esc'
    pauseGame();
  }
}

var pieces = [
  [1, 1, 1, 1], //Hero
  [2, 2, 2,
    2],//Orange Ricky
  [3, 3, 3,//Blue Ricky
    0, 0, 3],
  [4, 4, 4,//Teewee
    0, 4, 0],
  [0, 5, 5,//Rhode Island Z
    0, 5, 5],
  [0, 6, 6,//SmashBoy
    6, 6],
  [7, 7, 0,//Cleveland Z
    0, 7, 7]];

function pauseGame() {
  if (paused && !gameOver) {
    backgroundMusic.volume(1);
    holdUp();
    paused = false;
  }
  else if (!gameOver) {
    backgroundMusic.volume(0.2);
    holdUp("P A U S E D");
    paused = true;
  }
}

function resetScore() {
  totalScore = 0;
  burro.px = 885;
}

function createPiece() {

  var randomShape = Math.floor(Math.random() * pieces.length)

  if (randomShape == 0) {
    pieceSize = 4;
  } else {
    pieceSize = 3;
  }

  var counter = -pieceSize;
  actualPiece = [];
  for (i = 0; i < pieceSize; i++) {
    actualPiece[i] = [];
    for (j = 0; j < pieceSize; j++) {
      if (counter < pieces[randomShape].length && i > 0) {
        actualPiece[i][j] = pieces[randomShape][counter];
      } else {
        actualPiece[i][j] = 0;
      }
      counter++;
    }
  }

  currentX = 3;
  currentY = -1;
}

function rotate() {

  shapeString = actualPiece.toString();
  boxString = [[0, 0, 0], [0, 5, 5], [0, 5, 5]].toString();

  if (shapeString == boxString) {
    return actualPiece;
  }
  var rotShape = [];
  for (i = 0; i < pieceSize; ++i) {
    rotShape[i] = [];
    for (j = 0; j < pieceSize; ++j) {
      rotShape[i][j] = actualPiece[pieceSize - j - 1][i];
    }
  }

  return rotShape;
}

function initialize() {
  for (i = 0; i < rowsNumber; i++) {
    tetrisMatrix[i] = [];
    for (j = 0; j < colsNumber; j++) {
      tetrisMatrix[i][j] = 0;
    }
  }
}

function drawSides() {
  if (!paused) {

    ctxRightCanvas.fillStyle = bgcolor;
    ctxRightCanvas.fillRect(0, 0, rightCanvas.width, rightCanvas.height);

    ctxLeftCanvas.fillStyle = bgcolor;
    ctxLeftCanvas.fillRect(0, 0, leftCanvas.width, leftCanvas.height);

    ctxRightCanvas.drawImage(rightPanel, 0, 0, 300, 400);
    ctxLeftCanvas.drawImage(leftPanel, 0, 0, 300, 400);

    var rightPanelMid = { x: rightCanvas.width / 2, y: rightCanvas.height / 2 };
    var scoreDisplayMid = { x: scoreDisplay.width / 2, y: scoreDisplay.height / 2 };

    ctxRightCanvas.drawImage(scoreDisplay, rightPanelMid.x - scoreDisplayMid.x, rightPanelMid.y - scoreDisplayMid.y);

    ctxRightCanvas.fillStyle = "red";
    ctxRightCanvas.font = "30px DS-DIGI";
    ctxRightCanvas.textAlign = "center";
    ctxRightCanvas.fillText(totalScore, rightPanelMid.x, (rightPanelMid.y + 10));

    var leftPanelMid = { x: leftCanvas.width / 2, y: leftCanvas.height / 2 };
    var nextPieceMid = { x: nextPieceDisplay.width / 2, y: nextPieceDisplay.height / 2 };

    ctxLeftCanvas.drawImage(nextPieceDisplay, (leftPanelMid.x) - nextPieceMid.x, (leftPanelMid.y) - nextPieceMid.y);
  }
}

function drawTop() {
  if (!paused) {
    topCTX.clearRect(0, 0, topCanvas.width, topCanvas.height);
    topCTX.drawImage(background, 0, 0);
    burro.draw(topCTX);
    if (burro.px > 440)
      topCTX.drawImage(trashCharge, burro.px - burro.corte_width, burro.py - burro.corte_height / 6);
    topCTX.drawImage(trash, 0, 0);
    burro.update();
  }
}

function drawBoard() {
  if (!paused) {

    ctxMain.clearRect(0, 0, canvaWidth, canvaHeight);

    for (var x = 0; x < colsNumber; ++x) {
      for (var y = 0; y < rowsNumber; ++y) {
        if (tetrisMatrix[y][x]) {
          ctxMain.drawImage(tiles[tetrisMatrix[y][x] - 1], blockSizeWidth * x, blockSizeHeight * y, blockSizeWidth - 1, blockSizeHeight - 1);
        }
        else {
          ctxMain.lineWidth = 4;
          ctxMain.fillStyle = bgcolor;
          ctxMain.fillRect(blockSizeWidth * x + 1, blockSizeHeight * y + 1, blockSizeWidth + 1, blockSizeHeight + 1);
        }
      }
    }

    for (var y = 0; y < pieceSize; ++y) {
      for (var x = 0; x < pieceSize; ++x) {
        if (actualPiece[y][x]) {
          ctxMain.drawImage(tiles[actualPiece[y][x] - 1], blockSizeWidth * (x + currentX), blockSizeHeight * (y + currentY), blockSizeWidth - 1, blockSizeHeight - 1);
        }
      }
    }

    ctxMain.drawImage(ponte, 0, -1, 200, 24);
  }
}


function tick() {
  if (!paused) {
    if (valid(0, 1)) {
      currentY++;
    } else {
      updateMatrix();
      checkAndClearLine();
      if (gameOver) {
        backgroundMusic.stop();
        over.play();
        clearInterval(tickLoopId);
        clearInterval(tickLoopId);
        clearInterval(drawLoopBoardId);
        clearInterval(drawLoopTopId);
        clearInterval(drawLoopSidesId);
        holdUp('Y O U   L O S E! <br> T O T A L   S C O R E: ' + totalScore + '<br> PRESS ENTER TO TRY AGAIN');
        return;
      }
      createPiece();
      slowHit.play();
    }
  }
}

function checkAndClearLine() {

  for (var y = rowsNumber - 1; y >= 0; --y) {
    var clearLine = true;
    for (var x = 0; x < colsNumber; ++x) {
      if (!tetrisMatrix[y][x]) {
        clearLine = false;
        break;
      }
    }

    if (clearLine) {
      for (var i = y; i > 0; --i) {
        for (var j = 0; j < colsNumber; ++j) {
          tetrisMatrix[i][j] = tetrisMatrix[i - 1][j];
        }
      }
      y++;
      totalScore += pointToClearLine;
      lineClean.play();
    }
  }
}

function updateMatrix() {
  for (var y = 0; y < pieceSize; ++y) {
    for (var x = 0; x < pieceSize; ++x) {
      if (actualPiece[y][x]) {
        tetrisMatrix[currentY + y][currentX + x] = actualPiece[y][x]
      }
    }
  }
}

function valid(offsetX, offsetY, newCurrent) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  offsetX = currentX + offsetX;
  offsetY = currentY + offsetY;
  newCurrent = newCurrent || actualPiece;

  for (var y = 0; y < pieceSize; ++y) {
    for (var x = 0; x < pieceSize; ++x) {
      if (newCurrent[y][x]) {
        if (typeof tetrisMatrix[y + offsetY] == 'undefined'
          || typeof tetrisMatrix[y + offsetY][x + offsetX] == 'undefined'
          || tetrisMatrix[y + offsetY][x + offsetX]
          || x + offsetX < 0
          || y + offsetY >= rowsNumber
          || x + offsetX >= colsNumber) {
          if ((offsetY == 0 || offsetY == 1) && (offsetX >= 0 && offsetX < 11 - pieceSize)) {
            gameOver = true;
          }
          return false;
        }
      }
    }
  }
  return true;
}

function killTetramine() {
  if (!paused) {
    for (var y = pieceSize - 1; y >= 0; --y) {
      for (var x = pieceSize - 1; x >= 0; --x) {
        if (actualPiece[y][x]) {
          for (var offsetY = currentY; offsetY < rowsNumber; ++offsetY) {

            if (valid(0, 1)) {
              currentY++;
            }
          }
        }
      }
    }

    lineDrop.play();
  }
}

function holdUp(msg = '') {

  if (!holdUpControl) {
    document.getElementById("pauseText").innerHTML = '<br><br><br><br>' + msg;
    document.getElementById("pauseText").setAttribute("class", "front-Text");
    document.getElementById("pauseBack").setAttribute("class", "front-Fundo");
    holdUpControl = true;
  }
  else {
    document.getElementById("pauseText").innerHTML = msg;
    document.getElementById("pauseText").setAttribute("class", "");
    document.getElementById("pauseBack").setAttribute("class", "");
    holdUpControl = false;
  }

}

function newGame() {
  if (!paused) {
    for (var y = 0; y < rowsNumber; ++y) {
      for (var x = 0; x < colsNumber; ++x) {
        tetrisMatrix[y][x] = 0;
      }
    }
    backgroundMusic.play();
    gameOver = false;
    resetScore();
    clearInterval(tickLoopId);
    clearInterval(drawLoopBoardId);
    clearInterval(drawLoopTopId);
    clearInterval(drawLoopSidesId);
    tickLoopId = setInterval(tick, 1000 / tickRatio);
    drawLoopBoardId = setInterval(drawBoard, 1000 / fps);
    drawLoopTopId = setInterval(drawTop, (1000 / fps) * 3);
    drawLoopSidesId = setInterval(drawSides, (1000 / fps) * 3);
    if (holdUpControl)
      holdUp();
    createPiece();
  }
}

function startGame() {

  backgroundMusic.play();
  backgroundMusic.som.onended = () => backgroundMusic.play();

  initialize();
  createPiece();
  drawBoard();

  tickLoopId = setInterval(tick, 1000 / tickRatio);
  drawLoopBoardId = setInterval(drawBoard, 1000 / fps);
  drawLoopTopId = setInterval(drawTop, (1000 / fps) * 3);
  drawLoopSidesId = setInterval(drawSides, (1000 / fps) * 3);
}

startGame();