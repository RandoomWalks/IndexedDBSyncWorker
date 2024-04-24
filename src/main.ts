// Worker is being created and expected to be found in the `dist` directory.
const dbWorker = new Worker('../dist/dbWorker.js');

// Event handler for messages received from the worker.
dbWorker.onmessage = (event: MessageEvent) => {
    // Check if the message is of type 'items' and log the items received from the worker.
    if (event.data.type === 'items') {
        console.log(`Items in set ${event.data.id}:`, event.data.items);
    }
};

// Post a message to the worker to add an item to the G-Set with the given ID.
dbWorker.postMessage({ type: 'add', payload: { id: 'exampleSet', item: 'Hello' } });

// Post a message to the worker to retrieve items from the G-Set with the given ID.
dbWorker.postMessage({ type: 'getItems', payload: { id: 'exampleSet' } });
