const request = require('supertest');
// const app = require('../server/server'); // Adjust the path to where your server instance is defined
const app = require('./index').default;

// someTest.test.ts
console.log("Testing access to global types...");
console.log("Type of global Worker:", typeof global.Worker);


describe('API Integration Tests', () => {
  it('GET /api/data should return data', async () => {
    const response = await request(app).get('/api/data');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully fetched data");
    expect(response.body.data).toEqual(expect.arrayContaining(["Item1", "Item2"]));
  });
});


