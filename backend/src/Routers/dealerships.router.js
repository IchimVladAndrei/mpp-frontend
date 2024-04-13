import {Router} from 'express';
import fs from 'fs';
const routerDealers = Router();
const filePath =
    'C:\\Users\\potat\\OneDrive\\Documents\\VisualCode\\MPP\\frontend\\backend\\src\\dealerships.json';
export let dealers = [];
try {
    const data = fs.readFileSync(filePath, 'utf8');
    dealers = JSON.parse(data);
    //console.log(cars);
} catch (error) {
    console.log('error while reading the file', error);
}

function saveDealers() {
    try {
        fs.writeFileSync(filePath, JSON.stringify(dealers, null, 4));
    } catch (error) {
        console('error while writing to file', error);
    }
}

routerDealers.get('/', (req, res) => {
    res.send(dealers);
});

routerDealers.post('/add', (req, res) => {
    const {name, location, review} = req.body;
    const parsedReviews = parseFloat(review, 10);
    //to fix precision
    const uniqueId = dealers.length ? dealers[dealers.length - 1].id + 1 : 1;
    const newDealer = {
        id: uniqueId,
        name,
        location,
        reviews: parsedReviews,
    };
    if (!checkPropsDealer(name, location, parsedReviews)) {
        res.status(400).json({error: 'Invalid dealer properties'});
        return;
    }
    dealers.push(newDealer);
    saveDealers();
    res.status(200).json(newDealer);
});

routerDealers.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = dealers.map((e) => e.id).indexOf(id);
    //console.log(id);
    if (index === -1) {
        res.status(403);
        res.send();
        return;
    }
    dealers.splice(index, 1);
    saveDealers();
    res.status(204);
    res.json(dealers);
});

routerDealers.put('/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const {name, location, reviews} = req.body;
    const parsedReviews = parseFloat(reviews);
    const updatedDealer = {
        id: id,
        name,
        location,
        reviews: parsedReviews,
    };
    const index = dealers.findIndex((dealer) => dealer.id === id);
    if (index === -1) {
        res.status(401).json({error: 'Dealer to update is missing'});
        return;
    }
    dealers[index] = updatedDealer;
    saveDealers();
    res.status(200).json(updatedDealer);
});

routerDealers.get('/:id', (req, res) => {
    const {id} = req.params;
    const dealer = dealers.find((dealer) => dealer.id === parseInt(id));
    if (dealer === null || dealer === undefined) {
        res.status(404).send({error: 'Dealer not found'});
        return;
    }
    res.send(dealer);
});

const checkPropsDealer = (name, location, reviews) => {
    if (name.length < 3) return false;
    if (location.length < 3) return false;

    if (reviews < 1) return false;
    return !dealers.some(
        (dealer) =>
            dealer.name === name &&
            dealer.location === location &&
            dealer.reviews === reviews,
    );
};

export default routerDealers;
