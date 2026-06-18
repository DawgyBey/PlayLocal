import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

import { User } from '../models/User.js';
import { AppError } from '../middleware/error.middleware.js';

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// ================= REGISTER =================
export const register = async (req, res, next) => {
    try {
        const { name, email, password, phoneNumber } = req.body;

        if (!name || !email || !password) {
            return next(
                new AppError(400, 'Name, email and password are required.')
            );
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(
                new AppError(400, 'User with this email already exists.')
            );
        }

        const user = await User.create({
            name,
            email,
            password,
            phoneNumber
        });

        const token = generateToken(user._id);

        res.status(201).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        next(error);
    }
};

// ================= LOGIN =================
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(
                new AppError(400, 'Please provide email and password.')
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return next(
                new AppError(401, 'Incorrect email or password.')
            );
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return next(
                new AppError(401, 'Incorrect email or password.')
            );
        }

        const token = generateToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        next(error);
    }
};

// ================= GOOGLE LOGIN =================
export const googleLogin = async (req, res, next) => {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const { credential } = req.body;

        if (!credential) {
            return next(
                new AppError(400, 'Google credential is required.')
            );
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return next(
                new AppError(401, 'Invalid Google token.')
            );
        }

        let user = await User.findOne({
            email: payload.email
        });

        if (!user) {
            const randomPassword =
                crypto.randomBytes(32).toString('hex');

            user = await User.create({
                name: payload.name || 'Google User',
                email: payload.email,
                password: randomPassword,
                phoneNumber: ''
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            },
            needsPhoneNumber: !user.phoneNumber
        });
    } catch (error) {
        return next(
            new AppError(401, 'Google authentication failed.')
        );
    }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res, next) => {
    try {
        const { phoneNumber, name } = req.body;

        const updateData = {};
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (name !== undefined) updateData.name = name;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return next(new AppError(404, 'User not found.'));
        }

        res.status(200).json({
            status: 'success',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        next(error);
    }
};