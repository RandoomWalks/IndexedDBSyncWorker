// IndexedDBManager manages communication with the web worker responsible for IndexedDB operations. This setup allows main thread to interact with IndexedDB through the web worker
import { App } from './App';


export class IndexedDBManager {
    private dbWorker: Worker;

    constructor(worker: Worker) {
        this.dbWorker = worker;
        this.setupMessageHandler();
        console.debug("IndexedDBManager initialized with worker.");
    }

    private setupMessageHandler() {
        this.dbWorker.onmessage = (event: MessageEvent) => {
            console.debug(`Received message from worker:`, event.data);
            if (event.data.type === 'items') {
                console.log(`Items in set ${event.data.id}:`, event.data.items);
            } else if (event.data.type === 'merge') {
                console.log(`Merge result for set ${event.data.id}:`, event.data.mergeRes);
            } else if (event.data.type === 'added') {
                console.log(`Addition confirmed for set ${event.data.id}`);
            }
        };
    }
    // Public method to allow clients to provide their own message handler
    onMessage(handler: (event: MessageEvent) => void) {
        this.dbWorker.onmessage = handler;
    }

    addItemToSet(setId: string, item: string) {
        const message = { type: 'add', payload: { id: setId, item } };
        this.dbWorker.postMessage(message);
        console.debug(`Sending 'add' message to worker for set ${setId} with item:`, item);
    }

    getItemsFromSet(setId: string) {
        const message = { type: 'getItems', payload: { id: setId } };
        this.dbWorker.postMessage(message);
        console.debug(`Sending 'getItems' message to worker for set ${setId}`);
    }
}

// Create an instance of the IndexedDBManager
//  path needs to be relative to the location where your HTML file is served from,  not necessarily the directory structure on your server or development environment.

document.addEventListener('DOMContentLoaded', () => {

    // Instantiate the app when the DOM is fully loaded
    // document.addEventListener('DOMContentLoaded', () => new App());

    new App();  // Start the application

    const worker = new Worker('dbWorker.bundle.js');
    const indexedDBManager = new IndexedDBManager(worker);
    indexedDBManager.addItemToSet('exampleSet', 'Hello');
    // indexedDBManager.getItemsFromSet('exampleSet');
});