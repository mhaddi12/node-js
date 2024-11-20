const cloudinary = require("cloudinary").v2; // Correct CommonJS import
const dotenv = require("dotenv"); // For loading environment variables

dotenv.config(); // Load environment variables from .env file

(async function () {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Fetch cloud name from .env
    api_key: process.env.CLOUDINARY_API_KEY, // Fetch API key from .env
    api_secret: process.env.CLOUDINARY_API_SECRET, // Fetch API secret from .env
  });
})();

module.exports = cloudinary;
