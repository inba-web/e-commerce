const mongoose = require("mongoose");

const defaultUrl = "mongodb+srv://inbafreakz_db_user:tb868bQdyiV4HDdO@cluster0.guxcmfs.mongodb.net/myDatabase?retryWrites=true&w=majority";

const connectDB = async() => {
    const url = process.env.MONGODB_URI || defaultUrl;
    try {
        const connection = await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000 // 5 seconds selection timeout
        });
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Primary Connection Error: ${error.message}`);
        if (url !== "mongodb://localhost:27017/inba-mart") {
            console.log("Attempting local MongoDB fallback at mongodb://localhost:27017/inba-mart...");
            try {
                const localConnection = await mongoose.connect("mongodb://localhost:27017/inba-mart", {
                    serverSelectionTimeoutMS: 3000
                });
                console.log(`MongoDB Connected (Local Fallback): ${localConnection.connection.host}`);
            } catch (localError) {
                console.log(`MongoDB Local Fallback failed: ${localError.message}`);
                console.log("Attempting local in-memory MongoDB fallback...");
                try {
                    const { MongoMemoryServer } = require("mongodb-memory-server");
                    const mongoServer = await MongoMemoryServer.create();
                    const mongoUri = mongoServer.getUri();
                    const inMemoryConnection = await mongoose.connect(mongoUri);
                    console.log(`MongoDB Connected (In-Memory Fallback): ${inMemoryConnection.connection.host}`);
                } catch (memError) {
                    console.log(`MongoDB In-Memory Fallback failed: ${memError.message}`);
                    console.log("Running in offline buffering mode. Database operations will wait.");
                }
            }
        }
    }
}

module.exports = connectDB;