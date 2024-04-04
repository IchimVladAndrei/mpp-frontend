import {Router} from 'express';
import fs from 'fs';

const router = Router();

let cars = [];
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
    console.log(parsedPrice);
    console.log(parsedYearBought);
    const newCar = {
        id: uniqueId,
        brand,
        price: parsedPrice,
        yearBought: parsedYearBought,
    };
    console.log(newCar);
    if (!checkPropsCar(brand, parsedPrice, parsedYearBought)) {
        res.status(400).json({error: 'Invalid car properties'});
        return;
    }
    //console.log(car);
    cars.push(newCar);
    saveCars();
    res.status(200).json(newCar);
});

router.delete('/deleteCar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = cars.map((e) => e.id).indexOf(id);
    //console.log(id);
    cars.splice(index, 1); //CARS will be replaced by cars  IF INDEX=-1 BREAK?
    saveCars();
    res.status(204);
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

    //req.body will return string
    const index = cars.findIndex((car) => car.id === id);
    cars[index] = updatedCar;
    console.log(updatedCar);
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

export default router;
