// The IndexedDBManager class encapsulates communication with a web worker to manage IndexedDB operations.
// Utilizes the delegation pattern by offloading database operations to a worker, promoting non-blocking UI operations.
export class IndexedDBManager {
    private dbWorker: Worker;
    private messageHandler!: (error: any) => void;
    private errorHandler!: (error: any) => void;
    private itemsReceivedHandler!: (items: any, setId: string) => void;

    // Constructor initializes the IndexedDBManager with a web worker, setting up message and error handling.
    constructor(worker: Worker) {
        this.dbWorker = worker; // Holds the reference to the web worker used for database tasks.
        this.setupMessageHandler(); // Configures message and error handling on the worker.
        console.debug("IndexedDBManager initialized with worker.");
    }

    // Sets up handlers for messages and errors coming from the web worker.
    private setupMessageHandler() {
        // Message handler for processing results from the worker.
        this.dbWorker.onmessage = (event: MessageEvent) => {
            console.debug(`Received message from worker:`, event.data);
            // Switch-case to handle different types of messages from the worker.
            switch (event.data.type) {
                case 'items':
                    // Handles receiving items from the database, calls registered handler.
                    console.log(`Items in set ${event.data.id}:`, event.data.items);
                    this.itemsReceivedHandler?.(event.data.items, event.data.id);
                    break;
                case 'merge':
                    // Handles results from a merge operation in the database.
                    console.log(`Merge result for set ${event.data.id}:`, event.data.mergeRes);
                    break;
                case 'added':
                    // Confirmation that an item was successfully added.
                    console.log(`Addition confirmed for set ${event.data.id}`);
                    break;
                case 'error':
                    // Propagates errors from the worker to the registered error handler.
                    this.errorHandler?.(event.data.error);
                    break;
            }
        };

        // Error handler captures any errors thrown by the web worker itself.
        this.dbWorker.onerror = (event: ErrorEvent) => {
            console.error("Error from worker:", event.message);
            this.errorHandler?.(event.error); // Calls the error handler with the error.
        };
    }

    // Allows external clients to register a custom error handler.
    onError(handler: (error: any) => void) {
        this.errorHandler = handler;
    }

    // Allows external clients to register a custom handler for received messages (currently not used in this snippet).
    onMessage(handler: (error: any) => void) {
        this.messageHandler = handler;
    }

    // Allows external clients to register a handler for processing received items.
    onItemsReceived(handler: (items: any, setId: string) => void) {
        this.itemsReceivedHandler = handler;
    }

    // Sends a message to the worker to add an item to a specific set in IndexedDB.
    addItemToSet(setId: string, item: string) {
        const message = { type: 'add', payload: { id: setId, item } };
        this.dbWorker.postMessage(message);
        console.debug(`Sending 'add' message to worker for set ${setId} with item:`, item);
    }

    // Sends a message to the worker to fetch items from a specific set in IndexedDB.
    getItemsFromSet(setId: string) {
        const message = { type: 'getItems', payload: { id: setId } };
        this.dbWorker.postMessage(message);
        console.debug(`Sending 'getItems' message to worker for set ${setId}`);
    }
}
