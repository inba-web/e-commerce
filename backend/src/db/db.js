const { default: mongoose} = require("mongoose")

const url = "mongodb+srv://inbafreakz_db_user:tb868bQdyiV4HDdO@cluster0.guxcmfs.mongodb.net/myDatabase?retryWrites=true&w=majority";

const connectDB = async() => {
    try {
        const connection = await mongoose.connect(url);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Error: ${error}`)
    }
}

module.exports=connectDB;