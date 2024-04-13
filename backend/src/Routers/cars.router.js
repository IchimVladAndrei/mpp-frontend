/* eslint-disable @typescript-eslint/no-var-requires */
// const express = require('express');
// const fs = require('fs');
// const router = express.Router();
import {faker} from '@faker-js/faker';
import {Router} from 'express';
import fs from 'fs';
import sql from 'mssql/msnodesqlv8.js';
import {config} from '../server';

const router = Router();

async function getAllCars() {
    try {
        const pool = await sql.connect(config);
        const res = await pool.request().query('SELECT * FROM Cars');
        await pool.close();
        return res.recordset;
    } catch (error) {
        console.log('error on query', error);
        return [];
    }
}

export function generateRandomCar() {
    const uniqueId = cars.length ? cars[cars.length - 1].id + 1 : 1;
    const newRandomCar = {
        id: uniqueId,
        brand: faker.company.name(),
        price: faker.helpers.rangeToNumber({min: 1, max: 1000}),
        yearBought: faker.helpers.rangeToNumber({min: 1950, max: 2025}),
    };
    cars.push(newRandomCar);
    saveCars();
    return newRandomCar;
}
export let cars = [];
const filePath =
    'C:\\Users\\potat\\OneDrive\\Documents\\VisualCode\\MPP\\frontend\\backend\\src\\cars.json';
try {
    const data = fs.readFileSync(filePath, 'utf8');
    cars = JSON.parse(data);
    //console.log(cars);
} catch (error) {
    console.log('error while reading the file', error);
}

function saveCars() {
    try {
        fs.writeFileSync(filePath, JSON.stringify(cars, null, 4));
    } catch (error) {
        console('error while writing to file', error);
    }
}

router.get('/', (req, res) => {
    res.send(cars);
});

router.post('/addCar', (req, res) => {
    const {brand, price, yearBought} = req.body;
    const parsedPrice = parseInt(price, 10);
    const parsedYearBought = parseInt(yearBought, 10);
    const uniqueId = cars.length ? cars[cars.length - 1].id + 1 : 1;

    const newCar = {
        id: uniqueId,
        brand,
        price: parsedPrice,
        yearBought: parsedYearBought,
    };
    if (!checkPropsCar(brand, parsedPrice, parsedYearBought)) {
        res.status(400).json({error: 'Invalid car properties'});
        return;
    }

    cars.push(newCar);
    saveCars();
    res.status(200).json(newCar);
});

router.delete('/deleteCar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cars.map((e) => e.id).indexOf(id);
    //console.log(id);
    if (index === -1) {
        res.status(403);
        res.send();
        return;
    }
    cars.splice(index, 1);
    saveCars();
    res.status(204);
    res.json(cars);
    //    res.json(cars).status(204);
});

router.put('/updateCar/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const {brand, price, yearBought} = req.body;
    const parsedPrice = parseInt(price, 10);
    const parsedYearBought = parseInt(yearBought, 10);
    const updatedCar = {
        id: id,
        brand,
        price: parsedPrice,
        yearBought: parsedYearBought,
    };
    const index = cars.findIndex((car) => car.id === id);
    // console.log(index);
    if (index === -1) {
        res.status(401).json({error: 'Car to update is missing'});
        return;
    }
    cars[index] = updatedCar;

    saveCars();
    res.status(200).json(updatedCar);
});

router.get('/:id', (req, res) => {
    const {id} = req.params;
    const car = cars.find((car) => car.id === parseInt(id));

    if (car === null || car === undefined) {
        res.status(404).send({error: 'Car not found'});

        return;
    }

    res.send(car);
});

const checkPropsCar = (brand, price, yearBought) => {
    if (price < 1) return false;
    if (yearBought < 1903) return false;
    if (brand.length < 3) return false;

    return !cars.some(
        (car) =>
            car.brand === brand &&
            car.price === price &&
            car.yearBought === yearBought,
    );
};

// module.exports = router;
export default router;
