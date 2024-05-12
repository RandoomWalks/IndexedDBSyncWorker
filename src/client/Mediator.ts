// Mediator.ts
import { IndexedDBManager } from './IndexedDBManager';

export class Mediator {
    private dbManager: IndexedDBManager;

    constructor() {
        const worker = new Worker('dbWorker.bundle.js');
        console.log('Initializing Mediator...');
        this.dbManager = new IndexedDBManager(worker);

        // Listen to worker events and handle them
        this.dbManager.onError(this.handleError);
        this.dbManager.onItemsReceived(this.handleItemsReceived);
    }

    addItemToSet(setId: string, item: string) {
        console.log(`Adding item "${item}" to set "${setId}"`);
        this.dbManager.addItemToSet(setId, item);
    }

    getItemsFromSet(setId: string) {
        console.log(`Fetching items from set "${setId}"`);
        this.dbManager.getItemsFromSet(setId);
    }

    private handleItemsReceived = (items: any, setId: string) => {
        console.log(`Received items from set "${setId}":`, items);
        document.dispatchEvent(new CustomEvent('itemsReceived', { detail: { items, setId } }));
    }

    private handleError = (error: any) => {
        console.error('An error occurred in the Mediator:', error);
        document.dispatchEvent(new CustomEvent('errorOccurred', { detail: error }));
    }
}
