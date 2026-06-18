import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware.js';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError(401, 'Access denied. You are not logged in.'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id).select('-password');
        if (!currentUser) {
            return next(new AppError(401, 'The user belonging to this token no longer exists.'));
        }

        // Attach user to the request object
        req.user = currentUser;
        next();
    } catch (error) {
        return next(new AppError(401, 'Invalid token. Authorization denied.'));
    }
};