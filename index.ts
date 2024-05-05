import "reflect-metadata"; // Required for Typedi to use decorators
import { Container } from "typedi";
import { DatabaseService } from "./DatabaseService";
import { DataPreparationService } from "./DataPreparationService";
import { DataSyncService } from "./DataSyncService";
import { SyncManager } from "./SyncManager";
import { LoggerService } from "./LoggerService";
import { ConflictResolver } from "./ConflictResolver";

async function setup() {
  // Register services with the container
  // Container.set(LoggerService, new LoggerService());
  Container.set(LoggerService, new LoggerService());
  Container.set(ConflictResolver, new ConflictResolver());
  Container.set(DataPreparationService, new DataPreparationService(Container.get(LoggerService)));
  Container.set(DataSyncService, new DataSyncService(Container.get(LoggerService), Container.get(ConflictResolver)));

  Container.set(DatabaseService, new DatabaseService());
  // Container.set(DataPreparationService, new DataPreparationService());
  // Container.set(DataSyncService, new DataSyncService());

  // Get an instance of SyncManager from the container
  const syncManager = Container.get(SyncManager);

  // Start the synchronization process
  try {
    await syncManager.performSync();
  } catch (error) {
    const logger = Container.get(LoggerService);
    logger.error("An error occurred during the synchronization process: " + (error as Error).message);
  }
}

async function shutdown() {
  // Clean up resources and prepare for graceful shutdown
  const logger = Container.get(LoggerService);
  const databaseService = Container.get(DatabaseService);

  await databaseService.close();
  logger.log("Application shutdown gracefully.");
}

// Set up process listeners for graceful shutdown
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the application setup
setup();
