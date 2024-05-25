document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-game').addEventListener('click', () => {
    window.location.href = '/game'; // Adjust based on your routing setup
  });

  document.getElementById('instructions').addEventListener('click', () => {
    alert('Welcome to a Honkai: Star Rail mini game! Click and drag Aventurine to avoid the stars.');
  });

  document.getElementById('credits').addEventListener('click', () => {
    alert('Game developed by Conner Small. For Ollie <3');
  });
});