import mongoose from 'mongoose';

const worshipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    points: { type: Number, required: true },
    rewardValue: { type: Number, default: 0 }
});

export default mongoose.model('Worship', worshipSchema);