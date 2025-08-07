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

export const redeemGift = async (req, res) => {
    // Use the authenticated student’s ID
    const studentId = req.user.id;
    const { giftId } = req.params;

    const student = await User.findById(studentId);
    const gift = await Gift.findById(giftId);
    if (!student || !gift) {
        return res.status(404).json({ success: false, message: 'Student or Gift not found' });
    }

    if (student.points < gift.cost) {
        return res
            .status(400)
            .json({ success: false, message: 'Insufficient points to redeem this gift' });
    }

    student.points -= gift.cost;
    await student.save();

    res.json({
        success: true,
        data: {
            remainingPoints: student.points,
            gift: {
                id: gift._id,
                name: gift.name,
                cost: gift.cost
            }
        }
    });
};