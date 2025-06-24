const http = require("http");

const server = http.createServer((req, res) => {
  console.log("URL:", req.url);

  if (req.url === "/") {
    res.write("<h1>Welcome to Home Page!</h1>");
  } else if (req.url === "/about") {
    res.write("<h1>This is the About Page</h1>");
  } else {
    res.write(" <h1>Page Not Found</h1>");
    res.write(`<a href ="http://localhost:7272/">Back to Home</a>`)
  }
  res.end();
});

server.listen(7272, () => {
  console.log("🚀 Server running at http://localhost:7272");
});
