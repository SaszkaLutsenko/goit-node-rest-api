import * as fs from "node:fs";
import path from "node:path";
import User from "../models/users.js";

export const uploadAvatar = async (req, res, next ) => {
   
    try {
        await fs.rename(
            req.file.path,
            path.resolve("public/avatars", req.file.filename)
            );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {avatarURL: req.file.name}, 
            {new: true} 
            );
        res.send(user)        
    } catch(error){
        next(error);
    }
};

export const getAvatar = async (req, res, next ) => {
   
    try {
        const user = await User.findById(req.user.id);
        if(!user.avatarURL) throw HttpError(404, "Avatar not found")   
            
        res.sendFile(path.resolve("public/avatars", user.avatarURL))      
    } catch(error){
        next(error);
    }
};