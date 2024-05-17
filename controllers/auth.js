import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';


export const register = async (req, res, next)  => {
    const {email, password} = req.body;
    const emailToLowerCase = email.toLowerCase();

    try {
        const user = await User.findOne({email: emailToLowerCase})

        if(!user) throw HttpError(409, "Email in use");
        
        const passwordHash = await bcrypt.hash(password, 10);

         await User.create({
             email: emailToLowerCase,
             password: passwordHash
            });        
        res.status(201).json({
            user: { email },
        })
    } catch(error){
        next(error);
    }
};

export const login = async (req, res, next)  => {
    const {email, password} = req.body;
    const emailToLowerCase = email.toLowerCase();

    try {
        const user = await User.findOne({email: emailToLowerCase})

        if(!user) throw HttpError(401, "Email or password is wrong");
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch === false){
            throw HttpError(401, "Email or password is wrong");
        }
            
        const token = jwt.sign({id: user._id }, process.env.JWT_SEKRET )

        res.status(201).json({ token });
    } catch(error){
        next(error);
    }
};
export const current = async (req,res) => {
    try {
        const email = req.user ? req.user.email : null;
        res.json({ email });
    } catch(error){
        next(error);
    }
};

export const logout = async (req, res)  => {
   const { id } = req.user;

    await User.findByIdAndUpdate(id, { token: null });
    res.status(204).end();
    
};