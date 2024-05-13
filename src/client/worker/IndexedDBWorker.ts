// Import necessary classes for managing sets and IndexedDB interactions.
import { GSet } from '../GSet';
import { IndexedDBUtil } from '../IndexedDBUtil';

// Interfaces defining the structure for payloads used in worker messages.
interface GSetPayload {
    id: string;
    item?: any;
    otherSetItems?: any[];
}

interface WorkerMessage {
    type: string;
    payload: GSetPayload;
}

// Singleton instance of IndexedDBUtil to manage all IndexedDB operations within the worker.
const dbUtil = IndexedDBUtil.getInstance();

// Local map to maintain state of GSet instances by their IDs.
const sets: Map<string, GSet<any>> = new Map();

// Adds an item to a GSet and persists it in IndexedDB, ensuring that operations are idempotent.
async function addToSet(id: string, item: any): Promise<void> {
    console.debug(`Attempting to add item to set with ID: ${id}`);
    // Retrieve the existing GSet or create a new one if it doesn't exist.
    let gSet = sets.get(id) || new GSet<any>();
    // Add item to the set, obtaining a new immutable GSet instance.
    let newGSet = gSet.add(item);
    // Update the map with the new GSet instance.
    sets.set(id, newGSet);
    // Persist the updated GSet in IndexedDB.
    await dbUtil.addSet(id, newGSet);
    console.debug(`Item added to set ${id}, item: ${JSON.stringify(item)}`);
}

// Merges items from another GSet into the current GSet and stores the result in IndexedDB.
async function mergeSets(id: string, otherSetItems: any[]): Promise<void> {
    console.debug(`Attempting to merge sets with ID: ${id}`);
    // Retrieve the current GSet or initialize a new one.
    let gSet = sets.get(id) || new GSet<any>();
    // Create a new GSet from the items to be merged.
    const otherSet = new GSet<any>(otherSetItems);
    // Merge the two GSets, obtaining a new immutable GSet instance.
    let newGSet = gSet.merge(otherSet);
    // Update the map with the merged GSet.
    sets.set(id, newGSet);
    // Persist the merged GSet in IndexedDB.
    await dbUtil.addSet(id, newGSet);
    console.debug(`Sets merged for ID ${id}`);
}

// Retrieves items from a GSet stored locally in the worker.
function getItemsWorker(id: string): any[] | undefined {
    console.debug(`Fetching items from set with ID: ${id}`);
    let gSet = sets.get(id);
    return gSet ? gSet.getItems() : undefined;
}

// Retrieves items from a GSet stored in IndexedDB.
async function getIDBItems(id: string) {
    console.debug(`Fetching items from set with ID: ${id}`);
    let resp = await dbUtil.getSet(id);
    console.debug(`getIDBItems(): ${resp} with id:`, id);
}

// Handles incoming messages from the main thread, dispatching to appropriate functions based on message type.
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    const { type, payload } = e.data;
    console.debug(`Received message of type ${type} with payload:`, payload);
    try {
        switch (type) {
            case 'add':
                await addToSet(payload.id, payload.item);
                // Notify main thread of successful addition.
                self.postMessage({ type: 'added', id: payload.id, item: payload.item });
                console.debug(`Post message: item added for ID ${payload.id}`);
                break;
            case 'merge':
                if (payload.otherSetItems) {
                    await mergeSets(payload.id, payload.otherSetItems);
                    // Notify main thread of successful merge.
                    self.postMessage({ type: 'merged', id: payload.id });
                    console.debug(`Post message: sets merged for ID ${payload.id}`);
                }
                break;
            case 'getItems':
                await getIDBItems(payload.id);
                const items = getItemsWorker(payload.id);
                // Notify main thread of the items retrieved.
                self.postMessage({ type: 'items', id: payload.id, items });
                console.debug(`Post message: items fetched for ID ${payload.id}`, items);
                break;
            default:
                console.error(`Unsupported operation type: ${type}`);
                throw new Error('Unsupported operation type');
        }
    } catch (error:any) {
        // Handle any errors that occur during message processing.
        console.error('Error in worker:', error);
        self.postMessage({ type: 'error', error: error.message || String((error as Error)) });
    }
};
