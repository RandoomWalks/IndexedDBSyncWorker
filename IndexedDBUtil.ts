interface Item {
    id?: number; // Optional because it's auto-incremented by IndexedDB
    content: string;
    lastModified: string; // ISO string format date
    syncStatus: 'pending' | 'synced';
}

class IndexedDBUtil {
    private db: IDBDatabase | null = null;
    private itemsStore: IDBObjectStore | null = null;

    constructor() {
        this.openDB();
    }

    private openDB(): void {
        const request = indexedDB.open("SynchronizationDB", 1);
    
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
    
            // Create an object store named 'items' if it doesn't already exist
            if (!db.objectStoreNames.contains('items')) {
                const itemsStore = db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
                
                // Define indexes to efficiently query by these attributes
                itemsStore.createIndex("by_lastModified", "lastModified", { unique: false });
                itemsStore.createIndex("by_syncStatus", "syncStatus", { unique: false });
            }
        };
    
        request.onsuccess = (event: Event) => {
            this.db = (event.target as IDBOpenDBRequest).result;
            console.log("Database opened successfully.");
        };
    
        request.onerror = (event: Event) => {
            console.error("Database error: ", (event.target as IDBOpenDBRequest).error?.message);
        };
    }
    

    public addItem(item: Item): void {
        const transaction = this.db!.transaction(["items"], "readwrite");
        const store = transaction.objectStore("items");
        store.add(item);
    }

    public getItem(key: number): Promise<Item | undefined> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(["items"], "readonly");
            const store = transaction.objectStore("items");
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    public updateItem(item: Item): void {
        const transaction = this.db!.transaction(["items"], "readwrite");
        const store = transaction.objectStore("items");
        store.put(item);
    }

    public deleteItem(key: number): void {
        const transaction = this.db!.transaction(["items"], "readwrite");
        const store = transaction.objectStore("items");
        store.delete(key);
    }
}
