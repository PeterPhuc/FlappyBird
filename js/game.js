const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.75;
canvas.height = window.innerHeight * 0.75;

const birdFrames = [
    "./images/bird/yellowbird-downflap.png",
    "./images/bird/yellowbird-midflap.png",
    "./images/bird/yellowbird-upflap.png",
].map((src) => {
    let img = new Image();
    img.src = src;
    return img;
});

let birdFrameIndex = 0,
    birdFrameCounter = 0;
const bgImages = {
    day: "./images/backgound/background-day.png",
    night:
        "./images/backgound/background-night.png",
};
let currentBg = "day",
    bgImg = new Image();
bgImg.src = bgImages[currentBg];

// document.getElementById("toggleTheme").addEventListener("click", () => {
//     currentBg = currentBg === "day" ? "night" : "day";
//     bgImg.src = bgImages[currentBg];
//     localStorage.setItem("theme", currentBg);
// });
// document.getElementById("toggleTheme").addEventListener("keyup", (event) => {
//     if (event.key === " " || event.key === "Enter") {
//         event.preventDefault(); // Chặn hành vi mặc định
//         event.stopPropagation(); // Ngăn sự kiện lan truyền
//     }
// });

// const savedTheme = localStorage.getItem("theme");
// if (savedTheme) {
//     currentBg = savedTheme;
//     bgImg.src = bgImages[currentBg];
// }

let bird = {
    x: 50,
    y: 150,
    width: 40,
    height: 30,
    gravity: 0.3,
    lift: -7,
    velocity: 0,
};
let pipes = [],
    score = 0,
    highScore = localStorage.getItem("highScore") || 0,
    gameRunning = false,
    bgX = 0,
    frames = 0;

document.addEventListener("keydown", () => {
    if (gameRunning) bird.velocity = bird.lift;
});

function drawBird() {
    ctx.drawImage(
        birdFrames[birdFrameIndex],
        bird.x,
        bird.y,
        bird.width,
        bird.height
    );
}
function drawBackground() {
    ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);
}
function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    });
}
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillText("High Score: " + highScore, 10, 60);
}

function updateGame() {
    bird.velocity += bird.gravity;
    bird.velocity *= 0.92;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
        // gameOver();
    }
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    pipes.forEach((pipe) => {
        pipe.x -= 1.2;
        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
        }
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        )
            gameOver();
    });

    if (frames % 270 === 0) {
        let gap = 150,
            top = Math.random() * (canvas.height - gap - 50) + 50;
        pipes.push({
            x: canvas.width,
            width: 50,
            top: top,
            bottom: top + gap,
        });
    }

    bgX -= 0.5;
    if (bgX <= -canvas.width) bgX = 0;

    birdFrameCounter++;
    if (birdFrameCounter % 8 === 0)
        birdFrameIndex = (birdFrameIndex + 1) % birdFrames.length;
    frames++;
}

function gameOver() {
    gameRunning = false;
    document.getElementById("gameOverScreen").classList.remove("hidden");
    document.getElementById("scoreText").innerText = `Score: ${score}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById(
            "scoreText"
        ).innerText = `Score: ${score} - New High Score!!!`;
    }
}

function restartGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frames = 0;
    gameRunning = true;
    document.getElementById("gameOverScreen").classList.add("hidden");
    gameLoop();
}

function startGame() {
    document.getElementById("startScreen").classList.add("hidden");
    gameRunning = true;
    gameLoop();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBird();
    drawPipes();
    drawScore();
    if (gameRunning) {
        updateGame();
        requestAnimationFrame(gameLoop);
    }
}

document.getElementById("startBtn").addEventListener("click", startGame);
