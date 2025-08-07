import mongoose from 'mongoose';

const giftSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cost: {
        type: Number
    },
    description: {
        type: String,
        required: true
    },
    dateAwarded: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Gift', giftSchema);