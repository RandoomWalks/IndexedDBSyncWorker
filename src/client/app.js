document.addEventListener('DOMContentLoaded', () => {
    const messageDiv = document.getElementById('message');
    const worker = new Worker('dist/dbWorker.js');
    const indexedDBManager = new IndexedDBManager(worker);

    // Event listener for adding an item
    document.getElementById('addItemForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const setName = 'exampleSet'; // Should be dynamic based on application's needs
        const itemName = document.getElementById('itemName').value.trim();
        const itemValue = document.getElementById('itemValue').value.trim();
        indexedDBManager.addItemToSet(setName, { name: itemName, value: itemValue });
        displayMessage('Adding item...');
    });

    // Event listener for getting items
    document.getElementById('getItemButton').addEventListener('click', function() {
        const setName = 'exampleSet'; // Should be dynamic based on application's needs
        indexedDBManager.getItemsFromSet(setName);
        displayMessage('Fetching items...');
    });

    // Event listener for worker messages
    indexedDBManager.onMessage((data) => {
        if (data.type === 'items') {
            displayMessage(`Items: ${JSON.stringify(data.items)}`);
        } else if (data.type === 'error') {
            displayMessage(`Error: ${data.error}`, true);
        }
    });

    function displayMessage(message, isError = false) {
        messageDiv.textContent = message;
        if (isError) {
            messageDiv.classList.add('error'); // Define the 'error' class in CSS
        } else {
            messageDiv.classList.remove('error');
        }
    }
});
