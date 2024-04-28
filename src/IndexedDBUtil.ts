// Interface for an item that will be stored in IndexedDB.
interface Item {
    id?: number; // Optional because it's auto-incremented by IndexedDB.
    content: string; // Content of the item.
    lastModified: string; // Timestamp in ISO string format.
    syncStatus: 'pending' | 'synced'; // Sync status of the item.
}

/**
 * Utility class for interacting with IndexedDB.
 * It provides a simplified interface for common database operations like adding, retrieving, updating, and deleting items.
 */

class IndexedDBUtil {
    private static instance: IndexedDBUtil;
    private dbPromise: Promise<IDBDatabase>;

    private constructor() {
        this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open("SynchronizationDB", 1);

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains('items')) {
                    const itemsStore = db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
                    itemsStore.createIndex("by_lastModified", "lastModified", { unique: false });
                    itemsStore.createIndex("by_syncStatus", "syncStatus", { unique: false });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => {
                console.error('IndexedDB error:', request.error?.message);
                reject(request.error);
            };
        });
    }

    public static getInstance(): IndexedDBUtil {
        if (!IndexedDBUtil.instance) {
            IndexedDBUtil.instance = new IndexedDBUtil();
        }
        return IndexedDBUtil.instance;
    }

    // Opens a transaction and returns the object store
    private getObjectStore(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
        return this.dbPromise.then(db => {
            const transaction = db.transaction(storeName, mode);
            return transaction.objectStore(storeName);
        });
    }

    // Adds a new item to the "items" store.
    public addItem(item: Item): Promise<IDBValidKey> {
        return this.getObjectStore('items', 'readwrite').then(store => {
            return new Promise<IDBValidKey>((resolve, reject) => {
                const request = store.add(item);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }

    // Retrieves an item by its key from the "items" store.
    public getItem(key: number): Promise<Item> {
        return this.getObjectStore('items', 'readonly').then(store => {
            return new Promise<Item>((resolve, reject) => {
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }

    // Updates an existing item in the "items" store.
    public updateItem(item: Item): Promise<void> {
        return this.getObjectStore('items', 'readwrite').then(store => {
            return new Promise<void>((resolve, reject) => {
                const request = store.put(item);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        });
    }

    // Deletes an item from the "items" store by its key.
    public deleteItem(key: number): Promise<void> {
        return this.getObjectStore('items', 'readwrite').then(store => {
            return new Promise<void>((resolve, reject) => {
                const request = store.delete(key);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        });
    }
}

export { IndexedDBUtil, Item };
