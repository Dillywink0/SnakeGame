const speed = 110; // Speed of the game

let moveMade = false; // Flag to track if a move has been made
const fieldSize = 10; // Size of the game field
const grassChar = ".", snakeChar = "S", foodChar = "F"; // Characters representing grass, snake, and food
const grassCol = "black", snakeCol = "lime", foodCol = "red"; // Colors for rendering elements
let field = initiateField(fieldSize); // Initialize the game field
let snake = ["02", "03", "04", "14"]; // Initial positions of the snake
let xDir = 1, yDir = 0; // Initial direction of the snake (1 = up, -1 = down // 1 = left, -1 = right)
let snakeLength = 4; // Initial length of the snake
let score = 0; // Player's score
let dead = false; // Flag to track if the snake is dead
let frame = 0; // Frame counter for game loop

// Timer variables
let timer = 60; // Initial timer value in seconds

//prepare canvas
let canvas = document.querySelector("canvas");
let pixelSize = 15;
canvas.width = pixelSize * fieldSize;
canvas.height = pixelSize * fieldSize;
let c = canvas.getContext("2d");

// Start countdown timer
let countdownInterval = setInterval(countdown, 1000);

// Function to countdown timer
function countdown() {
    timer--; // Decrease timer by 1 second
    if (timer <= 0) {
        clearInterval(countdownInterval); // Stop the countdown when timer reaches 0
        console.log("Game Over!");
        return;
    }
}

// Start game loop
setInterval(doNextFrame, speed);

// Function to execute in each frame
function doNextFrame() {
    frame++; // Increment frame counter
    if (checkDead() === false) { // Check if the snake is not dead
        moveMade = false; // Reset move flag
        getInput(); // Get user input
        console.log("xdir: " + xDir +"  ydir: "+ yDir);
        moveSnake(); // Move the snake
        genField(); // Generate the game field
        placeFood(); // Place food on the field if needed
        dispField(); // Display the game field
        document.querySelector("#score").textContent = snake.length; // Update score display
        if (checkDead() === true) { // Check if the snake is dead after moving
            console.log("u ded"); // Log that the snake is dead
        }
    }
}

// Function to place food on the field
function placeFood() {
    let foodx, foody = 0;
    let noFood = true;
    for (let i = 0; i < field.length; i++) {
        if (field[i].includes(foodChar) === true) {
            noFood = false;
        }
    }
    if (noFood === true) {
        do {
            foodx = Math.round(Math.random() * fieldSize - 1); 
            foody = Math.round(Math.random() * fieldSize - 1); 
        } while (field[foodx][foody] !== grassChar)
        field[foodx][foody] = foodChar;
    }
}

// Function to check if the snake is dead
function checkDead () {
    for (let i = 0; i < snake.length; i++) {
        for (let j = 0; j < snake.length; j++) {
            if (snake[i] === snake[j] && i !== j) {
                return true;
            }
        }
    }
    return false;
}

// Function to get user input
function getInput() {
    onkeydown = function (event) {
        if (moveMade === false) {
            switch (event.keyCode) {
                case 37:
                if (xDir !== 1) {
                    xDir = -1;
                    yDir = 0;
                }
                break;
                case 38:
                if (yDir !== 1) {
                    xDir = 0;
                    yDir = -1;
                }       
                break;
                case 39:
                if (xDir !== - 1) {
                    xDir = 1;
                    yDir = 0;
                }
                break;
                case 40:
                if (yDir !== -1) {
                    xDir = 0;
                    yDir = 1;
                }
                break;
            }
        }
        moveMade = true;
        
    };
}

// Function to move the snake
function moveSnake() {
    let headxy = snake[snake.length - 1];
    let heady = Number(headxy[1]), headx = Number(headxy[0]);
    if (headx + xDir < fieldSize && headx + xDir >= 0) {
        headx += xDir;
    } else if (headx + xDir < 0) {
        headx = fieldSize - 1;
    } else if (headx + xDir >= fieldSize) {
        headx = 0;
    }
    if (heady + yDir < fieldSize && heady + yDir >= 0) {
        heady += yDir;
    } else if (heady + yDir < 0) {
        heady = fieldSize - 1;
    } else if (heady + yDir >= fieldSize) {
        heady = 0
    }
    if (field[headx][heady] === foodChar) {
        snakeLength += 1;
    }
    headxy = headx.toString() + heady.toString();
    console.log("headxy: " + headxy +" heady: "+heady+" headx: "+headx);
    snake.push(headxy);
    if (snake.length > snakeLength) {
        snake.shift();
    } 
}

