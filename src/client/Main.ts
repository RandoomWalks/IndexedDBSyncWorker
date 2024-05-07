// IndexedDBManager manages communication with the web worker responsible for IndexedDB operations. This setup allows main thread to interact with IndexedDB through the web worker

// Define a type for messages that are sent to the worker
type WorkerMessageType = 'add' | 'getItems';

// Define the structure for messages sent to the worker
interface WorkerMessage {
    type: WorkerMessageType;
    payload: { id: string; item?: string };
}

export class IndexedDBManager {
    private dbWorker: Worker;

    constructor(worker: Worker) {
        this.dbWorker = worker;
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

// Create an instance of the IndexedDBManager
//  path needs to be relative to the location where your HTML file is served from,  not necessarily the directory structure on your server or development environment.
const indexedDBManager = new IndexedDBManager(new Worker('dbWorker.bundle.js'));
// const indexedDBManager = new IndexedDBManager(new Worker('worker/IndexedDBWorker.ts'));

// Use the IndexedDBManager instance to interact with the web worker
indexedDBManager.addItemToSet('exampleSet', 'Hello');
indexedDBManager.getItemsFromSet('exampleSet');
