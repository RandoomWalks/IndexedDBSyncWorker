import { GSet } from './GSet';

// Interface for an item that will be stored in IndexedDB.
interface Item {
    id?: number; // Optional because it's auto-incremented by IndexedDB.
    content: string; // Content of the item.
    lastModified: string; // Timestamp in ISO string format.
    syncStatus: 'pending' | 'synced'; // Sync status of the item.
}

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
            request.onerror = () => reject(request.error);
        });
    }

    public static getInstance(): IndexedDBUtil {
        if (!IndexedDBUtil.instance) {
            IndexedDBUtil.instance = new IndexedDBUtil();
        }
        return IndexedDBUtil.instance;
    }

    private async getObjectStore(storeName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const db = await this.dbPromise;
        return db.transaction(storeName, mode).objectStore(storeName);
    }

    public async addItem(item: Item): Promise<IDBValidKey> {
        const store = await this.getObjectStore('items', 'readwrite');
        return new Promise<IDBValidKey>((resolve, reject) => {
            const request = store.add(item);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    public async getItem(key: number): Promise<Item> {
        const store = await this.getObjectStore('items', 'readonly');
        return new Promise<Item>((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    public async updateItem(item: Item): Promise<void> {
        const store = await this.getObjectStore('items', 'readwrite');
        return new Promise<void>((resolve, reject) => {
            const request = store.put(item);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public async addSet(id: string, gSet: GSet<any>): Promise<void> {
        const store = await this.getObjectStore('items', 'readwrite');
        return new Promise<void>((resolve, reject) => {
            const request = store.put({ id, items: gSet.getItems() });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public async deleteItem(key: number): Promise<void> {
        const store = await this.getObjectStore('items', 'readwrite');
        return new Promise<void>((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

export { IndexedDBUtil, Item };
