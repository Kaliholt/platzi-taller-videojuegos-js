const canvas = document.querySelector('#game');
const game = canvas.getContext('2d'); 
//Botones de movimiento
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
window.addEventListener('keydown', moveById);
// btnUp.addEventListener('click', moveUp);
// btnLeft.addEventListener('click', moveLeft);
// btnRight.addEventListener('click', moveRight);
// btnDown.addEventListener('click', moveDown);


const playerPosition = {
    x: undefined,
    y: undefined
}
let i = 0;
let canvasSize; 
let elementsSize;
let allowedSpaces = [];
let giftLocation = {};

function startGame() {
    let map;
    if(win()) {
        if(i < 2) {
            map = maps[++i];
            console.log('i: ' + i);
        } else {
            i = 0;
            map = maps[i];
            console.log('i: ' + i);
        }
    } else {
        map = maps[i];
        console.log('i: ' + i);
    }
    const mapRows = map.trim().split('\n');
    const mapColumns = mapRows.map(e => e.trim().split(''))
    
    game.font = (elementsSize - 5) + 'px Quicksand';
    game.textAlign = 'end';

    game.clearRect(0,0,canvasSize, canvasSize);

    setAllowedPosition(mapColumns);

    setElementsInMap(mapColumns);

    movePlayer();

    /*game.fillStyle = 'rgba(0, 0, 200, 1.0)';
    game.fillRect(0,0,100,100);

    game.clearRect(25,25,50,50);

    game.fillStyle = 'red';
    game.font = '25px Arial';
    game.fillText('Hola', 100, 100);

    game.strokeRect(0,0,100,100);
    
    game.fillStyle = 'rgba(0,220,0)';
    game.beginPath();
    game.lineTo(150, 75);
    game.lineTo(175,100);
    game.lineTo(175,50);
    game.lineTo(150, 25);
    game.lineTo(100, 75);
    game.fill();
    */
}

function setCanvasSize() {

    canvasSize = ((window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight) * 0.8).toFixed(100);

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', (Number(canvasSize) + 20));

    elementsSize = canvasSize / 10;

    startGame();
}

function movePlayer() {
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function setAllowedPosition(mapColumns) {
    if(allowedSpaces.length > 0) {
        return;
    }

    mapColumns.forEach((row, rowI) => row.forEach((column, columnI) => {
        const posX = elementsSize * (columnI + 1);
        const posY = elementsSize * (rowI + 1);
        if(column !== 'X' && !playerPosition.x && !playerPosition.y) {
            allowedSpaces.push({
                x: posX,
                y: posY
            });
            if(column === 'I') {
                giftLocation['x'] = posX;
                giftLocation['y'] = posY;
            }
        }
    }));
}

function setElementsInMap(mapColumns) {
    mapColumns.forEach((row, rowI) => row.forEach((column, columnI) => {
        const posX = elementsSize * (columnI + 1);
        const posY = elementsSize * (rowI + 1);
        if(column === 'O' && !playerPosition.x && !playerPosition.y) {
            playerPosition.x = posX; 
            playerPosition.y = posY;
        }
        game.fillText(emojis[column], posX, posY);
    }));
}

/**
 ** Description: Analiza la tecla que fue presionada por el usuario y llama a la función encargada
 * @param {*} event 
 */
function moveById(event) {
    switch(event.key) {
        case 'ArrowUp': 
            if(Math.round(playerPosition.y) > Math.round(elementsSize)) {
                playerPosition.y -= elementsSize; 
                startGame(); 
                statusMovement();
            }
            break;
        case 'ArrowLeft': 
            if(Math.round(playerPosition.x) > Math.round(elementsSize)) {
                playerPosition.x -= elementsSize; 
                startGame();
                statusMovement();
            }
            break;
        case 'ArrowRight': 
            if(playerPosition.x < canvasSize) {
                playerPosition.x += elementsSize; 
                startGame();
                statusMovement();
            }
            break;
        case 'ArrowDown': 
            if(playerPosition.y < canvasSize) {
                playerPosition.y += elementsSize; 
                startGame();
                statusMovement();
            }
            break;
    }
}

/**
 ** Description: Analiza si el movimiento esta permitido o no, realizando una serie de acciones a partir de ello
 */
function statusMovement() {

    const x = Math.round(playerPosition.x);
    const y = Math.round(playerPosition.y);

    const movementAllowed = allowedSpaces.some(space => Math.round(space.x) === x && Math.round(space.y) === y);

    console.log('Movement Allowed: ' + movementAllowed);

    const ClearX = playerPosition.x - elementsSize;
    const ClearY = playerPosition.y - elementsSize;

    if(!movementAllowed) {
        game.clearRect(ClearX - 15, ClearY + 10, elementsSize + 7, elementsSize);
        game.fillText(emojis['BOMB_COLLISION'], playerPosition.x - 15, playerPosition.y + 2);
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        startGame();
    } 

}
function win() {
    const x = Math.floor(playerPosition.x);
    const y = Math.floor(playerPosition.y);
    let isWon = x === Math.floor(giftLocation.x) && y === Math.floor(giftLocation.y);
    if(isWon) {
        console.log('Sube de nivel');
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        allowedSpaces = [];
        giftLocation = {};
    }
    return isWon;
}

const hour = document.querySelector('.information__hour');

const fecha = new Date();
const h = fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();

hour.innerText = h;
