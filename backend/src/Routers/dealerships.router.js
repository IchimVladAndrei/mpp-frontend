import {Router} from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {carByDID} from '../Models/car.model.js';
import {
    create,
    deleter,
    paginateDealers,
    read,
    readById,
    updater,
} from '../Models/dealership.model.js';

const routerDealers = Router();

routerDealers.get('/', async (req, res) => {
    try {
        const dealers = await read();
        res.send(dealers);
    } catch (error) {
        res.status(500).json({error: 'Database err'});
    }
});

routerDealers.get('/fetch/:id/cars', async (req, res) => {
    try {
        const page = req.query.page;
        const did = req.params.id;
        const pagedDealers = await paginateDealers(did, page);
        //if we get no records there is nothing more to display
        res.status(200).json(pagedDealers);
    } catch (error) {
        res.status(500).json({error: 'Database err'});
    }
});

routerDealers.post('/add', async (req, res) => {
    const {name, location, reviews} = req.body;

    const parsedReviews = parseFloat(reviews, 10);
    try {
        const newDealer = await create(name, location, parsedReviews);

        res.status(200).json(newDealer);
    } catch (error) {
        res.status(400).json({error: 'Invalid dealer properties'});
    }
});

routerDealers.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, rAffected] = await carByDID(id);

        if (rAffected === 0) {
            const rowsAffected = await deleter(id);
            const newList = await read();
            rowsAffected[0] !== 0
                ? res.status(204).json(newList)
                : res.status(403).send();
        } else res.status(505).send();
    } catch (error) {
        console.error('Error on delete player', error);
    }
});

routerDealers.put('/update/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const {name, location, reviews} = req.body;
    const parsedReviews = parseFloat(reviews);
    try {
        const [updatedDealer, rowsAffected] = await updater(
            id,
            name,
            location,
            parsedReviews,
        );
        rowsAffected[0] !== 0
            ? res.status(200).json(updatedDealer)
            : res.status(401).json({error: 'Dealer to update is missing'});
    } catch (error) {
        console.error('Error on update dealer', error);
    }
});

routerDealers.get('/:id', async (req, res) => {
    const {id} = req.params;
    const parsedId = parseInt(id, 10);
    try {
        const [dealer, rowsAffected] = await readById(parsedId);
        rowsAffected !== 0
            ? res.send(dealer)
            : res.status(404).send({error: 'Dealer not found'});
    } catch (error) {
        console.error(`Error on getting the dealer no ${parsedId}`, error);
    }
});

export default routerDealers;
