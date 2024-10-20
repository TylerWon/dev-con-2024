const request = require('supertest');

const app = require('../app');
const database = require('../database');

describe('/items/:name', () => {
    const ROUTE = '/items';
    const APPLE = { name: 'apple', price: 1.99, quantity: 100 };

    beforeAll(async () => {
        await database.none('TRUNCATE item');
        await database.none('INSERT INTO item (name, price, quantity) VALUES($1, $2, $3)', [APPLE.name, APPLE.price, APPLE.quantity]);
    })

    it('should return 200 if the item is found', async () => {
        const response = await request(app).get(`${ROUTE}/apple`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(APPLE);
    });

    it('should return 404 if the item is not found', async () => {
        const response = await request(app).get(`${ROUTE}/banana`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Item not found' });
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(database, 'oneOrNone').mockImplementation(() => { throw new Error('Database error') });

        const response = await request(app).get(`${ROUTE}/apple`);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Database error' });
    });
})
