// module.exports = function () {
//     this.postMessage = jest.fn();
//     this.terminate = jest.fn();
//     this.addEventListener = jest.fn((eventName, eventHandler) => {
//         if (eventName === 'message') {
//             this.onmessage = eventHandler;
//         }
//         if (eventName === 'error') {
//             this.onerror = eventHandler;
//         }
//     });
//     return this;  // Ensure return this mock instance
// };


// Mock Worker as an ES Module
export default function () {
    this.postMessage = jest.fn();
    this.terminate = jest.fn();
    this.addEventListener = jest.fn((eventName, eventHandler) => {
        if (eventName === 'message') {
            this.onmessage = eventHandler;
        }
        if (eventName === 'error') {
            this.onerror = eventHandler;
        }
    });
    return this;
};
