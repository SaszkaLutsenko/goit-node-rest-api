import express from 'express';
import {
    register,
    login,
    logout,
    current
} from "../controllers/auth.js";
import validateBody from '../helpers/validateBody.js';
import authMiddleware from "../middleware/auth.js";
import { userShema } from "../models/users.js";

const userRouter = express.Router();
const jsonParses = express.json();


userRouter.post("/register", validateBody(userShema), jsonParses, register);
userRouter.post("/login", validateBody(userShema), jsonParses, login);
userRouter.post("/logout", authMiddleware, logout);
userRouter.get("/current", authMiddleware, current);


export default userRouter;
