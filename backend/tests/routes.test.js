/* eslint-disable @typescript-eslint/no-var-requires */
//const request = require('supertest');
//const app = require('../src/server');
import request from 'supertest';
import app from '../src/server';
describe('GetAll', () => {
    it('should return an array of Semesters', async () => {
        // ...
        const res = await request(app).get('/api/cars');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length >= 1).toBe(true);
    });

    // expect(res.body);
});
describe('AddCar', () => {
    const carToAdd = {
        brand: 'SomeBrand',
        price: 44,
        yearBought: 2024,
    };
    it('should return the added car', async () => {
        const res = await app.post('/api/cars/addCar', (_, sett) => {
            sett.send(carToAdd);
        });
        expect(res.statusCode).toEqual(200);
        expect(res).toEqual({
            id: expect.any(Number),
            brand: 'SomeBrand',
            price: 44,
            yearBought: 2024,
        });
    });
});

describe('getCar', () => {
    it('should getCar', async () => {
        const res = await request(app).get('/api/cars/10');
        expect(res.body).toEqual(
            expect.objectContaining({
                id: 10,
                brand: 'Tesla',
                price: 100,
                yearBought: 2022,
            }),
        );
        expect(res.body.error).toBeUndefined();
    });
    it('should return 404 if car with the specified id is not found', async () => {
        const res = await request(app).get('/api/cars/10000');

        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toEqual('Car not found');
    });
});
// describe('deleteCar', () => {
//     it('should getStatus204', async () => {
//         const res = await request(app).delete('/api/cars/deleteCar/3');
//         expect(res.statusCode).toEqual(204); //merge dar exceeds 5s?
//     });
// });
