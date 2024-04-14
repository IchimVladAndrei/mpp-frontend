import request from 'supertest';
import app, {closeServer} from '../src/server';
describe('GetAll', () => {
    afterAll(async () => {
        await closeServer();
    });
    it('should test getAllDealers', async () => {
        const res = await request(app).get('/api/dealers');
        expect(res.statusCode).toEqual(200);
        const dealers = res.body;
        expect(dealers).toBeDefined();
        expect(Array.isArray(dealers)).toBeTruthy();
        expect(dealers.length).toBeGreaterThan(0);
        dealers.forEach((element) => {
            expect(element).toHaveProperty('id');
            expect(element).toHaveProperty('name');
            expect(element).toHaveProperty('location');
            expect(element).toHaveProperty('reviews');
            expect(typeof element.id).toBe('number');
            expect(typeof element.name).toBe('string');
            expect(typeof element.location).toBe('string');
            expect(typeof element.reviews).toBe('number');
        });
    });
});
describe('AddDealer', () => {
    const dealerToAdd = {
        name: 'SomeDealership',
        location: 'SomePlace',
        reviews: 1.1,
    };
    it('should return the added dealer', async () => {
        const res = await request(app)
            .post('/api/dealers/add')
            .send(dealerToAdd);
        const res2 = await request(app).get('/api/dealers');
        expect(res2.statusCode).toEqual(200);
        const dealers = res2.body;
        expect(dealers).toBeDefined();
        expect(Array.isArray(dealers)).toBeTruthy();
        expect(dealers.length).toBeGreaterThan(0);
        const addedDealer = dealers.find((dealer) => dealer.id === res.body.id);
        expect(addedDealer).toEqual({
            id: expect.any(Number),
            name: 'SomeDealership',
            location: 'SomePlace',
            reviews: 1.1,
        });
    });

    it('should return 400 because invalid Dealer', async () => {
        const invalidDealer = {
            name: 'a',
            location: 'b',
            reviews: 0,
        };
        const res2 = await request(app).get('/api/dealers');
        expect(res2.statusCode).toEqual(200);
        const dealers = res2.body;
        expect(dealers).toBeDefined();
        expect(Array.isArray(dealers)).toBeTruthy();
        const res = await request(app)
            .post('/api/dealers/add')
            .send(invalidDealer);
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Invalid dealer properties');
        const res3 = await request(app).get('/api/dealers');
        expect(res3.statusCode).toEqual(200);
        const dealers2 = res3.body;
        expect(dealers2).toBeDefined();
        expect(Array.isArray(dealers2)).toBeTruthy();
        expect(dealers2.length).toEqual(dealers.length);
    });

    it('should stop adding same Dealer', async () => {
        //same dealer will be added because new ID is generated

        const res2 = await request(app).get('/api/dealers');
        expect(res2.statusCode).toEqual(200);
        const dealers = res2.body;
        expect(dealers).toBeDefined();
        expect(Array.isArray(dealers)).toBeTruthy();
        const res = await request(app)
            .post('/api/dealers/add')
            .send(dealerToAdd);
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Invalid dealer properties');
        const res3 = await request(app).get('/api/dealers');
        expect(res3.statusCode).toEqual(200);
        const dealers2 = res3.body;
        expect(dealers2).toBeDefined();
        expect(Array.isArray(dealers2)).toBeTruthy();
        expect(dealers2.length).toEqual(dealers.length);
    });
});

describe('Update Dealer', () => {
    const dealerToUpdate = {
        name: 'AnotherDealership',
        location: 'AnotherPlace',
        reviews: 4.9,
    };
    it('should update the dealer if index found', async () => {
        const res0 = await request(app).get('/api/dealers');
        const dealersBeforeUpdate = res0.body;
        const res = await request(app)
            .put('/api/dealers/update/12') //waht index
            .send(dealerToUpdate);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            id: 12, //correctid
            name: 'AnotherDealership',
            location: 'AnotherPlace',
            reviews: 4.9,
        });
        const res2 = await request(app).get('/api/dealers');
        const dealersAfterUpdate = res2.body;
        const updatedDealer = dealersAfterUpdate.find(
            (dealer) => dealer.id === 12,
        );
        expect(updatedDealer).toEqual({
            id: 12,
            name: 'AnotherDealership',
            location: 'AnotherPlace',
            reviews: 4.9,
        });
        dealersBeforeUpdate.forEach((dealer) => {
            if (dealer.id !== 12) {
                const theDealerAfterUpdate = dealersAfterUpdate.find(
                    (item) => item.id === dealer.id,
                );
                expect(theDealerAfterUpdate).toEqual(dealer);
            }
        });
    });
    it('should not update a dealer', async () => {
        const res = await request(app)
            .put('/api/dealers/update/1222')
            .send(dealerToUpdate);
        expect(res.statusCode).toEqual(401);
        expect(res.body.error).toEqual('Dealer to update is missing');
    });
});
describe('getDealer', () => {
    afterAll(async () => {
        await closeServer();
    });
    it('should getDealer', async () => {
        const res = await request(app).get('/api/dealers/11');
        expect(res.body).toEqual(
            expect.objectContaining({
                id: 11,
                name: 'Tiriac Auto', //DATELE DIN TABLE
                location: 'Ilfov',
                reviews: 4.1,
            }),
        );
        expect(res.body.error).toBeUndefined();
    });
    it('should return 404 if dealer with the specified id is not found', async () => {
        const res = await request(app).get('/api/dealers/10000');

        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toEqual('Dealer not found');
    });
});

describe('deleteDealer', () => {
    it('should getStatus204', async () => {
        const res0 = await request(app).get('/api/dealers');
        const dealersBeforeDelete = res0.body;

        const res = await request(app).delete('/api/dealers/delete/13');
        expect(res.statusCode).toEqual(204);
        const res2 = await request(app).get('/api/dealers');
        const dealersAfterDelete = res2.body;
        const deletedDealer = dealersAfterDelete.find(
            (dealer) => dealer.id === 13,
        );
        expect(deletedDealer).toBeUndefined();
        expect(dealersBeforeDelete.length - dealersAfterDelete.length).toEqual(
            1,
        );
    });
    it('should getStatus403', async () => {
        const res0 = await request(app).get('/api/dealers');
        const dealersBeforeDelete = res0.body;
        const res = await request(app).delete('/api/dealers/delete/999');
        expect(res.statusCode).toEqual(403);
        const res2 = await request(app).get('/api/dealers');
        const dealersAfterDelete = res2.body;
        expect(dealersBeforeDelete.length - dealersAfterDelete.length).toEqual(
            0,
        );
    });
    afterAll(async () => {
        await request(app)
            .put('/api/dealers/update/12')
            .send({name: 'nume', location: 'locatie', reviews: 2.5});
    });
});
