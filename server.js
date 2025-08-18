const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const helmet = require("helmet");

const app = express();

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  // If the request is not secure, redirect to HTTPS
  if (!req.secure && req.get("x-forwarded-proto") !== "https") {
    return res.redirect(`https://${req.get("host")}${req.url}`);
  }
  next();
});

// Custom headers, all but first are recommended by Mozilla
app.use((req, res, next) => {
  res.setHeader('X-SuperSecret', 'https://youtu.be/dQw4w9WgXcQ');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// CSP Configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],               // only your domain by default
      scriptSrc: ["'self'", "https://esm.run", "https://fonts.googleapis.com", 
                  "https://static.cloudflareinsights.com", "https://cdn.jsdelivr.net"], // allow your domain + esm.run + other

      styleSrc: ["'self'","https://esm.run", "https://fonts.googleapis.com"], // allow inline styles if needed + googlefonts + esmrun
      imgSrc: ["'self'","https://esm.run", "https://fonts.googleapis.com"], // allow local images + base64 + googlefonts + esmrun
      connectSrc: ["'self'"],              // AJAX/WebSocket requests

      fontSrc: ["'self'", "https://esm.run", "https://fonts.googleapis.com", "https://fonts.gstatic.com"], // font loading
      objectSrc: ["'none'", "https://esm.run", "https://fonts.googleapis.com"], // block <object>, <embed>
      frameAncestors: ["'self'", "https://open.spotify.com"], // XFO replacement for modern browsers
      
      defaultSrc: ["'none'"],
      frameSrc: ["https://open.spotify.com"]
    },
  })
);

app.get('/games/devwordle.weelam.ca', (req, res) => {
  res.redirect('https://devwordle.weelam.ca');
});

app.get('/github/profile', (req, res) => {
  res.redirect('https://github.com/Wdboyes13/');
});

app.get('/github/:repo', (req, res) => {
  const repo = req.params.repo;
  res.redirect(`https://github.com/Wdboyes13/${repo}`);
});

app.get('/secret/', (req, res) => {
  res.redirect('https://youtu.be/dQw4w9WgXcQ');
});

const staticPath = path.join(__dirname, 'www'); // Static folder

app.use(serveStatic(staticPath));

const PORT = 8000; // HTTP port

app.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
