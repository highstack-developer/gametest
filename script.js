const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

// Load the custom snake icon
const snakeIcon = new Image();
snakeIcon.src = "Highstack%20Needle.png"; // Make sure this path matches where the image is stored

// Snake settings
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
let score = 0;
let level = 1;
let speed = 200;  // Initial speed
const levels = [200, 150, 100, 50, 25];  // Speed increases per level

// Draw snake and food
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake using the custom icon
    snake.forEach(segment => {
        ctx.drawImage(snakeIcon, segment.x, segment.y, 20, 20);
    });
    
    // Draw food
    ctx.fillStyle = "#FBC31A";
    ctx.fillRect(food.x, food.y, 20, 20);
}

// Move snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x * 20, y: snake[0].y + direction.y * 20 };
    
    // Check for collisions with walls
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver();
        return;
    }

    // Check for collisions with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Add new head
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        if (score % 5 === 0) {
            levelUp();
        }
        food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
}

// Change level
function levelUp() {
    if (level < 5) {
        level++;
        document.getElementById("level").textContent = "Level: " + level;
        speed = levels[level - 1];
    }
}

// Game over
function gameOver() {
    alert("Game Over! Final Score: " + score);
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    level = 1;
    speed = 200;
    document.getElementById("level").textContent = "Level: 1";
}

// Update game state
function update() {
    if (direction.x !== 0 || direction.y !== 0) {
        moveSnake();
    }
    draw();
}

// Keyboard controls
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Main game loop
function gameLoop() {
    setTimeout(() => {
        update();
        gameLoop();
    }, speed);
}

// Start the game
snakeIcon.onload = () => {
    gameLoop();
};
