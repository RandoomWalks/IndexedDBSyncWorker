import { Service, Inject } from "typedi";
import { DatabaseService } from "./DatabaseService";
import { DataPreparationService } from "./DataPreparationService";
import { DataSyncService } from "./DataSyncService";
import { LoggerService } from "./LoggerService";

@Service()
class SyncManager {
  constructor(
    @Inject() private databaseService: DatabaseService,
    @Inject() private dataPreparationService: DataPreparationService,
    @Inject() private dataSyncService: DataSyncService,
    @Inject() private logger: LoggerService
  ) {}

  async performSync() {
    try {
      this.logger.log("SyncManager: Starting the synchronization process.");
      await this.databaseService.connect();

      const rawData = await this.fetchData();
      const preparedData = await this.dataPreparationService.prepareData(rawData);

      await this.dataSyncService.sync(preparedData);
      this.logger.log("SyncManager: Data synchronization completed successfully.");
    } catch (error) {
      this.logger.error(`SyncManager: Error during synchronization - ${(error as Error).message}`);
      // Implement retry logic, notification to admins, or other error handling strategies here
    }
  }

  private async fetchData(): Promise<any[]> {
    // Simulate fetching raw data that needs to be synchronized
    this.logger.log("SyncManager: Fetching data for preparation...");
    return new Promise(resolve => setTimeout(() => resolve([{ id: 1, data: 'Example' }]), 1000));
  }
}

export { SyncManager };
