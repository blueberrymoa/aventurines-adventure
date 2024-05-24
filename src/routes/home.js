const express = require('express');
const router = express.Router();

// Route to serve the home page
router.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Route to serve the game page
router.get('/game', (req, res) => {
  res.sendFile('game.html', { root: 'public' });
});

module.exports = router;
