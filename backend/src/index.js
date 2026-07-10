const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("./middlewares/mongoSanitize");
const connectDB = require("./db/db");
const adminMiddleware = require("./middlewares/adminMiddleware");

const app = express();
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send({message:"Welcome To Inba Mart Backend System!"}) 
}) 

const adminRoutes = require("./routes/adminRoutes.js"); // adming Routes
const sellerRoutes = require("./routes/sellerRoutes.js"); // seller Routes
const authRoutes = require("./routes/authRoutes.js");  // auth Routes
const userRoutes = require("./routes/UserRoute.js");   // User Routes 
const sellerProductRoutes = require("./routes/sellerProductRoute.js")  // SellerProduct Routes
const productRoutes = require("./routes/productRoute.js");  // Product Routes 
const cartRoutes = require("./routes/CartRoutes.js");  // Cart Routes
const orderRoutes = require("./routes/orderRoutes.js");  // Order Routes
const sellerOrderRoutes = require("./routes/sellerOrderRoutes.js");  // Seller Order Routee
const paymentRoutes = require("./routes/paymentRoutes.js"); // payment routes
const transactionRoutes = require("./routes/transactionRoutes.js") // transaction routes
const sellerReportRoutes = require("./routes/sellerReportsRoutes.js") // seller report routes
const HomeCategoryRoutes = require("./routes/HomeCategoryRoutes.js"); // home category routes


app.use("/products", productRoutes);  // product routes
app.use("/api/sellers/product", sellerProductRoutes);  // sellerProduct routes 

app.use("/api/cart", cartRoutes);  // cart routes
app.use("/api/orders", orderRoutes);  // order routes
app.use("/api/sellers/orders", sellerOrderRoutes);  // sellers order routes

app.use("/api/payment", paymentRoutes);  // payment routes
app.use("/api/transactions", transactionRoutes); // transactions routes
app.use("/api/sellers/report", sellerReportRoutes);  // sellerReportRoutes

app.use("/auth", authRoutes); // auth routes
app.use("/api/users", userRoutes);  // user routes
app.use("/sellers", sellerRoutes);  // seller routes

app.use("/home", HomeCategoryRoutes);  //  HomeCategory Routes

// admin - Locked down to prevent Broken Access Control
app.use("/admin", adminMiddleware, adminRoutes);  // admin routes

const port = 5000;

app.listen(port, async()=> {
    console.log(`Server is running on port : http://localhost:${port}`)
    await connectDB();
})