// setupTests.js
// global.Worker = require('./__mocks__/Worker');
global.Worker = jest.fn(() => ({
    postMessage: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    terminate: jest.fn()
}));



Worker.prototype = Object.create(global.Worker.prototype);
