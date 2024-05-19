import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';


export const register = async (req, res, next)  => {
   

    try {
        const {email, password} = req.body;
        const emailToLowerCase = email.toLowerCase();

        const user = await User.findOne({email: emailToLowerCase})

        if(user !== null) {throw HttpError(409, "Email in use")};
        
        const passwordHash = await bcrypt.hash(password, 10);

         const newUser = await User.create({
             email: emailToLowerCase,
             password: passwordHash
            });        
        res.status(201).json({
            user: { email, subscribtion: newUser.subscribtion },

        })
    } catch(error){
        next(error);
    }
};

export const login = async (req, res, next)  => {
   

    try {
        const {email, password} = req.body;
        const emailToLowerCase = email.toLowerCase();

        const user = await User.findOne({email: emailToLowerCase})

        if(user === null) {throw HttpError(401, "Email or password is wrong")};
        
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {throw HttpError(401, "Email or password is wrong")};
            
        const token = jwt.sign({id: user._id }, process.env.JWT_SEKRET, {expiresIn: "1h"} )

        await User.findOneAndUpdate({email}, { token });

        res.status(201).json({
            user: { token, email, subscribtion: newUser.subscribtion },

        })
    } catch(error){
        next(error);
    }
};
export const current = async (req, res) => {
    const { email, subscribtion } = req.user
    res.json({email, subscribtion})
};

export const logout = async (req, res)  => {
  try{
    await User.findOneAndUpdate(req.user._id, {token: null})
    res.status(204).end()
  } catch(error){
    next(error)
  }
    
};