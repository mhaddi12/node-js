const multer = require("multer");
const cloudinary = require("../config/cloudinary"); // Cloudinary config
const streamifier = require("streamifier"); // This helps convert buffer to stream for Cloudinary upload

// Memory storage setup for multer
const storage = multer.memoryStorage();

// Initialize multer with memory storage
const upload = multer({ storage });

// Function to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // Automatically detect the resource type (image, video, etc.)
        public_id: filename, // Use the provided filename as the Cloudinary public_id
      },
      (error, result) => {
        if (error) {
          reject(error); // Reject the promise if there’s an error
        } else {
          resolve(result); // Resolve the promise with the Cloudinary result (including secure_url)
        }
      }
    );

    // Convert the file buffer to stream and upload to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = { upload, uploadToCloudinary }; // Ensure you're exporting both
