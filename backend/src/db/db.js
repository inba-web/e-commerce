const mongoose = require("mongoose");


const seedAdmin = async () => {
    try {
        const User = require("../model/User");
        const bcrypt = require("bcrypt");
        const UserRoles = require("../domain/UserRole");
        const HomeCategory = require("../model/HomeCategory");

        // Dynamic Admin Seeding from Environment Variables
        const adminEmail = process.env.ADMIN_EMAIL || "admin@inbamart.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "adminpassword";

        const defaultAdmin = await User.findOne({ email: adminEmail });
        if (!defaultAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const admin = new User({
                fullName: "Super Admin",
                email: adminEmail,
                mobile: "9999999999",
                password: hashedPassword,
                role: UserRoles.ADMIN
            });
            await admin.save();
            console.log(`[ADMIN SEED] Super admin created dynamically with email: ${adminEmail}`);
        }

        // Auto-heal category database images if they contain broken links or mismatched images
        await HomeCategory.updateMany(
            { Image: "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_UY218_.jpg" },
            { Image: "https://images.unsplash.com/photo-1496181130204-755241544e35?q=80&w=600&auto=format&fit=crop" }
        );

        await HomeCategory.updateMany(
            { categoryId: "tv", Image: { $regex: "dslr-camera", $options: "i" } },
            { Image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop" }
        );

        console.log("[DB INIT] Database verification and auto-heal completed.");
    } catch (err) {
        console.error("Failed to seed default admin and database:", err.message);
    }
};

const connectDB = async() => {
    const url = process.env.MONGODB_URI;
    try {
        const connection = await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000 // 5 seconds selection timeout
        });
        console.log(`MongoDB Connected: ${connection.connection.host}`);
        await seedAdmin();
    } catch (error) {
        console.log(`MongoDB Primary Connection Error: ${error.message}`);
        if (url !== "mongodb://localhost:27017/inba-mart") {
            console.log("Attempting local MongoDB fallback at mongodb://localhost:27017/inba-mart...");
            try {
                const localConnection = await mongoose.connect("mongodb://localhost:27017/inba-mart", {
                    serverSelectionTimeoutMS: 3000
                });
                console.log(`MongoDB Connected (Local Fallback): ${localConnection.connection.host}`);
                await seedAdmin();
            } catch (localError) {
                console.log(`MongoDB Local Fallback failed: ${localError.message}`);
                console.log("Attempting local in-memory MongoDB fallback...");
                try {
                    const { MongoMemoryServer } = require("mongodb-memory-server");
                    const mongoServer = await MongoMemoryServer.create();
                    const mongoUri = mongoServer.getUri();
                    const inMemoryConnection = await mongoose.connect(mongoUri);
                    console.log(`MongoDB Connected (In-Memory Fallback): ${inMemoryConnection.connection.host}`);
                    await seedAdmin();
                } catch (memError) {
                    console.log(`MongoDB In-Memory Fallback failed: ${memError.message}`);
                    console.log("Running in offline buffering mode. Database operations will wait.");
                }
            }
        }
    }
}

module.exports = connectDB;