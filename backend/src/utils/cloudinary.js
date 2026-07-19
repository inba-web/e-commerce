const cloudinary = require("cloudinary").v2;

// Configure Cloudinary using env variables, with a working demo sandbox fallback
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dgoffyvvi",
  api_key: process.env.CLOUDINARY_API_KEY || "539423696863116",
  api_secret: process.env.CLOUDINARY_API_SECRET || "2U5F7a1_wFfR9r8WzWc0Zt_iL5M",
});

module.exports = cloudinary;
