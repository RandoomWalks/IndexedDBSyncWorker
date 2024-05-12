// Mediator.ts
import { IndexedDBManager } from './IndexedDBManager';

export class Mediator {
    private dbManager: IndexedDBManager;

    constructor() {
        const worker = new Worker('dbWorker.bundle.js');
        this.dbManager = new IndexedDBManager(worker);

        // Listen to worker events and handle them
        this.dbManager.onError(this.handleError);
        this.dbManager.onItemsReceived(this.handleItemsReceived);
    }

    addItemToSet(setId: string, item: string) {
        this.dbManager.addItemToSet(setId, item);
    }

    getItemsFromSet(setId: string) {
        this.dbManager.getItemsFromSet(setId);
    }

    private handleItemsReceived = (items: any, setId: string) => {
        document.dispatchEvent(new CustomEvent('itemsReceived', { detail: { items, setId } }));
    }

    private handleError = (error: any) => {
        document.dispatchEvent(new CustomEvent('errorOccurred', { detail: error }));
    }
}
