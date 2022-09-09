const canvas = document.querySelector('#game');
const game = canvas.getContext('2d'); 
//Botones de movimiento
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
//Informacion de vidas y tiempo de juego
let informationTimeRecord = document.querySelector('.information__time-record');
const informationLives = document.querySelector('.information__lives');
const informationTime = document.querySelector('.information__time');

//Eventos
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
window.addEventListener('keydown', moveById);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);


//* Objeto que guarda en todo momento la posición del jugador
const playerPosition = {
    x: undefined,
    y: undefined
}
//* Obtiene y establece el último record hecho pro el jugador guardado en localStorage
informationTimeRecord.innerText = localStorage.getItem('record');
//* Array que guarda los espacios disponibles en el mapa actual para que el jugador se mueva
let allowedSpaces = [];
//* Objeto que guarda la posicion de la meta (regalo) del mapa actual
let giftLocation = {};
//* Vidas Iniciales
let lives = 3;
//* Nivel de mapa inicial
let level = 0;
//* Variable que contendrá el mapa a renderizar
let map;
//* Variable que guardará el tamaño del mapa
let canvasSize; 
//* Variable que guardará el tamañao que tomará cada uno de los elementos
let elementsSize;
//* Variable que establecerá el tiempo inicial en el que el usuario empieza a jugar
let timeStart;
//* Variable que medirá el tiempo que el jugador demora en completar el juego
let timeInterval;

/**
 ** Description: Inicia el juego y lo vuelve a cargar siempre que sea necesario
 */
function startGame() {

    setMap();

    setAllowedPositions(getElements());

    setElementsInMap(getElements());

    movePlayer();

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(() => showTime(), 100);
    }

    informationLives.innerText = emojis['HEART'].repeat(lives);

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

/**
 ** Description: Obtiene cada uno de los elementos que se mostrarán en el mapa
 * @returns Array Bidimensional
 */
function getElements(){
    game.clearRect(0,0,canvasSize, canvasSize);
    const mapRows = map.trim().split('\n');
    const mapColumns = mapRows.map(e => e.trim().split(''))
    
    game.font = (elementsSize - 5) + 'px Quicksand';
    game.textAlign = 'end';

    return mapColumns;
}
/**
 ** Description: Muestra el tiempo actual trascurrido de juego
 */
function showTime() {
    informationTime.innerText = Date.now() - timeStart;
}

/**
 ** Establece el tiempo record del jugador en pantalla y lo guarda a su vez en el localStorage del navegador para que se muestre siempre que se ingrese al juego
 */
function setTimeRecord() {
    clearInterval(timeInterval);
    const timePlayer = Number(informationTime.innerText);
    const timeRecord = Number(informationTimeRecord.innerText);

    if(!timeRecord || timeRecord > timePlayer) {
        informationTimeRecord.innerText = timePlayer;
        localStorage.setItem('record', timePlayer);
    }

    timeStart = 0;
}

/**
 ** Description: Establece el tamaño del mapa de juego y de cada uno de los elementos que lo conforman
 */
function setCanvasSize() {

    canvasSize = ((window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight) * 0.8).toFixed(100);

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', (Number(canvasSize) + 20));

    elementsSize = canvasSize / 10;

    startGame();
}

/**
 * Renderiza un nuestra la nueva ubicación del jugador al realizar un movimiento
 */
function movePlayer() {
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

/**
 ** Description: Establece cuales son las posiciones de permitidas para moverse y establece la ubicación de la meta (regalo). En caso de estar ya asignadas la función no realiza ninguna acción
 * @param {*} mapColumns Array Bidimensional
 */
function setAllowedPositions(mapColumns) {
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

/**
 ** Description: Coloca todos los elementos del mapa del juego y establece la posición inicial del jugador
 * @param {*} mapColumns 
 */
function setElementsInMap(mapColumns) {
    mapColumns.forEach((row, rowI) => row.forEach((column, columnI) => {
        const posX = elementsSize * (columnI + 1);
        const posY = elementsSize * (rowI + 1);

        // Con este condicional se establece la ubicación del regalo
        if(column === 'O' && !playerPosition.x && !playerPosition.y) {
            playerPosition.x = posX; 
            playerPosition.y = posY;
        }
        game.fillText(emojis[column], posX, posY);
    }));
}

/**
 ** Description: Analiza la tecla que fue presionada por el usuario
 * @param {*} event 
 */
function moveById(event) {
    switch(event.key) {
        case 'ArrowUp': moveUp(); break;
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowDown': moveDown(); break;
    }
}

/**
 ** Mueve al jugador una posición hacia arriba
 */
function moveUp() {
    if(Math.round(playerPosition.y) > Math.round(elementsSize)) {
        playerPosition.y -= elementsSize; 
        startGame(); 
        statusMovement();
    }
}

/**
 ** Mueve al jugador una posición hacia la izquierda
 */
function moveLeft() {
    if(Math.round(playerPosition.x) > Math.round(elementsSize)) {
        playerPosition.x -= elementsSize; 
        startGame();
        statusMovement();
    }
}

/**
 ** Mueve al jugador una posición hacia la derecha
 */
function moveRight() {
    if(playerPosition.x < canvasSize) {
        playerPosition.x += elementsSize; 
        startGame();
        statusMovement();
    }
}

/**
 ** Mueve al jugador una posición hacia abajo
 */
function moveDown() { 
    if(playerPosition.y < canvasSize) {
        playerPosition.y += elementsSize; 
        startGame();
        statusMovement();
    }
}

/**
 ** Description: Analiza si el movimiento esta permitido o no, realizando una serie de acciones a partir de ello
 */
function statusMovement() {

    const x = Math.round(playerPosition.x);
    const y = Math.round(playerPosition.y);

    const movementAllowed = allowedSpaces.some(space => Math.round(space.x) === x && Math.round(space.y) === y);

    if(!movementAllowed) {
        lives--;

        showCollision();
        resetValues();
        setTimeout(() => startGame(), 2000);
    }
}

/**
 ** Description: Muestra la colisión del jugador con una bomba
 */
function showCollision() {
    const ClearX = playerPosition.x - elementsSize;
    const ClearY = playerPosition.y - elementsSize;

    game.clearRect(ClearX - 9, ClearY + 11, elementsSize , elementsSize);
    game.fillText(emojis['BOMB_COLLISION'], playerPosition.x, playerPosition.y);
}     

/**
 ** Description: Determina si un jugador ha llegago al regalo en el mapa actual con éxito
 * @returns Boolean
 */
function levelWin() {
    const x = Math.floor(playerPosition.x);
    const y = Math.floor(playerPosition.y);
    let isWon = x === Math.floor(giftLocation.x) && y === Math.floor(giftLocation.y);

    if(isWon) {
        map = maps[level];
        resetValues();
    }
    return isWon;
}

/**
 ** Description: Establece el mapa de juego a mostrar
 */
function setMap() {
    if(levelWin()) {
        if(level < (maps.length - 1)){
            ++level;
        } else {
            level = 0;
            gameWin();
        }
    }
    map = maps[level];
}

/**
 ** Determina lo que pasa cuando el jugador finaliza el juego exitosamente
 */
function gameWin() {
    setTimeRecord();
}

/**
 ** Description: Restablece los valores predeterminados del juego
 */
function resetValues() {
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    allowedSpaces = [];
    giftLocation = {};

    if(lives === 0) {
        level = 0;
        lives = 3;
        clearInterval(timeInterval);
        timeStart = 0;
    }
}