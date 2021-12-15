import server from '../src/index';
import request from 'supertest';

describe('Application Entry', () => {
        test('Should display app entry welcome message', async () => {
                const response = await request(server).get('/').expect(200);
                expect(response.body.data.message).toEqual('Stock data API here for you!');
        });

        test('Should display a message for invalid route paths', async () => {
                const response = await request(server).get('/task').expect(404);
                expect(response.body.status).toBe('fail');
                expect(response.body.error).toBe('Unable to find the requested endpoint url.');
        });
});

afterEach(() => {
        server.close();
});
