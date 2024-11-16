const fs = require("fs");

// Synchronous File Reading
console.log("Start");
const data = fs.readFileSync("example.txt", "utf8");
console.log(data);
console.log("End");
