import {Router} from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
    create,
    deleter,
    read,
    readById,
    updater,
} from '../Models/dealership.model.js';
const routerDealers = Router();
// const filePath =
//     'C:\\Users\\potat\\OneDrive\\Documents\\VisualCode\\MPP\\frontend\\backend\\src\\dealerships.json';
// export let dealers = [];
// try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     dealers = JSON.parse(data);
//     //console.log(cars);
// } catch (error) {
//     console.log('error while reading the file', error);
// }

// function saveDealers() {
//     try {
//         fs.writeFileSync(filePath, JSON.stringify(dealers, null, 4));
//     } catch (error) {
//         console('error while writing to file', error);
//     }
// }

routerDealers.get('/', async (req, res) => {
    try {
        const dealers = await read();
        res.send(dealers);
    } catch (error) {
        console.error('Error on retriever cars', error);
        res.status(500).json({error: 'Database err'});
    }
});

routerDealers.post('/add', async (req, res) => {
    const {name, location, review} = req.body;
    const parsedReviews = parseFloat(review, 10);
    //to fix precision
    // const uniqueId = dealers.length ? dealers[dealers.length - 1].id + 1 : 1;
    // const newDealer = {
    //     id: uniqueId,
    //     name,
    //     location,
    //     reviews: parsedReviews,
    // };
    // if (!checkPropsDealer(name, location, parsedReviews)) {
    //     res.status(400).json({error: 'Invalid dealer properties'});
    //     return;
    // }
    try {
        const newDealer = await create(name, location, parsedReviews);
        res.status(200).json(newDealer);
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'Invalid dealer properties'});
    }

    // dealers.push(newDealer);
    // saveDealers();
});

routerDealers.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    // const index = dealers.map((e) => e.id).indexOf(id);
    // //console.log(id);
    // if (index === -1) {
    //     res.status(403);
    //     res.send();
    //     return;
    // }
    // dealers.splice(index, 1);
    // saveDealers();
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
});

routerDealers.put('/update/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const {name, location, reviews} = req.body;
    const parsedReviews = parseFloat(reviews);
    // const updatedDealer = {
    //     id: id,
    //     name,
    //     location,
    //     reviews: parsedReviews,
    // };
    // const index = dealers.findIndex((dealer) => dealer.id === id);
    // if (index === -1) {
    //     res.status(401).json({error: 'Dealer to update is missing'});
    //     return;
    // }
    try {
        const [updatedDealer, rowsAffected] = await updater(
            id,
            name,
            location,
            parsedReviews,
        );
        rowsAffected[0] !== 0
            ? res.status(200).json(updatedDealer)
            : res.status(401).json({error: 'Car to update is missing'});
    } catch (error) {
        console.error('Error on update dealer', error);
    }
    // dealers[index] = updatedDealer;
    // saveDealers();
    // res.status(200).json(updatedDealer);
});

routerDealers.get('/:id', async (req, res) => {
    const {id} = req.params;
    const parsedId = parseInt(id, 10);
    // const dealer = dealers.find((dealer) => dealer.id === parseInt(id));
    // if (dealer === null || dealer === undefined) {
    //     res.status(404).send({error: 'Dealer not found'});
    //     return;
    // }
    try {
        const [dealer, rowsAffected] = await readById(parsedId);
        rowsAffected !== 0
            ? res.send(dealer)
            : res.status(404).send({error: 'Dealer not found'});
    } catch (error) {
        console.error(`Error on getting the dealer no ${parsedId}`, error);
    }
    // res.send(dealer);
});

// const checkPropsDealer = (name, location, reviews) => {
//     if (name.length < 3) return false;
//     if (location.length < 3) return false;

//     if (reviews < 1) return false;
//     return !dealers.some(
//         (dealer) =>
//             dealer.name === name &&
//             dealer.location === location &&
//             dealer.reviews === reviews,
//     );
// };

export default routerDealers;
