// export class WorkerMethods {
//     // Send a message to the worker to add an item to the G-Set
//     addItemToSet(setId: string, item: string) {
//         const message: WorkerMessage = { type: 'add', payload: { id: setId, item } };
//         this.dbWorker.postMessage(message);
//     }

//     // Send a message to the worker to retrieve items from the G-Set
//     getItemsFromSet(setId: string) {
//         const message: WorkerMessage = { type: 'getItems', payload: { id: setId } };
//         this.dbWorker.postMessage(message);
//     }

// }


export function addItemToSet(setId: string, item: string, worker: Worker) {
    const message: WorkerMessage = { type: 'add', payload: { id: setId, item } };
    worker.postMessage(message);
}

export function getItemsFromSet(setId: string, worker: Worker) {
    const message: WorkerMessage = { type: 'getItems', payload: { id: setId } };
    worker.postMessage(message);
}
