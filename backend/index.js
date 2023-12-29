const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const serviceRoute = require("./routes/service");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");

// configuring the evn file
dotenv.config();

// connecting to the mongo_db database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DBConnection successfull..."))
  .catch((err) => {
    console.log("DBConnection Error... ");
    console.log(err);
  });

app.use(cors());

app.use(express.json());

// Auth route endpoint (api)
app.use("/api/auth", authRoute);

// User route endpoint (api)
app.use("/api/users", userRoute);

// Product route endpoint (api)
app.use("/api/products", productRoute);

// Cart route endpoint (api)
app.use("/api/carts", cartRoute);

// Order route endpoint (api)
app.use("/api/orders", orderRoute);

// Service route endpoint (api)
app.use("/api/service", serviceRoute);

// Stripe route endpoint (api)
app.use("/api/checkout", stripeRoute);

// running it on port PORT or 5000 (if not found)
app.listen(process.env.PORT || 5000, () => {
  console.log("Backend running...");
});
