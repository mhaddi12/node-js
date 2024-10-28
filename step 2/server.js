// const fs = require("fs");
// const os = require("os");
require("../step 2/file");
const _ = require("lodash");

// var user = os.userInfo();
// console.log(user.username);
// fs.appendFile("file.txt", " HI " + user.username + "!\n", () => {
//   console.log("File is Created");
// });
const array = [1, 2, 3, 4, 54, 12, 3, 1, 3];

console.log(_.uniq(array));
