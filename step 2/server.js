// const fs = require('fs');

// // Asynchronous File Reading
// console.log("Start");
// fs.readFile('file.txt', 'utf8', (err, data) => {
//   if (err) throw err;
//   console.log(data); // Executes when file is read
// });
// console.log("End");

// console.log("Start");

// setTimeout(() => {
//   console.log("Timeout callback");
// }, 1000);

// console.log("End");

// makePromisive = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       //console.log();
//       resolve("Timeout callback");
//     }, 1000);
//   });
// };
// console.log("Start");
// makePromisive().then((data) => {
//   console.log(data);
// });
// console.log("End");

// makePromisive = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       //console.log();
//       resolve("Timeout callback");
//     }, 1000);
//   });
// };

// const main = async () => {
//   console.log("Start");
//   const data = await makePromisive();
//   console.log(data);
//   console.log("End");
// };

// main();
//ES6 Syntax

// const myPromise = new Promise((resolve, reject) => {
//   let success = false;
//   if (success) {
//     resolve("Success");
//   } else {
//     reject("Fail");
//   }
// });

// myPromise
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
const fetch = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Database is Connected");
    }, 1000);
  });
};

fetch()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
