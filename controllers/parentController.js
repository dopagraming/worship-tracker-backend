import User from '../models/User.js';
import Worship from '../models/Worship.js';
import Gift from '../models/Gift.js';
import { calculateTotalPoints } from '../utils/calculatePoints.js';

export const createStudent = async (req, res) => {
    const { name, email, password } = req.body;
    const student = await User.create({
        name, email, password,
        role: 'student',
        parentRef: req.user._id
    });
    res.status(201).json(student);
};

export const listMyStudents = async (req, res) => {
    let { page = 1, limit = 10, sortBy = 'name', order = 'asc', name } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = { parentRef: req.user._id };

    if (name) {
        filter.name = new RegExp(name, 'i');
    }

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

export const getStudentStats = async (req, res) => {
    const student = await User.findById(req.params.id);
    if (!student || student.parentRef.toString() !== req.user._id.toString()) {
        return res.status(404).json({ message: 'Student not found' });
    }
    const worships = await Worship.find();
    const completed = student.completed || [];
    const totalPoints = calculateTotalPoints(completed, worships);
    const giftCount = await Gift.countDocuments({ student: student._id });
    res.json({
        student: { id: student._id, name: student.name },
        stats: {
            worshipCount: completed.length,
            points: totalPoints,
            gifts: giftCount
        }
    });
};