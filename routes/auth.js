import express from 'express';
import {
    register,
    login,
    logout,
    current, 
    updateAvatar,
    verifyEmail,
    resendVerifyEmail
} from "../controllers/auth.js";
import validateBody from '../helpers/validateBody.js';
import authMiddleware from "../middleware/auth.js";
import { userShema, emailSchema } from "../models/users.js";
import upload from '../middleware/upload.js';

const userRouter = express.Router();
const jsonParses = express.json();


userRouter.post("/register", validateBody(userShema), jsonParses, register);
userRouter.get("/verify/:verifycationToken", verifyEmail);
userRouter.post("/verify", validateBody(emailSchema), resendVerifyEmail);
userRouter.post("/login", validateBody(userShema), jsonParses, login);
userRouter.post("/logout", authMiddleware, logout);
userRouter.get("/current", authMiddleware, current);
userRouter.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

export default userRouter;
