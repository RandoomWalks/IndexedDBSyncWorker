// Mediator.ts
// The Mediator class serves as a communication bridge between the UI layer and the data management layer handled by IndexedDBManager.
// It uses the Mediator design pattern to centralize complex communications and control flows between various components, 
// thus decoupling systems and enhancing flexibility and scalability.

import { IndexedDBManager } from './IndexedDBManager';

export class Mediator {
    private dbManager: IndexedDBManager; // Manages interactions with the IndexedDB through a web worker.

    constructor() {
        const worker = new Worker('dbWorker.bundle.js'); // Initializes a web worker for background database operations.
        console.log('Initializing Mediator...');
        this.dbManager = new IndexedDBManager(worker);

        // Register event handlers for errors and data reception from IndexedDBManager.
        this.dbManager.onError(this.handleError);
        this.dbManager.onItemsReceived(this.handleItemsReceived);
    }

    // Public method to add an item to a set within the IndexedDB.
    addItemToSet(setId: string, item: string) {
        console.log(`Adding item "${item}" to set "${setId}"`);
        this.dbManager.addItemToSet(setId, item); // Delegate the add operation to the dbManager.
    }

    // Public method to fetch items from a specified set within the IndexedDB.
    getItemsFromSet(setId: string) {
        console.log(`Fetching items from set "${setId}"`);
        this.dbManager.getItemsFromSet(setId); // Delegate the fetch operation to the dbManager.
    }

    // Private method to handle 'itemsReceived' events from the IndexedDBManager.
    // It dispatches a custom event on the document to notify other components of the application.
    private handleItemsReceived = (items: any, setId: string) => {
        console.log(`Received items from set "${setId}":`, items);
        document.dispatchEvent(new CustomEvent('itemsReceived', { detail: { items, setId } }));
    }

    // Private method to handle error events from the IndexedDBManager.
    // It dispatches a custom event on the document to notify other parts of the application about the error.
    private handleError = (error: any) => {
        console.error('An error occurred in the Mediator:', error);
        document.dispatchEvent(new CustomEvent('errorOccurred', { detail: error }));
    }
}
