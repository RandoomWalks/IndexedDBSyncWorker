// App.ts
// The App class serves as the main entry point for the application, coordinating interactions
// between the user interface and the underlying data management layer via the Mediator class.

import { Mediator } from './Mediator';

export class App {
    private mediator: Mediator; // Handles all interactions with the IndexedDBManager through a Mediator.
    private messageDiv: HTMLDivElement; // Display area for messages to the user.

    constructor() {
        this.mediator = new Mediator();
        this.messageDiv = document.getElementById('message') as HTMLDivElement; // Initialize the message display element.
        this.initializeUI(); // Setup UI event listeners and initial UI state.
    }

    // Initializes UI elements and binds event handlers to form and button interactions.
    private initializeUI() {
        // Attach event listeners to form submissions and button clicks for item operations.
        document.getElementById('addItemForm')?.addEventListener('submit', this.handleAddItem);
        document.getElementById('getItemButton')?.addEventListener('click', this.handleGetItems);
        // Listen for custom events broadcast by the Mediator when items are received or errors occur.
        document.addEventListener('itemsReceived', this.handleItemsReceived as EventListener);
        document.addEventListener('errorOccurred', this.handleErrorOccurred as EventListener);
        document.getElementById('fetchDataButton')?.addEventListener('click', this.fetchData);
    }

    // Fetches data from a remote API and updates the UI with the results.
    private fetchData() {
        console.log("Fetching data from http://localhost:3000/api/data...");
        fetch('http://localhost:3000/api/data')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`); // Handle HTTP errors.
                }
                return response.json();
            })
            .then(data => {
                console.log("Data fetched successfully:", data);
                document.getElementById('dataDisplay')!.textContent = JSON.stringify(data);
            })
            .catch(error => console.error('Error fetching data:', error)); // Handle fetch errors.
    }

    // Handles the 'submit' event from the addItemForm, preventing default form submission behavior.
    private handleAddItem = (event: Event) => {
        event.preventDefault();
        const setName = 'exampleSet'; // Define a default set name.
        const itemName = (document.getElementById('itemName') as HTMLInputElement)?.value; // Get the item name from the input.
        console.log(`Attempting to add item "${itemName}" to set "${setName}"`);
        this.mediator.addItemToSet(setName, itemName); // Delegate item addition to the Mediator.
        this.displayMessage('Adding item...'); // Show feedback message.
    }

    // Handles the 'click' event from the getItemButton to fetch items from a set.
    private handleGetItems = () => {
        const setName = 'exampleSet'; // Define a default set name for the fetch operation.
        console.log(`Fetching items from set "${setName}"`);
        this.mediator.getItemsFromSet(setName); // Delegate fetching to the Mediator.
        this.displayMessage('Fetching items...'); // Show feedback message.
    }

    // Handles custom 'itemsReceived' events, updating the UI with received items.
    private handleItemsReceived = (event: CustomEvent) => {
        const { items, setId } = event.detail;
        console.log(`Received items from set "${setId}":`, items);
        this.displayMessage(`Items in set ${setId}: ${JSON.stringify(items)}`); // Display received items.
    }

    // Handles custom 'errorOccurred' events, displaying error messages to the user.
    private handleErrorOccurred = (event: CustomEvent) => {
        console.error('An error occurred:', event.detail);
        this.displayMessage(`Error: ${event.detail}`, true); // Display error message with a special style.
    }

    // Utility method to display messages or errors in the messageDiv element.
    private displayMessage(message: string, isError: boolean = false) {
        this.messageDiv.textContent = message; // Update text content.
        if (isError) {
            this.messageDiv.classList.add('error'); // Add error styling if it's an error message.
        } else {
            this.messageDiv.classList.remove('error'); // Remove error styling for normal messages.
        }
    }
}
