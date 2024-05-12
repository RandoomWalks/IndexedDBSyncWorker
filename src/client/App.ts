// App.ts
import { Mediator } from './Mediator';

export class App {
    private mediator: Mediator;
    private messageDiv: HTMLDivElement;

    constructor() {
        this.mediator = new Mediator();
        this.messageDiv = document.getElementById('message') as HTMLDivElement;
        this.initializeUI();
    }

    private initializeUI() {
        document.getElementById('addItemForm')?.addEventListener('submit', this.handleAddItem);
        document.getElementById('getItemButton')?.addEventListener('click', this.handleGetItems);
        document.addEventListener('itemsReceived', this.handleItemsReceived as EventListener);
        document.addEventListener('errorOccurred', this.handleErrorOccurred as EventListener);
        document.getElementById('fetchDataButton')?.addEventListener('click', this.fetchData);

    }
    private fetchData() {
        console.log("Fetching data from http://localhost:3000/api/data...");
        fetch('http://localhost:3000/api/data')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Data fetched successfully:", data);
                document.getElementById('dataDisplay')!.textContent = JSON.stringify(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    private handleAddItem = (event: Event) => {
        event.preventDefault();
        const setName = 'exampleSet';
        const itemName = (document.getElementById('itemName') as HTMLInputElement)?.value;
        console.log(`Attempting to add item "${itemName}" to set "${setName}"`);
        this.mediator.addItemToSet(setName, itemName);
        this.displayMessage('Adding item...');
    }

    private handleGetItems = () => {
        const setName = 'exampleSet';
        console.log(`Fetching items from set "${setName}"`);
        this.mediator.getItemsFromSet(setName);
        this.displayMessage('Fetching items...');
    }

    private handleItemsReceived = (event: CustomEvent) => {
        const { items, setId } = event.detail;
        console.log(`Received items from set "${setId}":`, items);
        this.displayMessage(`Items in set ${setId}: ${JSON.stringify(items)}`);
    }

    private handleErrorOccurred = (event: CustomEvent) => {
        console.error('An error occurred:', event.detail);
        this.displayMessage(`Error: ${event.detail}`, true);
    }

    private displayMessage(message: string, isError: boolean = false) {
        this.messageDiv.textContent = message;
        if (isError) {
            this.messageDiv.classList.add('error');
        } else {
            this.messageDiv.classList.remove('error');
        }
    }
}