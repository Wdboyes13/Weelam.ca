const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');

const app = express();

const staticPath = path.join(__dirname, 'www'); // Your static folder

const options = {
  key: fs.readFileSync('/home/william/.certs/mainweb-priv.pem'),
  cert: fs.readFileSync('/home/william/.certs/mainweb.pem')
};

app.use(serveStatic(staticPath));

const PORT = 8000; // HTTPS default port

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${PORT}`);
});
