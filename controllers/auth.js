import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';
import gravatar from 'gravatar';
import path from 'node:path';
import fs from 'node:fs/promises';
import Jimp from 'jimp';


export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const emailToLowerCase = email.toLowerCase();

        const user = await User.findOne({ email: emailToLowerCase });

        if (user !== null) {
            throw HttpError(409, "Email in use");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email);

        const newUser = await User.create({
            email: emailToLowerCase,
            password: passwordHash,
            avatarURL
        });
        
        res.status(201).json({
            user: { email, subscribtion: newUser.subscribtion },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const emailToLowerCase = email.toLowerCase();

        const user = await User.findOne({ email: emailToLowerCase });

        if (user === null) {
            throw HttpError(401, "Email or password is wrong");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw HttpError(401, "Email or password is wrong");
        }

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

const avatarDir = path.join(__dirname, '../', 'public', 'avatars');

export const updateAvatar = async (req, res, next) => {
    try {
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
            avatarURL,
        });
    } catch (error) {
        next(error);
    }
};