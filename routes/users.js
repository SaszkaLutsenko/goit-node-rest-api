import express from "express";
import { uploadAvatar, getAvatar } from "../controllers/auth.js";
import upload from "../middleware/upload.js";

const avatarRouter = express.Router();


avatarRouter.patch("/avatar", upload.single("avatarURL"), uploadAvatar);
avatarRouter.get("/avatar", getAvatar)

export default avatarRouter;