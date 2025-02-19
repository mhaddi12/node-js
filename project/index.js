const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Request received");

  setTimeout(() => {
    console.log("Sending response: Hello, World!");
    res.end("Hello, World!");
  }, 2000); // 2 second delay
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
