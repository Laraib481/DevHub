// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const authRoutes = require("./routes/authRoutes");
// const snippetRoutes = require("./routes/snippetRoutes");
// const noteRoutes = require("./routes/noteRoutes");
// const resourceRoutes = require("./routes/resourceRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/snippets", snippetRoutes);
// app.use("/api/notes", noteRoutes);
// app.use("/api/resources", resourceRoutes);

// app.get("/", (req, res) => {
//   res.send("DevHub backend is running");
// });

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected successfully");

//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log("MongoDB connection error:", error.message);
//   });

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const authRoutes = require("./routes/authRoutes");
// const snippetRoutes = require("./routes/snippetRoutes");
// const noteRoutes = require("./routes/noteRoutes");
// const resourceRoutes = require("./routes/resourceRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/snippets", snippetRoutes);
// app.use("/api/notes", noteRoutes);
// app.use("/api/resources", resourceRoutes);

// // Test route
// app.get("/", (req, res) => {
//   res.send("DevHub backend is running 🚀");
// });

// // PORT (IMPORTANT)
// const PORT = process.env.PORT || 5000;

// // Start server FIRST (Railway safe)
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Then connect MongoDB (non-blocking)
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected successfully");
//   })
//   .catch((error) => {
//     console.log("MongoDB connection error:", error.message);
//   });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const snippetRoutes = require("./routes/snippetRoutes");
const noteRoutes = require("./routes/noteRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/resources", resourceRoutes);

// Health check route (VERY IMPORTANT for Railway)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "DevHub backend is running 🚀"
  });
});

// PORT
const PORT = process.env.PORT || 5000;

// Start server FIRST (Railway-safe)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MongoDB connection (non-blocking)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });