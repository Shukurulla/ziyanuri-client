const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4173;
const DIR = path.join(__dirname, "dist");

const mimeTypes = {
  ".html": "text/html", ".js": "application/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".woff": "font/woff", ".webp": "image/webp",
};

http.createServer((req, res) => {
  let filePath = path.join(DIR, req.url.split("?")[0]);
  if (filePath.endsWith("/")) filePath += "index.html";

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(path.join(DIR, "index.html")).pipe(res);
  }
}).listen(PORT, "0.0.0.0", () => {
  console.log(`Serving on http://0.0.0.0:${PORT}`);
});
