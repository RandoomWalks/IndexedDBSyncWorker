// Define a type for messages that are sent to the worker
type WorkerMessageType = 'add' | 'getItems';

// Define the structure for messages sent to the worker
interface WorkerMessage {
    type: WorkerMessageType;
    payload: { id: string; item?: string };
}

class DBWorkerManager {
    private dbWorker: Worker;

    constructor(workerPath: string) {
        this.dbWorker = new Worker(workerPath);
        this.setupMessageHandler();
    }

    // Setup the event handler for messages received from the worker
    private setupMessageHandler() {
        this.dbWorker.onmessage = (event: MessageEvent) => {
            if (event.data.type === 'items') {
                console.log(`Items in set ${event.data.id}:`, event.data.items);
            }
        };
    }

    // Send a message to the worker to add an item to the G-Set
    addItemToSet(setId: string, item: string) {
        const message: WorkerMessage = { type: 'add', payload: { id: setId, item } };
        this.dbWorker.postMessage(message);
    }

    // Send a message to the worker to retrieve items from the G-Set
    getItemsFromSet(setId: string) {
        const message: WorkerMessage = { type: 'getItems', payload: { id: setId } };
        this.dbWorker.postMessage(message);
    }
}

// Create an instance of the DBWorkerManager
const dbWorkerManager = new DBWorkerManager('dbWorker.bundle.js');

// Use the DBWorkerManager instance to interact with the web worker
dbWorkerManager.addItemToSet('exampleSet', 'Hello');
dbWorkerManager.getItemsFromSet('exampleSet');