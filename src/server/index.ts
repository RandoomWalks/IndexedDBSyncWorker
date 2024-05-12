import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DatabaseService } from "./DatabaseService";
import { DataPreparationService } from "./DataPreparationService";
import { DataSyncService } from "./DataSyncService";
import { SyncManager } from "./SyncManager";
import { LoggerService } from "./LoggerService";
import { ConflictResolver } from "./ConflictResolver";

// Instantiate the logger service for application-wide logging.
const logger = new LoggerService();

// Create instances of services with appropriate dependencies injected, enabling decoupled architecture and easier testing.
const databaseService = new DatabaseService(logger);
const conflictResolver = new ConflictResolver(logger);
const dataPreparationService = new DataPreparationService(logger);
const dataSyncService = new DataSyncService(logger, conflictResolver);

// Centralized SyncManager coordinates complex synchronization tasks across services.
const syncManager = new SyncManager(databaseService, dataPreparationService, dataSyncService, logger);

// Initialize the Express application.
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors()); // Enables Cross-Origin Resource Sharing for all routes.
app.use(bodyParser.json()); // Parses incoming requests with JSON payloads.

// Sample route to demonstrate data fetching.
app.get('/api/data', (req, res) => {
  res.json({ message: "Successfully fetched data", data: ["Item1", "Item2"] });
});

// Route to trigger the synchronization process manually via HTTP POST request.
app.post('/sync', async (req, res) => {
  try {
    logger.log("Triggering synchronization process...");
    await syncManager.performSync(); // Execute synchronization.
    res.status(200).send('Synchronization completed successfully.');
  } catch (error) {
    logger.error('Failed to complete synchronization: ' + (error as Error).message);
    res.status(500).send('Failed to complete synchronization: ' + (error as Error).message);
  }
});

// Start the server on the specified port.
app.listen(port, () => {
  logger.log(`Server running on http://localhost:${port}`);
});

/**
 * Initializes all necessary services and starts the synchronization manager.
 * This function handles the orchestration of service setup and begins the synchronization process.
 */
async function setup() {
  try {
    logger.log("(Index.ts): Starting synchronization process...");
    await syncManager.performSync();
    logger.log("(Index.ts): Synchronization process completed.");
  } catch (error) {
    logger.error("(Index.ts): An error occurred during the synchronization process: " + (error as Error).message);
  }
}

/**
 * Handles application shutdown by ensuring all resources are properly cleaned up.
 * This function is crucial for graceful termination of services during application shutdown.
 */
async function shutdown() {
  try {
    logger.log("(Index.ts): Shutting down application...");
    await databaseService.close(); // Close database connections.
    logger.log("(Index.ts): Application shutdown gracefully.");
  } catch (error) {
    logger.error("(Index.ts): An error occurred during application shutdown: " + (error as Error).message);
  } finally {
    process.exit(0); // Ensures the process exits regardless of shutdown success.
  }
}

// Register process event listeners to handle graceful shutdown on signals like SIGINT or SIGTERM.
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Uncomment to start the setup process when needed.
// setup();
