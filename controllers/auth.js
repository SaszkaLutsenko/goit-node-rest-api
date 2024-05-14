import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/HttpError.js';


export const register = async (req, res, next)  => {
    const {email, password} = req.body;
    const emailToLoverCase = email.emailToLoverCase();

    try {
        const user = await User.findOne({email: emailToLoverCase})

        if(!user) throw HttpError(409, "Email in use");
        
        const passwordHash = await bcrypt.hash(password, 10);

        const { email } = await User.create({
             email: emailToLoverCase,
             password: passwordHash
            });        
        res.status(201).json({
            user: {
                email,
                subscription,
            },
        })
    } catch(error){
        next(error);
    }
};

export const login = async (req, res, next)  => {
    const {email, password} = req.body;
    const emailToLoverCase = email.emailToLoverCase();

    try {
        const user = await User.findOne({email: emailToLoverCase})

        if(!user) throw HttpError(401, "Email or password is wrong");
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch === false){
            throw HttpError(401, "Email or password is wrong");
        }
            
        const token = jwt.sign({id: user._id }, process.env.JWT_SEKRET )

        res.status(201).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });;
    } catch(error){
        next(error);
    }
};
export const current = async (req,res) => {
    const {email, password} = req.user;
    res.json({email, subscription});
};

export const logout = async (req, res, next)  => {
   
    try {
        const user = await User.findbyIdAndUpdate(req.user.id, { token: null });
        res.status(204).end();
    } catch(error){
        next(error);
    }
};