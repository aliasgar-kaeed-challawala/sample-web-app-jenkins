const request = require('supertest');
const app = require('./app'); // Import the app instance directly

describe('GET /', () => {
    it('should return "Hello from Docker Container!"', async() => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Hello from Docker Container!');
    });
});