import { DatabaseService } from "./DatabaseService";
import { DataPreparationService } from "./DataPreparationService";
import { DataSyncService } from "./DataSyncService";
import { LoggerService } from "./LoggerService";

/**
 * The SyncManager class is responsible for coordinating the various stages of data synchronization.
 * It handles the orchestration of connecting to the database, fetching and preparing data,
 * and performing the synchronization itself. It uses dependency injection to manage its dependencies.
 */
class SyncManager {
  // Dependency injection via constructor to handle database operations, data preparation, synchronization, and logging.
  constructor(
    private databaseService: DatabaseService,
    private dataPreparationService: DataPreparationService,
    private dataSyncService: DataSyncService,
    private logger: LoggerService
  ) { }

  /**
   * Main method to perform synchronization. It manages the flow of data from fetching raw data,
   * preparing it, and finally synchronizing it to a remote service or database.
   */
  async performSync() {
    try {
      // Logging the start of the synchronization process
      console.log("(SyncManager): Starting the synchronization process.");
      // Connecting to the database before any data operation
      await this.databaseService.connect();
      console.log("(SyncManager): Connected to MongoDB");

      const collection = this.databaseService.getCollection("items");
      console.log(collection)

      // Fetching and preparing data for synchronization
      const rawData = await this.fetchData();
      const preparedData = await this.dataPreparationService.prepareData(rawData);

      // Performing the actual synchronization
      await this.dataSyncService.sync(preparedData);
      // Logging successful completion of synchronization
      console.log("(SyncManager): Data synchronization completed successfully.");
    } catch (error) {
      // Handling errors that may occur during the synchronization process
      console.error(`(SyncManager): Error during synchronization - ${(error as Error).message}`);
      // Additional error handling strategies can be implemented here
    } finally {
      await this.databaseService.close();
    }
  }

  /**
   * Fetches raw data that will be prepared and synchronized.
   * This is a simulation of an asynchronous data fetch, such as querying a database or an external API.
   */
  private async fetchData(): Promise<any[]> {
    // Logging the fetching operation
    console.log("(SyncManager): Fetching data for preparation...");
    // Simulating a delay in fetching data
    return new Promise(resolve => setTimeout(() => resolve([{ id: 1, data: 'Example' }]), 1000));
  }
}

export { SyncManager };
