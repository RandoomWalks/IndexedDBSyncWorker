// Assuming the existence of proper module imports and class definitions
import { IndexedDBManager } from './IndexedDBManager'; // Adjust path as necessary

// Define a type for messages that are sent to the worker
type WorkerMessageType = 'add' | 'getItems' | 'error';

// Define the structure for messages sent to the worker
interface WorkerMessage {
    type: WorkerMessageType;
    payload: { id: string; item?: string; items?: string[]; error?: string };
}

export class App {
    private indexedDBManager: IndexedDBManager;
    private messageDiv: HTMLDivElement;

    constructor() {
        const worker = new Worker('dbWorker.bundle.js');
        this.indexedDBManager = new IndexedDBManager(worker);
        this.messageDiv = document.getElementById('message') as HTMLDivElement;
        console.debug("App initialized, setting up UI.");
        this.initializeUI();
    }

    private initializeUI(): void {
        document.getElementById('addItemForm')?.addEventListener('submit', this.handleAddItem);
        document.getElementById('getItemButton')?.addEventListener('click', this.handleGetItems);

        // Set up the event handler for messages received from the worker
        this.indexedDBManager.onMessage((event: MessageEvent) => {
            const data = event.data;
            console.log("Message received from IndexedDBManager:", data);
            if (data.type === 'getItems') {
                this.displayMessage(`Items: ${JSON.stringify(data.items)}`);
            } else if (data.type === 'error') {
                this.displayMessage(`Error: ${data.error}`, true);
            }
        });
    }

    private handleAddItem = (event: Event): void => {
        event.preventDefault();
        const setName = 'exampleSet'; // Should be dynamic based on application's needs
        const itemName = (document.getElementById('itemName') as HTMLInputElement).value.trim();
        const itemValue = (document.getElementById('itemValue') as HTMLInputElement).value.trim();
        this.indexedDBManager.addItemToSet(setName, itemName);
        this.displayMessage('Adding item...');
        console.debug(`Add item form submitted for set ${setName} with item name ${itemName} and value ${itemValue}`);
    }

    private handleGetItems = (event: Event): void => {
        const setName = 'exampleSet'; // This could be dynamic based on application's needs
        this.indexedDBManager.getItemsFromSet(setName);
        this.displayMessage('Fetching items...');
        console.debug(`Get items button clicked for set ${setName}`);

    }

    private displayMessage(message: string, isError: boolean = false): void {
        this.messageDiv.textContent = message;
        if (isError) {
            this.messageDiv.classList.add('error'); // Make sure the 'error' class is defined in your CSS
            console.error("Display error message:", message);
        } else {
            this.messageDiv.classList.remove('error');
            console.log("Display message:", message);
        }
    }
}
