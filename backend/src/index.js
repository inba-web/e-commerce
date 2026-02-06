const express = require("express");
const connectDB = require("./db/db");

const app = express();

app.get("/", (req, res) => {
    res.send({message:"Welcome To Inba Mart Backend System!"})
})

const port = 5000;

app.listen(port, async()=> {
    console.log(`Server is running on port : ${port}`)
    await connectDB();
})