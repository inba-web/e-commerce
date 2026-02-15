const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./db/db");

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send({message:"Welcome To Inba Mart Backend System!"}) 
})


const adminRoutes = require("./routes/adminRoutes.js");
const sellerRoutes = require("./routes/sellerRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/UserRoute.js");

app.use("/sellers", sellerRoutes);
app.use("/api/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

const port = 5000;

app.listen(port, async()=> {
    console.log(`Server is running on port : ${port}`)
    await connectDB();
})