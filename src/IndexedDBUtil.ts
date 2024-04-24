// Interface for an item that will be stored in IndexedDB.
interface Item {
    id?: number; // Optional because it's auto-incremented by IndexedDB.
    content: string; // Content of the item.
    lastModified: string; // Timestamp in ISO string format.
    syncStatus: 'pending' | 'synced'; // Sync status of the item.
}

// Utility class for interacting with IndexedDB.
class IndexedDBUtil {
    private db: IDBDatabase | null = null; // Reference to the IndexedDB database.

    // Initialize the database connection.
    constructor() {
        this.openDB();
    }

    // Opens the database, creating it if it doesn't exist.
    private openDB(): void {
        const request = indexedDB.open("SynchronizationDB", 1);
    
        // Event handler for the first-time creation or version upgrade needed for the database.
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
    
            // Create an object store for items if it does not already exist.
            if (!db.objectStoreNames.contains('items')) {
                const itemsStore = db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
                
                // Define indexes to improve query performance based on attributes.
                itemsStore.createIndex("by_lastModified", "lastModified", { unique: false });
                itemsStore.createIndex("by_syncStatus", "syncStatus", { unique: false });
            }
        };
    
        // Success event handler for when the database has been successfully opened.
        request.onsuccess = (event: Event) => {
            this.db = (event.target as IDBOpenDBRequest).result;
            console.log("Database opened successfully.");
        };
    
        // Error event handler for any errors encountered while opening the database.
        request.onerror = (event: Event) => {
            console.error("Database error: ", (event.target as IDBOpenDBRequest).error?.message);
        };
    }

    // Adds a new item to the "items" store.
    public addItem(item: Item): void {
        const transaction = this.db!.transaction(["items"], "readwrite");
        const store = transaction.objectStore("items");
        store.add(item);
    }

    // Retrieves an item by its key from the "items" store.
    public getItem(key: number): Promise<Item | undefined> {
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(["items"], "readonly");
            const store = transaction.objectStore("items");
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Updates an existing item in the "items" store.
    public updateItem(item: Item): void {
        const transaction = this.db!.transaction(["items"], "readwrite");
        const store = transaction.objectStore("items");
        store.put(item);
    }

    // Deletes an item from the "items" store by its key.
    public deleteItem(key: number): void {
        const transaction = this.db!.transaction(["items"], "readwrite");
        const store = transaction.objectStore("items");
        store.delete(key);
    }
}
