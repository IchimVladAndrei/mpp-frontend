/* eslint-disable @typescript-eslint/no-var-requires */
// const request = require('supertest');
// const app = require('../src/server');
import request from 'supertest';
import app from '../src/server';
describe('GetAll', () => {
    it('should test getAll', async () => {
        const res = await request(app).get('/api/cars');
        expect(res.statusCode).toEqual(200);
        const cars = res.body;
        expect(cars).toBeDefined();
        expect(Array.isArray(cars)).toBeTruthy();
        expect(cars.length).toBeGreaterThan(0);
    });
});
describe('AddCar', () => {
    const carToAdd = {
        brand: 'SomeBrand',
        price: 44,
        yearBought: 2024,
    };
    it('should return the added car', async () => {
        const res = await request(app).post('/api/cars/addCar').send(carToAdd);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            id: expect.any(Number),
            brand: 'SomeBrand',
            price: 44,
            yearBought: 2024,
        });
    });
    it('should stop adding same car', async () => {
        const res = await request(app).post('/api/cars/addCar').send(carToAdd);
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Invalid car properties');
    });
});
describe('Update Car', () => {
    const carToUpdate = {
        brand: 'AnotherBrand',
        price: 55,
        yearBought: 2025,
    };
    it('should update the car if index found', async () => {
        const res = await request(app)
            .put('/api/cars/updateCar/12')
            .send(carToUpdate);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            id: 12,
            brand: 'AnotherBrand',
            price: 55,
            yearBought: 2025,
        });
        const res2 = await request(app).get('/api/cars/12');
        // expect(res.body)
    });
    it('should not update a car', async () => {
        const res = await request(app)
            .put('/api/cars/updateCar/1222')
            .send(carToUpdate);
        expect(res.statusCode).toEqual(401);
        expect(res.body.error).toEqual('Car to update is missing');
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
describe('deleteCar', () => {
    it('should getStatus204', async () => {
        const res = await request(app).delete('/api/cars/deleteCar/13');
        expect(res.statusCode).toEqual(204);
    });
    it('should getStatus403', async () => {
        const res = await request(app).delete('/api/cars/deleteCar/999');
        expect(res.statusCode).toEqual(403);
    });
});
