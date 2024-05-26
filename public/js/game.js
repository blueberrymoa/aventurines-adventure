const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameOverOverlay = document.getElementById('game-over');
const retryButton = document.getElementById('retry');
const levelCompleteOverlay = document.getElementById('level-complete');
const continueButton = document.getElementById('continue');
const menuButton = document.getElementById('return-to-menu');
const levelNumber = document.getElementById('level-number');

const game = {

  width: 800, height: 600,
  gravity: 0.3,
  stars: [],
  level: 1,
  over: false,
  levelComplete: false,
  startTime: null,
  player: {
    x: 0, y: 0,
    width: 100, height: 106,
    velocityY: 0,
    dragging: false, // Track if player is being dragged
    offsetX: 0, // Offset between mouse and player position
    offsetY: 0
  },
  platform: {
    x: 0, y: 0,
    width: 100, height: 100,
    visible: true
  },
  assets: {
    sky: 'assets/purple_sky.jpg',
    ground: 'assets/platform.png',
    star: 'assets/star.png',
    dude: 'assets/dude.png'
  }

};

// Preloads assets
const images = {};
function preload() {

  for (const [key, value] of Object.entries(game.assets)) {
    const img = new Image();
    img.src = value;
    images[key] = img;
  }
  
}

// Creates game objects
function create() {

  game.stars = [];
  game.over = false;
  game.levelComplete = false;
  game.startTime = Date.now();
  spawnStars();
  gameOverOverlay.style.display = 'none';
  levelCompleteOverlay.style.display = 'none';

  // Centers starting platform
  if (game.platform.visible) {
    game.platform.x = (game.width - game.platform.width) / 2;
    game.platform.y = game.height / 2;
  }

  // Centers the player above the platform
  game.player.x = (game.width - game.player.width) / 2;
  game.player.y = game.platform.y - game.player.height;

  draw(0);

}

// Spawns stars
function spawnStars() {

  const edgeBuffer = 50; // Buffer to ensure stars are spawned just inside the edges
  const numberOfStars = 2 + game.level * 2;
        
  for (let i = 0; i < numberOfStars; i++) {
    let x, y;

    // Randomly select which edge to spawn the star
    const edge = Math.floor(Math.random() * 4);
    switch (edge) {
      case 0: // Top edge
        x = Math.random() * (canvas.width - edgeBuffer * 2) + edgeBuffer;
        y = edgeBuffer;
        break;
      case 1: // Bottom edge
        x = Math.random() * (canvas.width - edgeBuffer * 2) + edgeBuffer;
        y = canvas.height - edgeBuffer;
        break;
      case 2: // Left edge
        x = edgeBuffer;
        y = Math.random() * (canvas.height - edgeBuffer * 2) + edgeBuffer;
        break;
      case 3: // Right edge
        x = canvas.width - edgeBuffer;
        y = Math.random() * (canvas.height - edgeBuffer * 2) + edgeBuffer;
        break;
    }
    
    // Sets star speed and direction
    let speed = 2 + game.level * 0.5;
    let directionX = (Math.random() * 2 - 1) * speed;
    let directionY = (Math.random() * 2 - 1) * speed;       

    game.stars.push({
      x: x, y: y,
      width: 30, height: 30,
      speed: speed,
      directionX: directionX,
      directionY: directionY
    });

  }

}

// Initializes starting platform
// Updates background and player
function draw(elapsedTime) {

  // Draws sky
  ctx.drawImage(images.sky, 0, 0, game.width, game.height);

  // Draws starting platform
  if (game.platform.visible) {
    ctx.drawImage(images.ground, game.platform.x, game.platform.y, game.platform.width, game.platform.height);
  }

  // Draws player
  ctx.drawImage(images.dude, game.player.x, game.player.y, game.player.width, game.player.height);

  // Draws timer
  const minutes = Math.floor(elapsedTime / 60);
  const secs = Math.floor(elapsedTime % 60);
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'right';
  ctx.fillText(`${minutes}:${secs < 10 ? '0' : ''}${secs}`, canvas.width - 15, 30);

  // Draws stars
  game.stars.forEach(star => {
    ctx.drawImage(images.star, star.x, star.y, star.width, star.height);
  });

  // Moves stars
  game.stars.forEach(star => {
    star.x += star.directionX;
    star.y += star.directionY;

    // Bounce off the edges of the canvas
    if (star.x <= 0 || star.x + star.width >= canvas.width) {
        star.directionX *= -1;
    }
    if (star.y <= 0 || star.y + star.height >= canvas.height) {
        star.directionY *= -1;
    }
  });

}

// Updates game state
function update() {

  // Checks if player is being dragged
  if (!game.player.dragging) {
    // Simulates gravity
    game.player.velocityY += game.gravity;
    game.player.y += game.player.velocityY;
  }

  // Checks for collision with platform if visible
  if (
      game.platform.visible && 
      game.player.y + game.player.height >= game.platform.y + 70 &&
      game.player.y + game.player.height <= game.platform.y + game.platform.height &&
      game.player.x + game.player.width > game.platform.x && 
      game.player.x < game.platform.x + game.platform.width
  ) {
      game.player.y = (game.platform.y + 70) - game.player.height;
      game.player.velocityY = 0;
  }

  // Checks for collision with floor
  if (game.player.y + game.player.height >= game.height) {
    game.player.y = game.height - game.player.height;
    game.player.velocityY = 0;
  }

  // Checks for collision with moving star
  game.stars.forEach(star => {
    if (
        game.player.x + star.width < star.x + star.width && // Player left collision
        game.player.x + game.player.width - star.width > star.x && // Player right collision
        game.player.y + star.height < star.y + star.height && // Player top collision
        game.player.y + game.player.height - star.height > star.y // Player bottom collision
    ) {
        game.over = true;
    }
  });

  // Game over screen
  if (game.over) {
    gameOverOverlay.style.display = 'block';
    game.platform.visible = true;
    return;
  }

  // Updates elapsed time
  if (!game.startTime) game.startTime = Date.now();
  const elapsedTime = ((Date.now() - game.startTime) / 1000) + 1;

  // End of level screen, shown after 10 seconds
  if (elapsedTime > 11) {
    game.levelComplete = true;
    levelNumber.textContent = game.level;
    levelCompleteOverlay.style.display = 'block';
    game.platform.visible = true;
    return;
  }

  // Redraws game
  ctx.clearRect(0, 0, game.width, game.height);
  draw(elapsedTime);

  // Requests next frame
  requestAnimationFrame(update);

}

// Event listener for click
canvas.addEventListener('mousedown', function(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  // Checks if mouse is over the player
  // Removes platform from game canvas
  if (
    mouseX >= game.player.x && mouseX <= game.player.x + game.player.width &&
    mouseY >= game.player.y && mouseY <= game.player.y + game.player.height
  ) {
    game.player.dragging = true;
    game.player.offsetX = mouseX - game.player.x;
    game.player.offsetY = mouseY - game.player.y;
    game.platform.visible = false;
  }
});

// Event listener for drag
canvas.addEventListener('mousemove', function(event) {

  // Checks if player is clicked
  // Drags player along with mouse
  if (game.player.dragging) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    game.player.x = mouseX - game.player.offsetX;
    game.player.y = mouseY - game.player.offsetY;
  }
});

// Releases player
window.addEventListener('mouseup', function(event) {
  game.player.dragging = false;
});

menuButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

retryButton.addEventListener('click', () => {
  game.level = 1;
  startGame();
});

continueButton.addEventListener('click', () => {
  game.level++;
  startGame();
});

// Starts game
function startGame() {
  preload();
  create();
  update();
}

// Starts level 1
startGame();