// Function to initialize the game field
function initiateField() {
    let field = [];
    for (let i = 0; i < fieldSize; i++) {
        field[i] = [];
        for (let j = 0; j < fieldSize; j++) {
            field[i][j] = grassChar; // Fill the field with grass characters initially
        }
    }
    return field;
}

// Function to generate the game field
function genField () {
    for (let celly = 0; celly < fieldSize; celly++) {
        for (let cellx = 0; cellx < fieldSize; cellx++) {
            if (snake.includes((cellx.toString() + celly.toString()))) {
                field[cellx][celly] = snakeChar; // Mark snake cells on the field
            } else {
                if (field[cellx][celly] !== foodChar) {
                    field[cellx][celly] = grassChar; // Reset non-snake cells to grass
                }
            }
        }
    }
}

// Function to display the game field
function dispField() {
    // Clear canvas
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw canvas
    for (let celly = 0; celly < fieldSize; celly++) {
        for (let cellx = 0; cellx < fieldSize; cellx++) {
            if (field[cellx][celly] === snakeChar) {
                c.fillStyle = snakeCol; // Set color for snake cells
            } else if (field[cellx][celly] === foodChar) {
                c.fillStyle = foodCol; // Set color for food cells
            } else if (field[cellx][celly] === grassChar) {
                c.fillStyle = grassCol; // Set color for grass cells
            }
            c.fillRect(cellx * pixelSize, celly * pixelSize, pixelSize, pixelSize); // Draw filled rectangle
        }
    }
    
    // Log field to console (separately for readability)
    let fieldStr = "";
    for (let celly = 0; celly < fieldSize; celly++) {
        for (let cellx = 0; cellx < fieldSize; cellx++) {
            fieldStr += field[cellx][celly];
        }
        fieldStr += "\n";
    }
    console.clear();
    console.log(fieldStr);
}

// Function to countdown timer
function countdown() {
    timer--; // Decrease timer by 1 second
    if (timer <= 0) {
        clearInterval(countdownInterval); // Stop the countdown when timer reaches 0
        console.log("Game Over!");
        return;
    }
    // Update timer element with the current timer value
    document.querySelector("#timer").textContent = `Time: ${timer}`;
}
function checkDead() {
    for (let i = 0; i < snake.length; i++) {
        for (let j = 0; j < snake.length; j++) {
            if (snake[i] === snake[j] && i !== j) {
                // Snake is dead, show popup message with Play Again button
                let playAgain = confirm("Snake dead! Play again?");
                if (playAgain) {
                    resetGame(); // Reset the game if the user chooses to play again
                }
                return true;
            }
        }
    }
    return false;
}

function resetGame() {
    // Reset game state
    snake = ["02", "03", "04", "14"];
    xDir = 1;
    yDir = 0;
    snakeLength = 4;
    timer = 60;
    // Start the game loop again
    countdownInterval = setInterval(countdown, 1000);
    setInterval(doNextFrame, speed);
}

// Function to create and style the "Play Again" button
function createPlayAgainButton() {
    let button = document.createElement("button");
    button.className = "play-again-button"; // Add CSS class to style the button
    button.textContent = "Play Again";
    button.onclick = function() {
        resetGame(); // Reset the game when the button is clicked
    };
    return button;
}

function doNextFrame() {
    frame++; // Increment frame counter
    if (timer <= 0 || checkDead()) { // Check if the timer has reached 0 or if the snake is dead
        clearInterval(countdownInterval); // Stop the countdown
        console.log("Game Over!");
        return;
    }

    moveMade = false; // Reset move flag
    getInput(); // Get user input
    console.log("xdir: " + xDir +"  ydir: "+ yDir);
    moveSnake(); // Move the snake
    genField(); // Generate the game field
    placeFood(); // Place food on the field if needed
    dispField(); // Display the game field
    document.querySelector("#score").textContent = snake.length; // Update score display
}