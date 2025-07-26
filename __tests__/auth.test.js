import request from 'supertest';
import app from '../app.js'; 

describe('Auth Routes', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'student'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toMatchObject({ email: 'test@example.com', role: 'student' });
    });

    it('should not register with invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'X', email: 'not-an-email', password: '123', role: 'student' });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0]).toHaveProperty('msg', 'البريد الإلكتروني غير صالح');
    });
});