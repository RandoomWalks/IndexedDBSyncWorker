// document.addEventListener('DOMContentLoaded', () => {
//     const worker = new Worker('worker.js');
//     const messageDiv = document.getElementById('message');

//     document.getElementById('addItemForm').addEventListener('submit', function(event) {
//         event.preventDefault();
//         const itemName = document.getElementById('itemName').value.trim();
//         const itemValue = document.getElementById('itemValue').value.trim();

//         worker.postMessage({ type: 'add', item: { name: itemName, value: itemValue } });
//         displayMessage('Adding item...');
//     });

//     document.getElementById('getItemButton').addEventListener('click', function() {
//         const itemId = document.getElementById('itemId').value.trim();
//         worker.postMessage({ type: 'get', id: itemId });
//         displayMessage('Fetching item...');
//     });

//     worker.onmessage = function(e) {
//         displayMessage(e.data);
//     };

//     function displayMessage(message) {
//         messageDiv.textContent = message;
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    const worker = new Worker('dist/dbWorker.js');
    const messageDiv = document.getElementById('message');

    document.getElementById('addItemForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const setName = 'exampleSet'; // should be dynamic based on application's needs
        const itemName = document.getElementById('itemName').value.trim();
        const itemValue = document.getElementById('itemValue').value.trim();

        // Send the 'add' message to the worker with correct payload structure
        worker.postMessage({ type: 'add', payload: { id: setName, item: { name: itemName, value: itemValue } } });
        displayMessage('Adding item...');
    });

    document.getElementById('getItemButton').addEventListener('click', function() {
        const setName = 'exampleSet'; // should be dynamic based on application's needs
        worker.postMessage({ type: 'getItems', payload: { id: setName } });
        displayMessage('Fetching items...');
    });

    worker.onmessage = function(e) {
        // Update to handle different types of messages
        if(e.data.type === 'items') {
            displayMessage(`Items: ${JSON.stringify(e.data.items)}`);
        } else if(e.data.type === 'error') {
            displayMessage(`Error: ${e.data.error}`, true);
        }
    };

    function displayMessage(message, isError = false) {
        messageDiv.textContent = message;
        if(isError) {
            messageDiv.classList.add('error'); // define the 'error' class in CSS
        } else {
            messageDiv.classList.remove('error');
        }
    }
});
