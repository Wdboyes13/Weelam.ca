const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const helmet = require("helmet");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
      scriptSrc: ["'self'", 
                  "https://esm.run",  
                  "https://fonts.googleapis.com", 
                  "https://static.cloudflareinsights.com", 
                  "https://cdn.jsdelivr.net", 
                  "'unsafe-inline'"], // Although its bad practice, unsafe inline is required for dynamic scripts

      styleSrc: ["'self'","https://esm.run", "https://fonts.googleapis.com"], // allow inline styles if needed + googlefonts + esmrun
      imgSrc: ["'self'","https://esm.run", "https://fonts.googleapis.com", "https://img.pagecloud.com"], // allow local images + base64 + googlefonts + esmrun
      connectSrc: ["'self'"],              // AJAX/WebSocket requests

      fontSrc: ["'self'", "https://esm.run", "https://fonts.googleapis.com", "https://fonts.gstatic.com"], // font loading
      objectSrc: ["'none'", "https://esm.run", "https://fonts.googleapis.com"], // block <object>, <embed>
      frameAncestors: ["'self'", "https://open.spotify.com"], // XFO replacement for modern browsers
      
      defaultSrc: ["'none'"],
      frameSrc: ["https://open.spotify.com"],
      mediaSrc: ["https://weelam.ca"]
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


app.post("/cconv/convert", async (req, res) => {
  const { from, to, amnt } = req.body;
  const amount = parseFloat(amnt);

  const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`);
  const data = await response.json();
  const converted = (amount * data.rates[to]).toFixed(2);

  res.setHeader('Content-Type', 'text/html');
  res.send(`
        <!DOCTYPE html><html><head><title>Result</title></head><body><script>
            document.addEventListener("DOMContentLoaded", () => {
              alert(\"${amount} ${from} is ${converted} ${to}\");
              window.location.href=\"/cconv\"
            });
        </script></body></html>
    `)
});

const staticPath = path.join(__dirname, 'www'); // Static folder

app.use(serveStatic(staticPath));

const PORT = 8000; // HTTP port

app.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
