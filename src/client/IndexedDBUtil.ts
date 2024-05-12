import { Service } from "typedi";
import { GSet } from './GSet';

interface Item {
    id?: number;
    content: string;
    lastModified: string;
    syncStatus: 'pending' | 'synced';
}

class IndexedDBUtil {
    private static instance: IndexedDBUtil;
    private dbPromise: Promise<IDBDatabase>;

    private constructor() {
        console.debug("Initializing IndexedDBUtil...");
        this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
            console.debug("Opening IndexedDB: 'SynchronizationDB'");
            const request = indexedDB.open("SynchronizationDB", 1);
            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                console.debug("Database upgrade needed. Setting up object stores...");
                if (!db.objectStoreNames.contains('items')) {
                    const itemsStore = db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
                    itemsStore.createIndex("by_lastModified", "lastModified", { unique: false });
                    itemsStore.createIndex("by_syncStatus", "syncStatus", { unique: false });
                    console.debug("Object stores and indexes created.");
                }
            };
            request.onsuccess = () => {
                console.debug("IndexedDB successfully opened.");
                resolve(request.result);
            };
            request.onerror = (event) => {
                console.error("Error opening IndexedDB:", request.error);
                reject(request.error);
            };
        });
    }

    public static getInstance(): IndexedDBUtil {
        if (!IndexedDBUtil.instance) {
            console.debug("Creating new instance of IndexedDBUtil.");
            IndexedDBUtil.instance = new IndexedDBUtil();
        }
        return IndexedDBUtil.instance;
    }

    private async getObjectStore(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const db = await this.dbPromise;
        return db.transaction(storeName, mode).objectStore(storeName);
    }

    public async addItem(item: Item): Promise<IDBValidKey> {
        console.debug(`Adding item to IndexedDB:`, item);
        const store = await this.getObjectStore('items', 'readwrite');
        return new Promise<IDBValidKey>((resolve, reject) => {
            const request = store.add(item);
            request.onsuccess = () => {
                console.debug(`Item successfully added with ID: ${request.result}`);
                resolve(request.result);
            };
            request.onerror = () => {
                console.error("Error adding item to IndexedDB:", request.error);
                reject(request.error);
            };
        });
    }

    public async getItem(key: number): Promise<Item> {
        console.debug(`Retrieving item from IndexedDB with key: ${key}`);
        const store = await this.getObjectStore('items', 'readonly');
        return new Promise<Item>((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => {
                console.debug(`Item retrieved successfully:`, request.result);
                resolve(request.result);
            };
            request.onerror = () => {
                console.error("Error retrieving item from IndexedDB:", request.error);
                reject(request.error);
            };
        });
    }

    public async updateItem(item: Item): Promise<void> {
        console.debug(`Updating item in IndexedDB:`, item);
        const store = await this.getObjectStore('items', 'readwrite');
        return new Promise<void>((resolve, reject) => {
            const request = store.put(item);
            request.onsuccess = () => {
                console.debug("Item updated successfully.");
                resolve();
            };
            request.onerror = () => {
                console.error("Error updating item in IndexedDB:", request.error);
                reject(request.error);
            };
        });
    }

    public async addSet(id: string, gSet: GSet<any>): Promise<void> {
        console.debug(`Adding set to IndexedDB with ID: ${id}`, gSet.getItems());
        const store = await this.getObjectStore('items', 'readwrite');
        return new Promise<void>((resolve, reject) => {
            const request = store.put({ id, items: gSet.getItems() });
            request.onsuccess = () => {
                console.debug(`Set added successfully for ID: ${id}`);
                resolve();
            };
            request.onerror = () => {
                console.error("Error adding set to IndexedDB:", request.error);
                reject(request.error);
            };
        });
    }

    public async getSet(id: string): Promise<Item> {
        console.debug(`Retrieving item from IndexedDB with key: ${id}`);
        const store = await this.getObjectStore('items', 'readonly');
        return new Promise<Item>((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => {
                console.debug(`Item retrieved successfully:`, request.result);
                resolve(request.result);
            };
            request.onerror = () => {
                console.error("Error retrieving item from IndexedDB:", request.error);
                reject(request.error);
            };
        });
    }

    public async deleteItem(key: number): Promise<void> {
        console.debug(`Deleting item from IndexedDB with key: ${key}`);
        const store = await this.getObjectStore('items', 'readwrite');
        return new Promise<void>((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => {
                console.debug("Item deleted successfully.");
                resolve();
            };
            request.onerror = () => {
                console.error("Error deleting item from IndexedDB:", request.error);
                reject(request.error);
            };
        });
    }
}

export { IndexedDBUtil, Item };



// function isClientSideEnvironment() {
//     if (!window) {
//         return false;
//     }
//     return (
//         typeof window !== 'undefined' && // Check if window object is defined
//         typeof document !== 'undefined' && // Check if document object is defined
//         typeof navigator !== 'undefined' && // Check if navigator object is defined
//         typeof window.document.createElement === 'function' // Check if createElement method is available
//     );
// }

// Example usage:
// if (isClientSideEnvironment()) {
//     // Code specific to browser-side environment
//     console.log('Running in a browser-side environment.');
// } else {
//     // Code for non-browser environments
//     console.log('Running in a non-browser environment.');
// }
