import express from "express";
import "dotenv/config";
import connectToDB from "./src/config/database.js";
import authRouter from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRouter from "./src/routes/interview.route.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

//middlewares
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

// using all the routes here
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ message: "Resume must be a PDF no larger than 3 MB." });
  }
  return res.status(400).json({ message: error.message || "Invalid request." });
});

//connetion to db ..and then start server
connectToDB()
  .then(() => {
    console.log("connection with db successfull");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Server startup failed:", err.message);
    process.exit(1);
  });
