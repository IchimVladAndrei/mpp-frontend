/* eslint-disable @typescript-eslint/no-var-requires */
// const express = require('express');
// const fs = require('fs');
// const router = express.Router();
import {faker} from '@faker-js/faker';
import {Router} from 'express';
import {
    create,
    deleter,
    read,
    readById,
    updater,
} from '..//Models/car.model.js';
const router = Router();

// async function getAllCars() {
//     try {
//         const pool = await sql.connect(config);
//         const res = await pool.request().query('SELECT * FROM Cars');
//         await pool.close();
//         return res.recordset;
//     } catch (error) {
//         console.log('error on query', error);
//         return [];
//     }
// }

export function generateRandomCar() {
    const uniqueId = cars.length ? cars[cars.length - 1].id + 1 : 1;
    const newRandomCar = {
        id: uniqueId,
        brand: faker.company.name(),
        price: faker.helpers.rangeToNumber({min: 1, max: 1000}),
        yearBought: faker.helpers.rangeToNumber({min: 1950, max: 2025}),
    };
    cars.push(newRandomCar);
    //saveCars();
    return newRandomCar;
}
export let cars = await read(); //will be renamed to searchedCars
// const filePath =
//     'C:\\Users\\potat\\OneDrive\\Documents\\VisualCode\\MPP\\frontend\\backend\\src\\cars.json';
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     cars = JSON.parse(data);
//     //console.log(cars);
// } catch (error) {
//     console.log('error while reading the file', error);
// }

// function saveCars() {
//     try {
//         fs.writeFileSync(filePath, JSON.stringify(cars, null, 4));
//     } catch (error) {
//         console('error while writing to file', error);
//     }
// }

router.get('/', async (req, res) => {
    // res.send(cars);
    try {
        const myCars = await read();
        res.send(myCars);
    } catch (error) {
        console.error('Error on retriever cars', error);
        res.status(500).json({error: 'Database err'});
    }
});

router.post('/addCar', async (req, res) => {
    const {brand, price, yearBought} = req.body;
    const parsedPrice = parseInt(price, 10);
    const parsedYearBought = parseInt(yearBought, 10);
    //const uniqueId = cars.length ? cars[cars.length - 1].id + 1 : 1;
    // if (!checkPropsCar(brand, parsedPrice, parsedYearBought)) {
    //     res.status(400).json({error: 'Invalid car properties'});
    //     return;
    // }

    try {
        const newCar = await create(brand, parsedPrice, parsedYearBought);
        //console.log(newCar);
        res.status(200).json(newCar);
    } catch (error) {
        res.status(400).json({error: 'Invalid car properties'});
        // console.error('Error on adding player');
    }

    //cars.push(newCar);
    //saveCars();
});

router.delete('/deleteCar/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    //const index = cars.map((e) => e.id).indexOf(id); //we need this in sql
    //console.log(id);
    // if (index === -1) {
    //     res.status(403);
    //     res.send();
    //     return;
    // }

    try {
        const rowsAffected = await deleter(id);

        const newList = await read();
        //probabil dai un select si trimiti?
        //console.log(rowsAffected);
        rowsAffected[0] !== 0
            ? res.status(204).json(newList)
            : res.status(403).send();
    } catch (error) {
        console.error('Error on delete player', error);
    }

    //cars.splice(index, 1);
    //saveCars();

    //    res.json(cars).status(204);
});

router.put('/updateCar/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    const {brand, price, yearBought} = req.body;
    const parsedPrice = parseInt(price, 10);
    const parsedYearBought = parseInt(yearBought, 10);
    /*
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
    }*/

    try {
        const [updatedCar, rowsAffected] = await updater(
            id,
            brand,
            parsedPrice,
            parsedYearBought,
        );
        rowsAffected[0] !== 0
            ? res.status(200).json(updatedCar)
            : res.status(401).json({error: 'Car to update is missing'});
    } catch (error) {
        console.error('Error on update car', error);
    }

    //cars[index] = updatedCar;

    //saveCars();
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const parsedId = parseInt(id, 10);
    /*
    const car = cars.find((car) => car.id === parseInt(id));
    if (car === null || car === undefined) {
        res.status(404).send({error: 'Car not found'});

        return;
    }*/
    try {
        const [car, rowsAffected] = await readById(parsedId);
        rowsAffected !== 0
            ? res.send(car)
            : res.status(404).send({error: 'Car not found'});
    } catch (error) {
        console.error(`Error on getting the car no ${parsedId}`, error);
    }

    //  res.send(car);
});

// const checkPropsCar = async (brand, price, yearBought) => {
//     if (price < 1) return false;
//     if (yearBought < 1903) return false;
//     if (brand.length < 3) return false;

//     const searchedCars = await read();

//     return !searchedCars.some(
//         (car) =>
//             car.brand === brand &&
//             car.price === price &&
//             car.yearBought === yearBought,
//     );
// };

// module.exports = router;
export default router;
