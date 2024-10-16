const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600; // Updated width
canvas.height = 600; // Updated height

// Load the custom snake icon
const snakeIcon = new Image();
snakeIcon.src = "Highstack_Needle.png"; // Ensure this matches the uploaded file name

// Snake settings
let snake = [{ x: 300, y: 300 }]; // Adjusted initial position for new canvas size
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * 30) * 20, y: Math.floor(Math.random() * 30) * 20 }; // Updated food position calculation
let score = 0;
let level = 1;
let speed = 200;  
const levels = [200, 150, 100, 50, 25];

// Draw snake and food
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake using the custom icon rotated 90 degrees counterclockwise
    snake.forEach(segment => {
        ctx.save(); // Save the current state
        ctx.translate(segment.x + 20 / 2, segment.y + 20 / 2); // Move to the center of the segment
        ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise
        ctx.drawImage(snakeIcon, -20 / 2, -20 / 2, 20, 20); // Draw the image centered
        ctx.restore(); // Restore the original state
    });
    
    // Draw food with a black stripe in the middle
    ctx.fillStyle = "#FBC31A";
    ctx.fillRect(food.x, food.y, 20, 20);
    ctx.fillStyle = "black"; // Set color for the stripe
    ctx.fillRect(food.x, food.y + 8, 20, 4); // Draw the black stripe
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
        food = { x: Math.floor(Math.random() * 30) * 20, y: Math.floor(Math.random() * 30) * 20 };
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
    snake = [{ x: 300, y: 300 }]; // Reset to new position
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

// Start the game after the image is loaded
snakeIcon.onload = () => {
    gameLoop();
};

snakeIcon.onerror = () => {
    console.error("Failed to load the snake icon. Check the file name and path.");
};
