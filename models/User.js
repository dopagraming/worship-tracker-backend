import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String, enum: ['admin', 'parent', 'student'],
        required: true
    },
    points: { type: Number },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gfits: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gift"
        }
    ],
    completed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Worship"
        }
    ],
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.matchPassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

export default mongoose.model('User', userSchema);