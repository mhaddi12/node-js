var prompt = require("prompt-sync")();

// var width = prompt("What is the width? ");
// var length = prompt("what is the length? ");

// function myAge(n) {
//   if (n < 18) {
//     return "less the 18";
//   } else if (n >= 18 && n <= 65) {
//     return "age between 18 and 65";
//   } else {
//     return "more then 65";
//   }
// }

// console.log("====================================");
// console.log(myAge(n));
// console.log("====================================");

// function calculateArea(width, length) {
//   return width * length;
// }
// console.log(calculateArea(width, length));

// var products = {
//   name: "I phone 7",
//   price: "99.99$",
//   inStock: false,
// };

// console.log(products.name);

var name = prompt("What is the name of the guest?");

var guestList = ["Haddi", "Hassam", "Ammar", "Ibraheem", "Kaleem"];

var filteredGuests = guestList.filter(function (guest) {
  return guest === name;
});

if (filteredGuests.length > 0) {
  console.log("Found");
} else {
  console.log("Not Found");
}
