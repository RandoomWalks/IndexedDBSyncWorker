/// <reference lib="webworker" />

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

const dbUtil = IndexedDBUtil.getInstance();  // Use the singleton instance of IndexedDBUtil
const sets: Map<string, GSet<any>> = new Map(); // Map to track GSet instances

// Function to add an item to a GSet and store it in IndexedDB
async function addToSet(id: string, item: any): Promise<void> {
    let gSet = sets.get(id) || new GSet<any>();
    gSet.add(item);
    sets.set(id, gSet);
    await dbUtil.addSet(id, gSet);
}

// Function to merge another GSet with the existing GSet and store in IndexedDB
async function mergeSets(id: string, otherSetItems: any[]): Promise<void> {
    let gSet = sets.get(id) || new GSet<any>();
    const otherSet = new GSet<any>(otherSetItems);
    gSet.merge(otherSet);
    sets.set(id, gSet);
    await dbUtil.addSet(id, gSet);
}

// Function to retrieve items from a GSet
function getItems(id: string): any[] | undefined {
    let gSet = sets.get(id);
    return gSet ? gSet.getItems() : undefined;
}

// Event handler for messages received from the main thread
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    const { type, payload } = e.data;
    try {
        switch (type) {
            case 'open':
                IndexedDBUtil.getInstance();
                self.postMessage({ type: 'opened' });
                break;
            case 'add':
                await addToSet(payload.id, payload.item);
                self.postMessage({ type: 'added', item: payload.item });
                break;
            case 'merge':
                if (payload.otherSetItems) {
                    await mergeSets(payload.id, payload.otherSetItems);
                }
                break;
            case 'getItems':
                const items = getItems(payload.id);
                self.postMessage({ type: 'items', id: payload.id, items });
                break;
            default:
                throw new Error('Unsupported operation type');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            self.postMessage({ type: 'error', error: error.message });
        } else {
            console.error('An unexpected error occurred:', error);
        }
    }
};
