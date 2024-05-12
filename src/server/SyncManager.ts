import { DatabaseService } from "./DatabaseService";
import { DataPreparationService } from "./DataPreparationService";
import { DataSyncService } from "./DataSyncService";
import { LoggerService } from "./LoggerService";

/**
 * The SyncManager class orchestrates the process of data synchronization across different services.
 * It integrates operations from database connectivity to data preparation and final synchronization.
 * Dependency injection is employed to decouple the class from concrete implementations of its dependencies,
 * facilitating easier maintenance and testing.
 */
class SyncManager {
  // Properties are injected through the constructor, enabling loose coupling and easier unit testing.
  constructor(
    private databaseService: DatabaseService,
    private dataPreparationService: DataPreparationService,
    private dataSyncService: DataSyncService,
    private logger: LoggerService
  ) { }

  /**
   * Coordinates the entire data synchronization workflow, from fetching data, preparing it,
   * to syncing with a remote server or database. It handles both the operational logic and error management.
   */
  async performSync() {
    try {
      this.logger.log("Starting the synchronization process."); // Improved logging using a dedicated service.
      await this.databaseService.connect(); // Establish a connection to the database.
      this.logger.log("Connected to MongoDB");

      // Retrieve a specific collection to work with.
      const collection = this.databaseService.getCollection("items");
      this.logger.log(`Working with collection: ${collection}`);

      // Fetch raw data, prepare it for synchronization, and then sync.
      const rawData = await this.fetchData();
      const preparedData = await this.dataPreparationService.prepareData(rawData);
      await this.dataSyncService.sync(preparedData);
      this.logger.log("Data synchronization completed successfully.");
    } catch (error) {
      // Generic error handling and logging the specific error message.
      this.logger.error(`Error during synchronization - ${(error as Error).message}`);
      // Here, strategies such as retry mechanisms or alerts can be implemented.
    } finally {
      // Ensure the database connection is closed even if an error occurs.
      await this.databaseService.close();
      this.logger.log("Database connection closed.");
    }
  }

  /**
   * Simulates fetching data from a database or external API.
   * This method showcases a placeholder for more complex data retrieval logic.
   */
  private async fetchData(): Promise<any[]> {
    this.logger.log("Fetching data for preparation...");
    // Delay simulates network or database latency.
    return new Promise(resolve => setTimeout(() => resolve([{ id: 1, data: 'Example' }]), 1000));
  }
}

export { SyncManager };
