const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const game = {

  width: 800,
  height: 600,
  gravity: 0.3,
  stars: [],
  level: 1,
  gameOver: false,
  levelComplete: false,
  startTime: null,
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
    x: 0,
    y: 0,
    width: 100,
    height: 100,
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

  //stars = [];
  // gameOver = false;
  // levelComplete = false;
  // startTime = Date.now();
  // spawnStars();
  // gameOverOverlay.style.display = 'none';
  // levelCompleteOverlay.style.display = 'none';

  // Centers starting platform
  if (game.platform.visible) {
    game.platform.x = (game.width - game.platform.width) / 2;
    game.platform.y = game.height / 2;
  }

  // Centers the player above the platform
  game.player.x = (game.width - game.player.width) / 2;
  game.player.y = game.platform.y - game.player.height;

  draw();

}

function spawnStars() {

  for (let i = 0; i < 5 + level; i++) {
      stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          width: 30,
          height: 30,
          speed: 2 + level * 0.5
      });
  }

}

// Initializes starting platform
// Updates background and player
function draw() {

  // Draws sky
  ctx.drawImage(images.sky, 0, 0, game.width, game.height);

  // Draws starting platform
  if (game.platform.visible) {
    ctx.drawImage(images.ground, game.platform.x, game.platform.y, game.platform.width, game.platform.height);
  }

  // Draws player
  ctx.drawImage(images.dude, game.player.x, game.player.y, game.player.width, game.player.height);

  // // Draws stars
  // if (!game.platform.visible) {
  //   stars.forEach(star => {
  //     ctx.drawImage(images.star, star.x, star.y, star.width, star.height);
  //   });
  // }

  // // Moves stars
  // function moveStars() {
  //   stars.forEach(star => {
  //       star.x -= star.speed;
  //       if (star.x + star.width < 0) {
  //           star.x = canvas.width;
  //           star.y = Math.random() * canvas.height;
  //       }
  //   });
  // }

}

// Updates game state
function update() {

  // Checks if player is being dragged
  if (!game.player.dragging) {
    // Simulates gravity
    game.player.velocityY += game.gravity;
    game.player.y += game.player.velocityY;
  }

  // Checks for collision with floor
  if (game.player.y + game.player.height >= game.height) {
    game.player.y = game.height - game.player.height;
    game.player.velocityY = 0;
  }

  // Checks for collision with platform if visible
  if (game.platform.visible && 
    game.player.y + game.player.height >= game.platform.y + 70 &&
    game.player.y + game.player.height <= game.platform.y + game.platform.height &&
    game.player.x + game.player.width > game.platform.x && 
    game.player.x < game.platform.x + game.platform.width) {
      game.player.y = (game.platform.y + 70) - game.player.height;
      game.player.velocityY = 0;
  }

  // stars.forEach(star => {
  //   if (
  //       player.x < star.x + star.width &&
  //       player.x + player.width > star.x &&
  //       player.y < star.y + star.height &&
  //       player.y + player.height > star.y
  //   ) {
  //       gameOver = true;
  //   }
  // });

  // if (gameOver) {
  //   gameOverOverlay.style.display = 'block';
  //   return;
  // }

  // if (!startTime) startTime = Date.now();
  // const elapsedTime = (Date.now() - startTime) / 1000;

  // if (elapsedTime > 10) {
  //   levelComplete = true;
  //   levelCompleteOverlay.style.display = 'block';
  //   return;
  // }

  // Redraws game
  ctx.clearRect(0, 0, game.width, game.height);
  draw();

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

// Releases player from canvas
canvas.addEventListener('mouseup', function(event) {
  game.player.dragging = false;
});

// Releases player from outside canvas
window.addEventListener('mouseup', function(event) {
  game.player.dragging = false;
});

// Event listener for menu button
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('return-to-menu');
  menuButton.addEventListener('click', () => {
      window.location.href = 'index.html';
  });
});

// backButton.addEventListener('click', () => {
//   window.location.href = 'index.html';
// });

// retryButton.addEventListener('click', () => {
//   level = 1;
//   resetGame();
//   update();
// });

// continueButton.addEventListener('click', () => {
//   level++;
//   resetGame();
//   update();
// });

// Starts game
preload();
create();
update();