require("dotenv").config();
const mongoose = require("mongoose");
const HomeCategory = require("../model/HomeCategory");
const cloudinary = require("../utils/cloudinary");
const defaultUrl = "mongodb+srv://inbafreakz_db_user:tb868bQdyiV4HDdO@cluster0.guxcmfs.mongodb.net/myDatabase?retryWrites=true&w=majority";

const runMigration = async () => {
  const url = process.env.MONGODB_URI || defaultUrl;
  console.log("Connecting to MongoDB at", url);
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB!");
  } catch (dbErr) {
    console.log(`Primary DB connection failed, trying local fallback: ${dbErr.message}`);
    await mongoose.connect("mongodb://localhost:27017/inba-mart");
    console.log("Connected to Local MongoDB!");
  }

  const categories = await HomeCategory.find();
  console.log(`Found ${categories.length} home categories to check.`);

  for (const cat of categories) {
    if (cat.Image && cat.Image.includes("cloudinary.com")) {
      console.log(`Category "${cat.name}" image is already hosted on Cloudinary: ${cat.Image}`);
      continue;
    }

    if (cat.Image && (cat.Image.startsWith("http://") || cat.Image.startsWith("https://"))) {
      console.log(`Uploading "${cat.name}" image to Cloudinary from URL: ${cat.Image}`);
      try {
        const uploadResult = await cloudinary.uploader.upload(cat.Image, {
          folder: "inbamart_categories",
        });
        console.log(`Uploaded! New URL: ${uploadResult.secure_url}`);
        cat.Image = uploadResult.secure_url;
        await cat.save();
        console.log(`Saved "${cat.name}" in database.`);
      } catch (err) {
        console.error(`Failed to upload image for "${cat.name}":`, err.message);
      }
    }
  }

  console.log("Migration complete!");
  process.exit(0);
};

runMigration().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
