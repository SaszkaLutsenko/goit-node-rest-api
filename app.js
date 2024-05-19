import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouters.js";
import userRouter from './routes/auth.js';
import authMiddleware from "./middleware/auth.js";
import "./db/db.js";
import avatarRouter from './routes/users.js';
import path from "node:path";

const app = express();
app.use("/avatars", express.static(path.resolve("public/avatars")))

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/users", userRouter);
app.use("/avatar", authMiddleware, avatarRouter);

const DB_URI = process.env.DB_URI;


export const run = async (err, req, res, next) => {
  try {
      await mongoose.connect(DB_URI)
      console.log("Database connection successful")
  } catch(error) {
      next(error);
     
  }
};

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});