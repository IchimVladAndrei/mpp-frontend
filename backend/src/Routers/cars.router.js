import {Router} from 'express';
import {
    create,
    deleter,
    read,
    readById,
    updater,
} from '..//Models/car.model.js';
const router = Router();

export let cars = await read();

router.get('/', async (req, res) => {
    try {
        const myCars = await read();
        res.send(myCars);
    } catch (error) {
        res.status(500).json({error: 'Database err'});
    }
});

router.post('/addCar', async (req, res) => {
    const {brand, price, yearBought, dealer} = req.body;
    const parsedPrice = parseInt(price, 10);
    const parsedYearBought = parseInt(yearBought, 10);

    try {
        const newCar = await create(
            brand,
            parsedPrice,
            parsedYearBought,
            dealer,
        );
        res.status(200).json(newCar);
    } catch (error) {
        res.status(400).json({error: 'Invalid car properties'});
    }
});

router.delete('/deleteCar/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const rowsAffected = await deleter(id);
        const newList = await read();
        rowsAffected[0] !== 0
            ? res.status(204).json(newList)
            : res.status(403).send();
    } catch (error) {
        console.error('Error on delete player', error);
    }
});

router.put('/updateCar/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    const {brand, price, yearBought} = req.body;
    const parsedPrice = parseInt(price, 10);
    const parsedYearBought = parseInt(yearBought, 10);

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
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const parsedId = parseInt(id, 10);
    try {
        const [car, rowsAffected] = await readById(parsedId);
        rowsAffected !== 0
            ? res.send(car)
            : res.status(404).send({error: 'Car not found'});
    } catch (error) {
        console.error(`Error on getting the car no ${parsedId}`, error);
    }
});

// module.exports = router;
export default router;
