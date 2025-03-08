const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

// Загрузка изображений
const bird = new Image();
bird.src = "assets/bird.png";

const bg = new Image();
bg.src = "assets/background.png";

const pipeNorth = new Image();
pipeNorth.src = "assets/pipe.png";

const pipeSouth = new Image();
pipeSouth.src = "assets/pipe.png";

// Позиция птицы
let birdX = 50;
let birdY = 150;
let gravity = 1.5;
let velocity = 0;

// Препятствия
let pipes = [];
let gap = 100;
let pipeWidth = 40;
let pipeHeight = 320;

// Счет
let score = 0;

// Обработка нажатий
document.addEventListener("keydown", () => (velocity = -10));

// Отрисовка игры
function draw() {
    ctx.drawImage(bg, 0, 0);

    // Отрисовка птицы
    ctx.drawImage(bird, birdX, birdY);

    // Обновление позиции птицы
    velocity += gravity;
    birdY += velocity;

    // Генерация препятствий
    if (frames % 90 === 0) {
        let pipeY = Math.floor(Math.random() * pipeHeight) - pipeHeight;
        pipes.push({ x: canvas.width, y: pipeY });
    }

    // Отрисовка препятствий
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        ctx.drawImage(pipeNorth, pipe.x, pipe.y, pipeWidth, pipeHeight);
        ctx.drawImage(pipeSouth, pipe.x, pipe.y + pipeHeight + gap, pipeWidth, pipeHeight);

        pipe.x -= 2;

        // Проверка столкновений
        if (
            (birdX + bird.width >= pipe.x && birdX <= pipe.x + pipeWidth) &&
            (birdY <= pipe.y + pipeHeight || birdY + bird.height >= pipe.y + pipeHeight + gap)
        ) {
            location.reload(); // Перезагрузка игры при столкновении
        }

        // Увеличение счета
        if (pipe.x + pipeWidth === birdX) {
            score++;
        }
    }

    // Удаление пройденных препятствий
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

    // Отрисовка счета
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Счет: " + score, 10, 20);

    requestAnimationFrame(draw);
}

let frames = 0;
draw();

// Инициализация Telegram Web App
window.Telegram.WebApp.ready();

// Обработка нажатий
Telegram.WebApp.onEvent("viewportChanged", () => {
    canvas.width = Telegram.WebApp.viewportWidth;
    canvas.height = Telegram.WebApp.viewportHeight;
});

// Отправка счета в Telegram
function sendScore() {
    Telegram.WebApp.sendData(JSON.stringify({ score: score }));
}