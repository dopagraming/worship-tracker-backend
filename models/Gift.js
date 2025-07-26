import mongoose from 'mongoose';

const giftSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    dateAwarded: { type: Date, default: Date.now }
});

export default mongoose.model('Gift', giftSchema);