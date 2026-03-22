import express from "express";
import session from "express-session";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import spotifyRoutes from "./routes/spotify.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();



app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true, 
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      httpOnly: true, // Prevent JS access to cookie
      maxAge: 1000 * 60 * 60, // 1 hour (matches Spotify token expiry)
    },
  })
);


app.use("/auth", authRoutes);
app.use("/api", spotifyRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});


const PORT = process.env.PORT;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend running on http://127.0.0.1:${PORT}`);
});
