/// <reference lib="webworker" />

// Temporary declaration until GSet is properly bundled with the worker script
declare var GSet: any;

// Payload structure for messages related to the GSet
interface GSetPayload {
    id: string; // Identifier for the GSet
    item?: any; // Item to add to the GSet
    otherSetItems?: any[]; // Items from another GSet to merge
}

// Structure for messages received by the worker
interface WorkerMessage {
    type: string; // Type of operation to perform
    payload: GSetPayload; // Data payload for the operation
}

// Reference to the IndexedDB database
let db: IDBDatabase;

// Opens a connection to the IndexedDB and sets up the database
const openDB = () => {
    // Open the database with the name "SynchronizationDB"
    const request = indexedDB.open("SynchronizationDB", 1);

    // Upgrade event is triggered if the database is being created or the version is being updated
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        db = (event.target as IDBOpenDBRequest).result;
        // Create an object store for CRDTs if it doesn't already exist
        if (!db.objectStoreNames.contains('crdts')) {
            db.createObjectStore("crdts", { keyPath: "id" });
        }
    };

    // Success event is triggered when the database is successfully opened
    request.onsuccess = (event: Event) => {
        db = (event.target as IDBOpenDBRequest).result;
    };

    // Error event is triggered on any error when opening the database
    request.onerror = (event: Event) => {
        console.error("Database error: ", (event.target as IDBOpenDBRequest).error?.message);
    };
};

// Immediately invoke the openDB function to open the database
openDB();

// Map to store GSet instances indexed by their IDs
const sets: Map<string, any> = new Map();

// Event handler for messages received from the main thread
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
    const { type, payload } = e.data;
    switch (type) {
        case 'add': // Handle 'add' operation
            addToSet(payload.id, payload.item);
            break;
        case 'merge': // Handle 'merge' operation
            if (payload.otherSetItems) {
                mergeSets(payload.id, payload.otherSetItems);
            }
            break;
        case 'getItems': // Handle 'getItems' operation
            getItems(payload.id);
            break;
        default: // Log an error for unsupported operations
            console.error("Unsupported operation type");
    }
};

// Adds an item to the specified GSet
const addToSet = (id: string, item: any) => {
    let gSet = sets.get(id) || new GSet();
    gSet.add(item);
    sets.set(id, gSet);
    storeSet(id, gSet);
};

// Merges another GSet into the specified GSet
const mergeSets = (id: string, otherSetItems: any[]) => {
    let gSet = sets.get(id) || new GSet();
    let otherSet = new GSet(otherSetItems);
    gSet.merge(otherSet);
    sets.set(id, gSet);
    storeSet(id, gSet);
};

// Posts the items of the specified GSet back to the main thread
const getItems = (id: string) => {
    let gSet = sets.get(id);
    if (gSet) {
        self.postMessage({ type: 'items', id: id, items: gSet.getItems() });
    }
};

// Stores the specified GSet in the IndexedDB
const storeSet = (id: string, gSet: any) => {
    const transaction = db.transaction(['crdts'], 'readwrite');
    const store = transaction.objectStore('crdts');
    store.put({ id, items: gSet.getItems() });
};
