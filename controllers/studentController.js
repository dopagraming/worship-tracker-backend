import Worship from '../models/Worship.js';
import Gift from '../models/Gift.js';
import User from '../models/User.js';
import { calculateTotalPoints } from '../utils/calculatePoints.js';

export const listDailyWorships = async (req, res) => {
    const worships = await Worship.find();
    const completed = req.user.completed || [];
    res.json({ worships, completed });
};

export const completeWorship = async (req, res) => {
    const { worshipId } = req.body;
    if (!req.user.completed) req.user.completed = [];
    if (!req.user.completed.includes(worshipId)) {
        req.user.completed.push(worshipId);
        await req.user.save();
    }
    const worships = await Worship.find();
    const totalPoints = calculateTotalPoints(req.user.completed, worships);
    req.user.points = totalPoints;
    await req.user.save();

    const THRESHOLD = 100;
    if (totalPoints >= THRESHOLD) {
        await Gift.create({
            student: req.user._id,
            description: `هدية عند الوصول إلى ${totalPoints} نقطة`
        });
    }

    res.json({ completed: req.user.completed, points: totalPoints });
};