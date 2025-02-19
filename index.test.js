const request = require('supertest');
const app = require('./index'); // Adjust this path based on your project structure

describe('GET /', () => {
    it('should return 200 status code', async() => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    it('should return the correct message', async() => {
        const response = await request(app).get('/');
        expect(response.text).toBe('Hello, Jenkins!');
    });
});