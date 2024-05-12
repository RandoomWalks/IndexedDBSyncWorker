export class IndexedDBManager {
    private dbWorker: Worker;
    private messageHandler!: (error: any) => void;
    private errorHandler!: (error: any) => void;
    private itemsReceivedHandler!: (items: any, setId: string) => void;

    // onmessage: (event: MessageEvent) => void;

    constructor(worker: Worker) {
        this.dbWorker = worker;
        this.setupMessageHandler();
        console.debug("IndexedDBManager initialized with worker.");
    }

    private setupMessageHandler() {
        this.dbWorker.onmessage = (event: MessageEvent) => {
            console.debug(`Received message from worker:`, event.data);
            // Handle different types of messages
            switch (event.data.type) {
                case 'items':
                    console.log(`Items in set ${event.data.id}:`, event.data.items);
                    if (this.itemsReceivedHandler) {
                        this.itemsReceivedHandler?.(event.data.items, event.data.id);
                    }
                    break;
                case 'merge':
                    console.log(`Merge result for set ${event.data.id}:`, event.data.mergeRes);
                    break;
                case 'added':
                    console.log(`Addition confirmed for set ${event.data.id}`);
                    break;
                case 'error':
                    if (this.errorHandler) {
                        this.errorHandler?.(event.data.error);
                    }
                    break;
            }
        };

        this.dbWorker.onerror = (event: ErrorEvent) => {
            console.error("Error from worker:", event.message);
            if (this.errorHandler) {
                this.errorHandler(event.error);
            }
        };
    }

    // Public method to set a custom error handler
    onError(handler: (error: any) => void) {
        this.errorHandler = handler;
    }
    // Public method to set a custom error handler
    onMessage(handler: (error: any) => void) {
        this.messageHandler = handler;
    }

    
    // Public method to set a custom handler for received items
    onItemsReceived(handler: (items: any, setId: string) => void) {
        this.itemsReceivedHandler = handler;
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
