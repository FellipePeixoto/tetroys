// sons
var blockRot = new sound('assets/sounds/block-rotate.mp3');
var lineDrop = new sound('assets/sounds/line-drop.mp3');
var lineClean = new sound('assets/sounds/line-remove.mp3');
var slowHit = new sound('assets/sounds/slow-hit.mp3');
var backgroundMusic = new sound('assets/sounds/mad_robots.mp3');
var over = new sound('assets/sounds/death.wav');

// cenario
var burro = new Sprite('assets/imgs/sprites/burro.png', 85, 104, 4, 885, 47.5);
var trashCharge = new Imagem('assets/imgs/props/trash_charge.png');
var ponte = new Imagem('assets/imgs/props/ponte.png');
var scoreDisplay = new Imagem('assets/imgs/panels/score.png');
var nextPieceDisplay = new Imagem('assets/imgs/panels/nextpiece.png');
var trash = new Imagem('assets/imgs/props/trash.png');
var background = new Imagem('assets/imgs/props/background.png');
var rightPanel = new Imagem('assets/imgs/props/right.png');
var leftPanel = new Imagem('assets/imgs/props/left.png');
const tilesNames = ['quad1.png', 'quad2.png', 'quad3.png', 'quad4.png', 'quad5.png', 'quad6.png', 'quad7.png'];
var tiles = [];
tiles.length = 7;
for (let i = 0; i < tiles.length; i++) {
    tiles[i] = new Image();
    tiles[i].src = "assets/imgs/tiles/" + tilesNames[i];
}