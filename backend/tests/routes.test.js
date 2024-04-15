/* eslint-disable @typescript-eslint/no-var-requires */
// const request = require('supertest');
// const app = require('../src/server');
import request from 'supertest';
import app, {closeServer} from '../src/server';
describe('GetAll', () => {
    afterAll(async () => {
        await closeServer();
    });
    it('should test getAll', async () => {
        const res = await request(app).get('/api/cars');
        expect(res.statusCode).toEqual(200);
        const cars = res.body;
        expect(cars).toBeDefined();
        expect(Array.isArray(cars)).toBeTruthy();
        expect(cars.length).toBeGreaterThan(0);
        cars.forEach((element) => {
            expect(element).toHaveProperty('id');
            expect(element).toHaveProperty('brand');
            expect(element).toHaveProperty('price');
            expect(element).toHaveProperty('yearBought');
            expect(typeof element.id).toBe('number');
            expect(typeof element.brand).toBe('string');
            expect(typeof element.price).toBe('number');
            expect(typeof element.yearBought).toBe('number');
        });
    });
});

describe('AddCar', () => {
    const carToAdd = {
        brand: 'SomeBrand',
        price: 44,
        yearBought: 2024,
        dealer: 'Prime Motors',
    };
    it('should return the added car', async () => {
        const res = await request(app).post('/api/cars/addCar').send(carToAdd);
        const res2 = await request(app).get('/api/cars');
        expect(res2.statusCode).toEqual(200);
        const cars = res2.body;
        expect(cars).toBeDefined();
        expect(Array.isArray(cars)).toBeTruthy();
        expect(cars.length).toBeGreaterThan(0);
        const addedCar = cars.find((car) => car.id === res.body.id);
        expect(addedCar).toEqual({
            id: expect.any(Number),
            brand: 'SomeBrand',
            price: 44,
            yearBought: 2024,
        });
    });

    it('should return 400 because invalid data', async () => {
        const invalidCar = {
            brand: 'i',
            price: -5,
            yearBought: 200,
            dealer: 'Prime Motors',
        };
        const res2 = await request(app).get('/api/cars');
        expect(res2.statusCode).toEqual(200);
        const cars = res2.body;
        expect(cars).toBeDefined();
        expect(Array.isArray(cars)).toBeTruthy();
        const res = await request(app)
            .post('/api/cars/addCar')
            .send(invalidCar);
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Invalid car properties');
        const res3 = await request(app).get('/api/cars');
        expect(res3.statusCode).toEqual(200);
        const cars2 = res3.body;
        expect(cars2).toBeDefined();
        expect(Array.isArray(cars2)).toBeTruthy();
        expect(cars2.length).toEqual(cars.length);
    });

    it('should stop adding same car', async () => {
        //same car will be added because new ID is generated

        const res2 = await request(app).get('/api/cars');
        expect(res2.statusCode).toEqual(200);
        const cars = res2.body;
        expect(cars).toBeDefined();
        expect(Array.isArray(cars)).toBeTruthy();
        const res = await request(app).post('/api/cars/addCar').send(carToAdd);
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Invalid car properties');
        const res3 = await request(app).get('/api/cars');
        expect(res3.statusCode).toEqual(200);
        const cars2 = res3.body;
        expect(cars2).toBeDefined();
        expect(Array.isArray(cars2)).toBeTruthy();
        expect(cars2.length).toEqual(cars.length);
    });
});
describe('Update Car', () => {
    const carToUpdate = {
        brand: 'AnotherBrand',
        price: 55,
        yearBought: 2025,
    };
    it('should update the car if index found', async () => {
        const res0 = await request(app).get('/api/cars');
        const carsBeforeUpdate = res0.body;
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
        const res2 = await request(app).get('/api/cars');
        const carsAfterUpdate = res2.body;
        const updatedCar = carsAfterUpdate.find((car) => car.id === 12);
        expect(updatedCar).toEqual({
            id: 12,
            brand: 'AnotherBrand',
            price: 55,
            yearBought: 2025,
        });
        carsBeforeUpdate.forEach((car) => {
            if (car.id !== 12) {
                const theCarAfterUpdate = carsAfterUpdate.find(
                    (item) => item.id === car.id,
                );
                expect(theCarAfterUpdate).toEqual(car);
            }
        });
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
    afterAll(async () => {
        await closeServer();
    });
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
        const res0 = await request(app).get('/api/cars');
        const carsBeforeDelete = res0.body;

        const res = await request(app).delete('/api/cars/deleteCar/13');
        expect(res.statusCode).toEqual(204);
        const res2 = await request(app).get('/api/cars');
        const carsAfterDelete = res2.body;
        const deletedCar = carsAfterDelete.find((car) => car.id === 13);
        expect(deletedCar).toBeUndefined();
        expect(carsBeforeDelete.length - carsAfterDelete.length).toEqual(1);
    });
    it('should getStatus403', async () => {
        const res0 = await request(app).get('/api/cars');
        const carsBeforeDelete = res0.body;
        const res = await request(app).delete('/api/cars/deleteCar/999');
        expect(res.statusCode).toEqual(403);
        const res2 = await request(app).get('/api/cars');
        const carsAfterDelete = res2.body;
        expect(carsBeforeDelete.length - carsAfterDelete.length).toEqual(0);
    });
    afterAll(async () => {
        await request(app)
            .put('/api/cars/updateCar/12')
            .send({brand: 'das', price: 22, yearBought: 2020});
    });
});
//eroare la a2lea run de teste e din caauza la autoincrement
