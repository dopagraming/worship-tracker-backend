import User from '../models/User.js';
import Worship from '../models/Worship.js';
import Gift from '../models/Gift.js';
import { calculateTotalPoints } from '../utils/calculatePoints.js';
import bcrypt from "bcrypt"
export const createWorship = async (req, res) => {
    const { name, points, rewardValue } = req.body;
    const w = await Worship.create({ name, points, rewardValue });
    res.status(201).json(w);
};

export const listWorships = async (req, res) => {
    let { page = 1, limit = 10, sortBy = 'name', order = 'asc', name } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = {};

    if (name) {
        filter.name = new RegExp(name, 'i');
    }

    const total = await Worship.countDocuments(filter);

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

    const data = await Worship
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    res.json({
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
        data
    });
};

export const updateWorship = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const w = await Worship.findByIdAndUpdate(id, updates, { new: true });
    if (!w) return res.status(404).json({ message: 'Worship not found' });
    res.json(w);
};

export const deleteWorship = async (req, res) => {
    const { id } = req.params;
    const w = await Worship.findByIdAndDelete(id);
    if (!w) return res.status(404).json({ message: 'Worship not found' });
    res.json({ message: 'Deleted successfully' });
};

export const manageUsers = async (req, res) => {
    let { page = 1, limit = 10, sortBy = 'name', order = 'asc', role, email } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = {};

    if (role) filter.role = role;
    if (email) filter.email = new RegExp(email, 'i');

    const total = await User.countDocuments(filter);
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

    const data = await User
        .find(filter)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit);

    res.json({ total, page, pages: Math.ceil(total / limit), limit, data });
};

export const createParent = async (req, res) => {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashed, role: 'parent' });
    const { password: _p, ...userData } = user.toObject();
    res.status(201).json({ success: true, data: userData });
};

export const getStatsForUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'student') {
        const worships = await Worship.find();
        const completed = user.completed || [];
        const points = calculateTotalPoints(completed, worships);
        const gifts = await Gift.countDocuments({ student: id });

        return res.json({
            role: 'student',
            stats: {
                worshipCount: completed.length,
                points,
                gifts
            }
        });
    } else if (user.role === 'parent') {
        const students = await User.find({ parentRef: id });
        const worships = await Worship.find();
        let totalPoints = 0;
        students.forEach(s => {
            const pts = calculateTotalPoints(s.completed || [], worships);
            totalPoints += pts;
        });

        return res.json({
            role: 'parent',
            stats: {
                studentCount: students.length,
                totalPoints
            }
        });
    } else if (user.role === 'admin') {
        const countParents = await User.countDocuments({ role: 'parent' });
        const countStudents = await User.countDocuments({ role: 'student' });
        return res.json({
            role: 'admin',
            stats: {
                parents: countParents,
                students: countStudents
            }
        });
    }

    res.status(400).json({ message: 'Unsupported role' });
};
