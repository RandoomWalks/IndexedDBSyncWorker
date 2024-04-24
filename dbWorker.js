// IndexedDB setup previously discussed
const dbName = "SynchronizationDB";
let db;

function openDB() {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('items')) {
            const store = db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
            store.createIndex("by_lastModified", "lastModified", { unique: false });
            store.createIndex("by_syncStatus", "syncStatus", { unique: false });
        }
    };
    request.onsuccess = function(event) {
        db = event.target.result;
    };
    request.onerror = function(event) {
        postMessage({ type: 'error', error: event.target.errorCode });
    };
}

openDB();

// Message listener for CRUD operations
self.onmessage = function(e) {
    const { type, payload } = e.data;
    switch (type) {
        case 'add':
            addItem(payload);
            break;
        case 'get':
            getItem(payload);
            break;
        case 'update':
            updateItem(payload);
            break;
        case 'delete':
            deleteItem(payload);
            break;
    }
};

function addItem(item) {
    const transaction = db.transaction(['items'], 'readwrite');
    const store = transaction.objectStore('items');
    const request = store.add(item);

    request.onsuccess = () => {
        postMessage({ type: 'added', id: request.result });
    };
    request.onerror = () => {
        postMessage({ type: 'error', error: request.error });
    };
}

function getItem(key) {
    const transaction = db.transaction(['items'], 'readonly');
    const store = transaction.objectStore('items');
    const request = store.get(key);

    request.onsuccess = () => {
        postMessage({ type: 'got', item: request.result });
    };
    request.onerror = () => {
        postMessage({ type: 'error', error: request.error });
    };
}

function updateItem(item) {
    const transaction = db.transaction(['items'], 'readwrite');
    const store = transaction.objectStore('items');
    store.put(item);
    // Continue similarly for update and delete...
}
