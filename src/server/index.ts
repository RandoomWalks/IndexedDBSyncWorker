import express from 'express';
import bodyParser from 'body-parser';
import { DatabaseService } from "./DatabaseService";
import { DataPreparationService } from "./DataPreparationService";
import { DataSyncService } from "./DataSyncService";
import { SyncManager } from "./SyncManager";
import { LoggerService } from "./LoggerService";
import { ConflictResolver } from "./ConflictResolver";


// Instantiate Logger
const logger = new LoggerService();

// Instantiate other services with dependencies injected
const databaseService = new DatabaseService(logger);
const conflictResolver = new ConflictResolver(logger);
const dataPreparationService = new DataPreparationService(logger);
const dataSyncService = new DataSyncService(logger, conflictResolver);

// Instantiate SyncManager with all required services
const syncManager = new SyncManager(databaseService, dataPreparationService, dataSyncService, logger);


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Define routes
app.post('/sync', async (req, res) => {
  try {
    console.log("Triggering synchronization process...");
    await syncManager.performSync();
    res.status(200).send('Synchronization completed successfully.');
  } catch (error) {
    res.status(500).send('Failed to complete synchronization: ' + (error as Error).message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


/**
 * Sets up and initializes all necessary services and the synchronization manager.
 * It handles the registration of services within the Typedi container and initiates the synchronization process.
 */
async function setup() {

  try {
    console.log("(Index.ts): Starting synchronization process...");
    await syncManager.performSync();
    console.log("(Index.ts): Synchronization process completed.");

  } catch (error) {
    console.error("(Index.ts): An error occurred during the synchronization process: " + (error as Error).message);
  }
}

/**
 * Handles application shutdown, ensuring that all resources are properly cleaned up.
 * This function is triggered on signals for process termination.
 */
async function shutdown() {
  try {

    console.log("(Index.ts): Shutting down application...");

    // Perform necessary cleanup and resource release.
    await databaseService.close();
    console.log("(Index.ts): Application shutdown gracefully.");
  } catch (error) {
    console.error("(Index.ts): An error occurred during application shutdown: " + (error as Error).message);
  } finally {
    // Ensure process exits even if shutdown fails
    process.exit(0);
  }
}

// Set up process listeners for graceful shutdown. These listeners handle cleanup when the process is interrupted.
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the application setup
// setup();  