const request = require('supertest');
// const app = require('../server/server'); // Adjust the path to where your server instance is defined
const app = require('./index').default;


describe('API Integration Tests', () => {
  it('GET /api/data should return data', async () => {
    const response = await request(app).get('/api/data');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully fetched data");
    expect(response.body.data).toEqual(expect.arrayContaining(["Item1", "Item2"]));
  });
});


