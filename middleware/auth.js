import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import HttpError from '../helpers/HttpError.js';

const auth = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return next(HttpError(401, "Not authorized"));
    }

    const [bearer, token] =  authorizationHeader.split(" ", 2);

    if (bearer !== "Bearer") {
        return next(HttpError(401, "Not authorized"));
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, decode) => {
        if (error) {
            return next(HttpError(401, "Not authorized"));
        } 

        try {
            const user = await User.findById(decode.id);
  
            if (!user || user.token !== token) {
                return next(HttpError(401, "Not authorized"));
            }

            req.user = user;
            next();
        } catch(error) {
            next(error);
        }
    });
};

export default auth;
