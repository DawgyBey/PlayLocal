import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true, trim: true }
}, { timestamps: true });

const matchSchema = new mongoose.Schema({
    sport: {
        type: String,
        required: true,
        enum: ['Futsal', 'Cricket', 'Basketball', 'Badminton']
    },
    location: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
    playersNeeded: { type: Number, required: true, min: 2, max: 50 },
    teamFilings: { type: String, required: true, trim: true },
    organizerPhone: { type: String, required: true, trim: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    playersJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notes: { type: String, trim: true, default: '' },
    messages: [messageSchema]
}, { timestamps: true });

// Auto-expire match listings 30 days after the match is scheduled to happen
// This allows the community to see "Recently Completed Matches" for trust building
matchSchema.index({ dateTime: 1 }, { expireAfterSeconds: 2592000 });

export const Match = mongoose.model('Match', matchSchema);