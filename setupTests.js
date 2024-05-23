// setupTests.js
// global.Worker = require('./__mocks__/Worker');
console.log("Initializing test environment...");

// global.Worker = jest.fn(() => ({
//     postMessage: jest.fn(),
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//     terminate: jest.fn()
// }));

// setupTests.js
global.Worker = jest.fn().mockImplementation(() => ({
    postMessage: jest.fn(),
    terminate: jest.fn(),
    addEventListener: jest.fn((eventName, handler) => {
        if (eventName === 'message') {
            this.onmessage = handler;
        } else if (eventName === 'error') {
            this.onerror = handler;
        }
    }),
    removeEventListener: jest.fn(),
}));

console.log("Mock Worker setup completed.");


console.log("Mock Worker set globally:", global.Worker);
console.log("PostMessage function:", new global.Worker().postMessage);

Worker.prototype = Object.create(global.Worker.prototype);
console.log("Worker prototype configured.");
