const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');

const app = express();

app.get('/games/devwordle.weelam.ca', (req, res) => {
  res.redirect('https://devwordle.weelam.ca');
});

app.use((req, res, next) => {
  res.setHeader('X-SuperSecret', 'https://youtu.be/dQw4w9WgXcQ');
  next();
});

app.get('/secret/', (req, res) => {
  res.redirect('https://youtu.be/dQw4w9WgXcQ');
});

const staticPath = path.join(__dirname, 'www'); // Your static folder

app.use(serveStatic(staticPath));

const PORT = 8000; // HTTP port

app.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
