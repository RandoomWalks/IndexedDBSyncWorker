/// <reference lib="webworker" />

import { GSet } from '../GSet';

interface GSetPayload {
    id: string;
    item?: any;
    otherSetItems?: any[];
}

interface WorkerMessage {
    type: string;
    payload: GSetPayload;
}

let gDB: IDBDatabase | null = null; // Global reference to the IndexedDB instance
const sets: Map<string, GSet<any>> = new Map(); // Map to track GSet instances

// Function to open a connection to the IndexedDB
function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SynchronizationDB', 1);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('crdts')) {
                db.createObjectStore('crdts', { keyPath: 'id' });
            }
        };
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => reject(request.error);
    });
}

// Function to store a GSet in IndexedDB
function storeSet(db: IDBDatabase, id: string, gSet: GSet<any>): Promise<void> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['crdts'], 'readwrite');
        const store = transaction.objectStore('crdts');
        const request = store.put({ id, items: gSet.getItems() });

        transaction.onerror = (event) => {
            // More robust error handling for the transaction
            reject((event.target as IDBRequest).error);
        };

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Function to add an item to a GSet and store it in IndexedDB
function addToSet(db: IDBDatabase, id: string, item: any): Promise<void> {
    let gSet = sets.get(id) || new GSet<any>();
    gSet.add(item);
    sets.set(id, gSet);
    return storeSet(db, id, gSet);
}

// Function to merge another GSet with the existing GSet and store in IndexedDB
function mergeSets(db: IDBDatabase, id: string, otherSetItems: any[]): Promise<void> {
    let gSet = sets.get(id) || new GSet<any>();
    const otherSet = new GSet<any>(otherSetItems);
    gSet.merge(otherSet);
    sets.set(id, gSet);
    return storeSet(db, id, gSet);
}

// Function to retrieve items from a GSet
function getItems(id: string): any[] | undefined {
    let gSet = sets.get(id);
    return gSet ? gSet.getItems() : undefined;
}

// Initialization of the database connection
openDB().then(db => {
    gDB = db;
    // Event handler for messages received from the main thread
    self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
        // Ensure the database has been initialized before processing messages
        if (!gDB) {
            throw new Error('Database has not been initialized.');
        }
        // Process messages based on the specified type
        // 'add', 'merge', and 'getItems' represent different database operations
        const { type, payload } = e.data;
        try {
            switch (type) {
                case 'add':
                    // Handle the 'add' operation by adding an item to the GSet
                    await addToSet(gDB, payload.id, payload.item);
                    break;
                case 'merge':
                    if (payload.otherSetItems) {
                        // Pass `gDB` instead of `db`
                        await mergeSets(gDB, payload.id, payload.otherSetItems);
                    }
                    break;
                case 'getItems':
                    const items = getItems(payload.id);
                    // sends a message back to the main thread of the web page. 
                    // This message contains information about the items associated with the provided id. The message includes the type of message ('items'), the id, and the items themselves, retrieved using gSet.getItems().
                    self.postMessage({ type: 'items', id: payload.id, items });
                    break;
                default:
                    throw new Error('Unsupported operation type');
            }
        } catch (error: unknown) {
            // Error handling: propagate error message to main thread
            if (error instanceof Error) {
                console.error(error.message);
                self.postMessage({ type: 'error', error: error.message });
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };
}).catch(error => {
    // Handle database opening errors
    if (error instanceof Error) {
        self.postMessage({ type: 'error', error: error.message });
    } else {
        console.error('An unexpected error occurred while opening the database:', error);
    }
});