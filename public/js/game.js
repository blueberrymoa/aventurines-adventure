const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = {
  width: 800,
  height: 600,
  gravity: 0.3,
  player: {
    x: 0, //365,
    y: 0, //370,
    width: 100,
    height: 106,
    velocityY: 0,
    dragging: false, // Track if player is being dragged
    offsetX: 0, // Offset between mouse and player position
    offsetY: 0
  },
  platform: {
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    visible: true
  },
  assets: {
    sky: 'assets/purple_sky.jpg',
    ground: 'assets/platform.png',
    star: 'assets/star.png',
    bomb: 'assets/bomb.png',
    dude: 'assets/dude.png'
  }
};

// Preload assets
const images = {};
function preload() {
  for (const [key, value] of Object.entries(game.assets)) {
    const img = new Image();
    img.src = value;
    images[key] = img;
  }
}

// Create game objects
function create() {

  // Center starting platform
  if (game.platform.visible) {
    game.platform.x = (game.width - game.platform.width) / 2;
    game.platform.y = game.height / 2;
  }

  // Center the player image above the platform
  game.player.x = (game.width - game.player.width) / 2;
  game.player.y = game.platform.y - game.player.height;

  draw();

}

function draw() {

  // Draw sky
  ctx.drawImage(images.sky, 0, 0, game.width, game.height);

  // Draw starting platform
  if (game.platform.visible) {
    ctx.drawImage(images.ground, game.platform.x, game.platform.y, game.platform.width, game.platform.height);
  }

  // Draw player
  ctx.drawImage(images.dude, game.player.x, game.player.y, game.player.width, game.player.height);

}


// Update game state
function update() {

  // Check if player is being dragged
  if (!game.player.dragging) {
    // Simulate gravity
    game.player.velocityY += game.gravity;
    game.player.y += game.player.velocityY;
  }

  // Check for collision with floor
  if (game.player.y + game.player.height >= game.height) {
    game.player.y = game.height - game.player.height;
    game.player.velocityY = 0;
  }

  // Check for collision with platform if visible
  if (game.platform.visible && 
    game.player.y + game.player.height >= game.platform.y + 70 &&
    game.player.y + game.player.height <= game.platform.y + game.platform.height &&
    game.player.x + game.player.width > game.platform.x &&
    game.player.x < game.platform.x + game.platform.width) {
      game.player.y = (game.platform.y + 70) - game.player.height;
      game.player.velocityY = 0;
  }

  // Redraw game
  ctx.clearRect(0, 0, game.width, game.height);
  draw();

  // Request next frame
  requestAnimationFrame(update);

}

// Event listeners for click-and-drag
canvas.addEventListener('mousedown', function(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  // Check if mouse is over the player
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

canvas.addEventListener('mousemove', function(event) {
  if (game.player.dragging) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    game.player.x = mouseX - game.player.offsetX;
    game.player.y = mouseY - game.player.offsetY;
  }
});

canvas.addEventListener('mouseup', function(event) {
  game.player.dragging = false;
});

window.addEventListener('mouseup', function(event) {
  game.player.dragging = false;
});

// Start game
preload();
create();
update();