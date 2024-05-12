const nock = require('nock');
const request = require('supertest');
const app = require('../server');

describe('External API Interaction', () => {
    it('should handle external API failure gracefully', async () => {
        nock('https://api.external.com')
            .get('/data')
            .reply(500, { message: 'Error' });

        const response = await request(app).get('/route-that-calls-external-api');
        expect(response.status).toBe(500);
    });
});
