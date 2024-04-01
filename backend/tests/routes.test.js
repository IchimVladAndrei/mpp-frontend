/* eslint-disable @typescript-eslint/no-var-requires */
const request = require('supertest');
const app = require('../src/server');
describe('GetAll', async () => {
    const res = await request(app).get('/api/cars');
    expect(res.statusCode).toEqual(200);
    // expect(res.body);
});
