import cron from 'node-cron';
import User from '../models/User.js';
import Worship from '../models/Worship.js';
import { calculateTotalPoints } from '../utils/calculatePoints.js';
import { sendEmail } from '../utils/email.js';

export const startCronJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('🔄 Resetting daily completions at midnight');
        try {
            await User.updateMany(
                { role: 'student' },
                { $set: { completed: [] } }
            );
            console.log('Daily completions reset');
        } catch (err) {
            console.error('Error resetting completions:', err);
        }
    });

    cron.schedule('0 8 * * MON', async () => {
        console.log('Sending weekly summaries to parents');
        try {
            const worships = await Worship.find();
            const parents = await User.find({ role: 'parent' });
            for (const parent of parents) {
                const students = await User.find({ parentRef: parent._id });
                let html = '<h3>Weekly Progress Summary</h3><ul>';
                for (const s of students) {
                    const pts = calculateTotalPoints(s.completed || [], worships);
                    html += `<li>${s.name}: ${pts} points</li>`;
                }
                html += '</ul>';
                await sendEmail({
                    to: parent.email,
                    subject: 'Your Students Weekly Progress',
                    html
                });
            }
            console.log('Weekly summaries sent');
        } catch (err) {
            console.error('Error sending summaries:', err);
        }
    });
};