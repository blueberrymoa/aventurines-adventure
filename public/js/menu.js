document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-game').addEventListener('click', () => {
    window.location.href = '/game'; // Adjust based on your routing setup
  });

  document.getElementById('instructions').addEventListener('click', () => {
    alert('Welcome to a Honkai: Star Rail mini game! Use arrow keys to move, spacebar to shoot.');
  });

  document.getElementById('credits').addEventListener('click', () => {
    alert('Game developed by Conner Small. For Ollie <3');
  });
});