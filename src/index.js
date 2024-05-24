const express = require('express');
const path = require('path');
const homeRoute = require('./routes/home');
const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Use the home route
app.use('/', homeRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
