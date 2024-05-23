import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  HttpError from '../helpers/HttpError.js';
import gravatar from 'gravatar';
import path from 'node:path';
import fs from 'node:fs/promises';
import Jimp from 'jimp';
import { nanoid } from 'nanoid';
import mail from "../helpers/sendEmail.js"; 

const avatarDir = path.join(__dirname, '../', 'public', 'avatars');
const {BASE_URL} = process.env;


export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const emailToLowerCase = email.toLowerCase();

        const user = await User.findOne({ email: emailToLowerCase });

        if (user) throw HttpError(409, "Email in use");

        const passwordHash = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email, { s: "250", r: "pg", d: "mm" }, true);
        const verificationToken = nanoid();  

        const newUser = await User.create({
            email: emailToLowerCase,
            password: passwordHash,
            avatarURL,
            verificationToken  
        });

        const verify = ({
            to: emailToLowerCase,
            from: "contactbook@gmail.com",
            subject: "welcome to contactbook!",
            html: `To verify your email please <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">click</a> here`,
            text: `To verify your email please open the link ${BASE_URL}/api/users/verify/${verificationToken}`
        })

        await mail.sendEmail(verify)
        
        res.status(201).json({
            user: { email, subscribtion: newUser.subscribtion },
        });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const {verificationToken} = req.params;  
        const user = await User.findOne({verificationToken});

        if(!user) throw HttpError(404, "User not found")   

        await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null}, {new: true}); 

        res.status(200).json({
            message: "Verification successful"
        });
    } catch (error) {
        next(error);
    }
};

export const resendVerifyEmail = async (req, res, next) => { 
    try {
        const {email} = req.body;  
        const user = await User.findOne({email}); 

        if(!email) throw HttpError(400, "missing required field email");

        if(!user) throw HttpError(401, "email not foun")   
        
        if(user.verify) throw HttpError(400, "Verification has already been passed") 

        const verify = ({
            to: email,
            from: "contactbook@gmail.com",
            subject: "welcome to contactbook!",
            html: `To verify your email please <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">click</a> here`,
            text: `To verify your email please open the link ${BASE_URL}/api/users/verify/${verificationToken}`
        })

        await mail.sendEmail(verify)



        res.json({
            message: "verify email verify success"  
        })
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const emailToLowerCase = email.toLowerCase();

        const user = await User.findOne({ email: emailToLowerCase });

        if (user === null) throw HttpError(401, "Email or password is wrong");

        if(!user.verify) throw HttpError(400, "Please verify your email")
    
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw HttpError(401, "Email or password is wrong");
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        await User.findOneAndUpdate({ email }, { token });

        res.status(200).json({
            user: { token, email, subscribtion: user.subscribtion },
        });
    } catch (error) {
        next(error);
    }
};

export const current = async (req, res) => {
    const { email, subscribtion } = req.user;
    res.json({ email, subscribtion });
};

export const logout = async (req, res, next) => {
    try {
        await User.findOneAndUpdate(req.user._id, { token: null });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const uploadAvatar = async (req, res, next) => {
    try {
        const { path: tmpPath, filename } = req.file;
        const targetPath = path.resolve('public/avatars', filename);

        const image = await Jimp.read(tmpPath);
        await image.resize(250, 250).writeAsync(targetPath);

        await fs.unlink(tmpPath);

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { avatarURL: filename },
            { new: true }
        );

        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const getAvatar = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.avatarURL) throw HttpError(404, "Avatar not found");

        res.sendFile(path.resolve('public/avatars', user.avatarURL));
    } catch (error) {
        next(error);
    }
};

export const updateAvatar = async (req, res, next) => {
    try {
         if (!req.user) throw HttpError(401, "Not authorized");

         if(!req.file) throw HttpError(400, "File not provided");

        const { _id } = req.user;
        const { path: tmpUpload, originalname } = req.file;
        const avatarName = `${_id}_${originalname}`;
        const resultUpload = path.join(avatarDir, avatarName);

        const image = await Jimp.read(tmpUpload);
        await image.resize(250, 250).writeAsync(resultUpload);

        await fs.unlink(tmpUpload);

        const avatarURL = path.join('avatars', avatarName);
        await User.findOneAndUpdate(_id, { avatarURL }, { new: true });

        res.json({
            avatarURL
        });
    } catch (error) {
        next(error);
    }
};

