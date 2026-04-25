const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 50,
  y: 280,
  size: 40,
  yVel: 0,
  onGround: false
};

const gravity = 0.8;
const jumpForce = -14;
const obstacles = [];
let gameOver = false;
let score = 0;

function addObstacle() {
  // Рандомная высота и расстояние
  const height = 40 + Math.random() * 60;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: 20 + Math.random() * 18,
    height: height
  });
}

function resetGame() {
  obstacles.length = 0;
  player.y = 280;
  player.yVel = 0;
  score = 0;
  gameOver = false;
}

function drawPlayer() {
  ctx.fillStyle = '#18d9f7';
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawObstacles() {
  ctx.fillStyle = '#f71b1b';
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  });
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Счет: " + score, 10, 30);
}

function update() {
  if (gameOver) return;

  // Прыжки и гравитация
  player.yVel += gravity;
  player.y += player.yVel;
  if (player.y + player.size > canvas.height) {
    player.y = canvas.height - player.size;
    player.onGround = true;
    player.yVel = 0;
  } else {
    player.onGround = false;
  }

  // Обновляем препятствия
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= 6;
    // Коллизия
    if (
      player.x < obstacles[i].x + obstacles[i].width &&
      player.x + player.size > obstacles[i].x &&
      player.y < obstacles[i].y + obstacles[i].height &&
      player.y + player.size > obstacles[i].y
    ) {
      gameOver = true;
      setTimeout(() => {
        alert('Game Over! Ваш счет: ' + score);
        resetGame();
        requestAnimationFrame(loop);
      }, 100);
      return;
    }
    // Убираем старые препятствия
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
    }
  }

  // Новое препятствие иногда
  if (Math.random() < 0.02) {
    addObstacle();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacles();
  drawScore();
}

function loop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && player.onGround) {
    player.yVel = jumpForce;
  }
});

resetGame();
loop();
