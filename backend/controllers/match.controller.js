import { Match } from '../models/Match.js';
import { AppError } from '../middleware/error.middleware.js';

export const getMatches = async (req, res, next) => {
    try {
        const { sport, location, time } = req.query;
        let filters = {};

        if (sport && sport !== 'all') filters.sport = sport;
        if (location) filters.location = { $regex: location, $options: 'i' }; // Case-insensitive matching

        if (time === 'today') {
            const start = new Date(); start.setHours(0, 0, 0, 0);
            const end = new Date(); end.setHours(23, 59, 59, 999);
            filters.dateTime = { $gte: start, $lte: end };
        } else if (time === 'upcoming') {
            filters.dateTime = { $gte: new Date() };
        }

        const matches = await Match.find(filters)
            .populate('organizer', 'name email phoneNumber')
            .populate('playersJoined', 'name email phoneNumber')
            .sort('dateTime');

        res.status(200).json({ status: 'success', results: matches.length, data: matches });
    } catch (error) { next(error); }
};

export const createMatch = async (req, res, next) => {
    try {
        const { sport, location, dateTime, playersNeeded, notes, teamFilings, organizerPhone } = req.body;

        const match = await Match.create({
            sport, location, dateTime, playersNeeded, notes, teamFilings, organizerPhone,
            organizer: req.user._id,
            playersJoined: [req.user._id] // The creator automatically joins the match
        });

        res.status(201).json({ status: 'success', data: match });
    } catch (error) { next(error); }
};

export const joinMatch = async (req, res, next) => {
    try {
        const match = await Match.findById(req.params.id);

        if (!match) return next(new AppError(404, 'Match match listing not found.'));

        // Check if user is already inside array
        if (match.playersJoined.includes(req.user._id)) {
            return next(new AppError(400, 'You are already registered for this slot.'));
        }

        // Check if slot capacity is filled
        if (match.playersJoined.length >= match.playersNeeded) {
            return next(new AppError(400, 'Match roster slot capacity filled.'));
        }

        match.playersJoined.push(req.user._id);
        await match.save();

        res.status(200).json({ status: 'success', data: match });
    } catch (error) { next(error); }
};

export const getMatch = async (req, res, next) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate('organizer', 'name email phoneNumber')
            .populate('playersJoined', 'name email phoneNumber');

        if (!match) return next(new AppError(404, 'Match not found.'));

        res.status(200).json({ status: 'success', data: match });
    } catch (error) { next(error); }
};

export const postMessage = async (req, res, next) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) return next(new AppError(404, 'Match not found.'));

        // Verify that the user has joined the match
        const hasJoined = match.playersJoined.some(pId => pId.toString() === req.user._id.toString());
        if (!hasJoined) {
            return next(new AppError(403, 'You must join this match to write messages in the chat.'));
        }

        const { text } = req.body;
        match.messages.push({
            sender: req.user._id,
            senderName: req.user.name,
            text
        });

        await match.save();

        res.status(201).json({ status: 'success', data: match.messages[match.messages.length - 1] });
    } catch (error) { next(error); }
};