import express from "express";
import path from "path";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";


const app = express();

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Use environment variables to set the origin for CORS
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(cookieParser());

// Serve static files for production
const __dirname = path.resolve(); // To mimic __dirname behavior with ES6 modules

// Adjust multer storage path for production (e.g., use a cloud service or public directory)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save in a proper directory, configurable via env
    const uploadDir = path.join(__dirname, process.env.UPLOAD_PATH || "./public/upload");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({ filename: file.filename, path: `/upload/${file.filename}` });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);

// Serve React app for production (frontend should be in build directory)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`API working on port ${PORT}!`);
});
