import express from "express";
import { uploadAvatar, getAvatar } from "../controllers/user";
import uploadMidlleware from "../middleware/upload.js";

const avatarRouter = express.Router();

avatarRouter.patch("/avatar", uploadMidlleware.single("avatarURL"), uploadAvatar);
avatarRouter.get("/avatar", getAvatar)

export default avatarRouter;