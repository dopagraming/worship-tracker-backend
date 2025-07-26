import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/email.js';

const signToken = id =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
    const { name, email, password, role, parentRef } = req.body;
    const user = await User.create({ name, email, password, role, parentRef });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name, email, role } });
};

export const login = async (req, res) => {
    console.log("here")
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Email أو كلمة المرور غير صحيحة' });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `<p>Use this link to reset your password (valid for 10 minutes):</p>
                     <a href="${resetURL}">${resetURL}</a>`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'Your password reset token',
            html: message
        });
        res.json({ message: 'Token sent to email!' });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw new Error('Error sending email. Try again later.');
    }
};

export const resetPassword = async (req, res) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);
    res.json({ token, message: 'Password has been reset' });
};