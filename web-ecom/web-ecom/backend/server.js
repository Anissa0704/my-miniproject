require("dotenv").config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const app = express();

// OWASP: Security Headers
app.use(helmet());
// OWASP: Sanitize Data (NoSQL Injection Prevention)
app.use(mongoSanitize());

app.use(cors());
app.use(express.json());

// OWASP: Rate Limiting to prevent brute-force attacks on auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: { error: "Too many requests from this IP, please try again after 15 minutes" }
});
const path = require("path");

app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes")); 
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Serve static files for uploaded image slips
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("MongoDB Connected"))

  .catch(err => console.log(err));

app.get("/", (req, res) => {

  res.send("API Running");

});

app.listen(5000, () => console.log("Server running on port 5000"));
 