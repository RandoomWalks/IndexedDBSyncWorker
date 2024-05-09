// since web workers run in a separate context from the main thread, won't be able to directly  share instances or use Typedi for dependency injection in the same way as in the main thread.
// manually create instances of IndexedDBUtil class within the web worker and use them for IndexedDB operations. 
// Maintain the separation of concerns, with the web worker responsible for handling message-based communication and performing IndexedDB operations independently.

import { GSet } from '../GSet';
import { IndexedDBUtil } from '../IndexedDBUtil';

interface GSetPayload {
    id: string;
    item?: any;
    otherSetItems?: any[];
}

interface WorkerMessage {
    type: string;
    payload: GSetPayload;
}

// Initialize IndexedDBUtil instance for web worker
const dbUtil = IndexedDBUtil.getInstance();

// Map to track GSet instances
const sets: Map<string, GSet<any>> = new Map();

// Function to add an item to a GSet and store it in IndexedDB
async function addToSet(id: string, item: any): Promise<void> {
    console.debug(`Attempting to add item to set with ID: ${id}`);
    let gSet = sets.get(id) || new GSet<any>();
    let newGSet = gSet.add(item);
    sets.set(id, newGSet);
    await dbUtil.addSet(id, newGSet);
    console.debug(`Item added to set ${id}, item: ${JSON.stringify(item)}`);
}

// Function to merge another GSet with the existing GSet and store in IndexedDB
async function mergeSets(id: string, otherSetItems: any[]): Promise<void> {
    console.debug(`Attempting to merge sets with ID: ${id}`);
    let gSet = sets.get(id) || new GSet<any>();
    const otherSet = new GSet<any>(otherSetItems);
    let newGSet = gSet.merge(otherSet);
    sets.set(id, newGSet);
    await dbUtil.addSet(id, newGSet);
    console.debug(`Sets merged for ID ${id}`);
}

// Function to retrieve items from a GSet
function getItemsWorker(id: string): any[] | undefined {
    console.debug(`Fetching items from set with ID: ${id}`);
    let gSet = sets.get(id);
    return gSet ? gSet.getItems() : undefined;
}

// Function to retrieve items from a GSet
async function getIDBItems(id: string) {
    console.debug(`Fetching items from set with ID: ${id}`);
    let resp = await dbUtil.getSet(id);
    console.debug(`getIDBItems(): ${resp} with id:`, id);

    // let gSet = sets.get(id);
    // return gSet ? gSet.getItems() : undefined;
}

// Event handler for messages received from the main thread
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    const { type, payload } = e.data;
    console.debug(`Received message of type ${type} with payload:`, payload);
    try {
        switch (type) {
            case 'add':
                await addToSet(payload.id, payload.item);
                self.postMessage({ type: 'added', id: payload.id, item: payload.item });
                console.debug(`Post message: item added for ID ${payload.id}`);
                break;
            case 'merge':
                if (payload.otherSetItems) {
                    await mergeSets(payload.id, payload.otherSetItems);
                    self.postMessage({ type: 'merged', id: payload.id });
                    console.debug(`Post message: sets merged for ID ${payload.id}`);
                }
                break;
            case 'getItems':
                getIDBItems(payload.id);
                const items = getItemsWorker(payload.id);
                self.postMessage({ type: 'items', id: payload.id, items });
                console.debug(`Post message: items fetched for ID ${payload.id}`, items);
                break;
            default:
                console.error(`Unsupported operation type: ${type}`);
                throw new Error('Unsupported operation type');
        }
    } catch (error) {
        if (error instanceof Error) {
            // Handle error
            console.error('Error in worker:', error);
            self.postMessage({ type: 'error', error: error.message || String(error) });
        }
    }
};
