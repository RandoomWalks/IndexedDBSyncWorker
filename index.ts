import "reflect-metadata"; // Required for Typedi to use decorators
import { Container } from "typedi";
import { DatabaseService } from "./DatabaseService";
import { DataPreparationService } from "./DataPreparationService";
import { DataSyncService } from "./DataSyncService";
import { SyncManager } from "./SyncManager";
import { LoggerService } from "./LoggerService";
import { ConflictResolver } from "./ConflictResolver";

/**
 * Sets up and initializes all necessary services and the synchronization manager.
 * It handles the registration of services within the Typedi container and initiates the synchronization process.
 */
async function setup() {
  // Register individual services with the container. This setup ensures that each service
  // can be properly injected with its dependencies wherever needed.
  Container.set(LoggerService, new LoggerService());
  Container.set(ConflictResolver, new ConflictResolver());

  // Explicitly setting dependencies for services that require other services.
  Container.set(DataPreparationService, new DataPreparationService(Container.get(LoggerService)));
  Container.set(DataSyncService, new DataSyncService(Container.get(LoggerService), Container.get(ConflictResolver)));
  Container.set(DatabaseService, new DatabaseService());

  // Retrieving an instance of SyncManager from the container to start the synchronization process.
  const syncManager = Container.get(SyncManager);

  try {
    await syncManager.performSync();
  } catch (error) {
    const logger = Container.get(LoggerService);
    logger.error("An error occurred during the synchronization process: " + (error as Error).message);
  }
}

/**
 * Handles application shutdown, ensuring that all resources are properly cleaned up.
 * This function is triggered on signals for process termination.
 */
async function shutdown() {
  const logger = Container.get(LoggerService);
  const databaseService = Container.get(DatabaseService);

  // Perform necessary cleanup and resource release.
  await databaseService.close();
  logger.log("Application shutdown gracefully.");
}

// Set up process listeners for graceful shutdown. These listeners handle cleanup when the process is interrupted.
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the application setup
setup();
