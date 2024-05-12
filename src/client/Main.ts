// Main.ts
import { App } from './App';


// Changes Made:
// Remove Direct Worker Management: The direct creation and management of IndexedDBManager and workers are removed from Main.ts and encapsulated within the App or potentially the Mediator.

// Single Responsibility: Main.ts is now solely responsible for bootstrapping the application, adhering to the Single Responsibility Principle. It starts the app once the DOM is fully loaded, reducing any direct involvement in the app's logic.

// Initialization Flow: It only initializes the App, which will handle all further setups, including creating the Mediator and IndexedDBManager. This maintains a clean entry point and ensures that the application’s setup is modular and testable.

document.addEventListener('DOMContentLoaded', () => {
    // Create an instance of the App, which internally creates and manages the Mediator and IndexedDBManager.
    new App();
});
