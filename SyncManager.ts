import { Service, Inject } from "typedi";
import { DatabaseService } from "./DatabaseService";
import { DataPreparationService } from "./DataPreparationService";
import { DataSyncService } from "./DataSyncService";
import { LoggerService } from "./LoggerService";

@Service()
export class SyncManager {
  constructor(
    @Inject() private databaseService: DatabaseService,
    @Inject() private dataPreparationService: DataPreparationService,
    @Inject() private dataSyncService: DataSyncService,
    @Inject() private logger: LoggerService
  ) {
    console.log('[SyncManager] Constructor called');

  }

  async performSync() {
    console.log('[SyncManager] Starting synchronization process');
    try {

      await this.databaseService.connect();
      console.log('[SyncManager] Database connected');

      const data = this.dataPreparationService.prepareData();
      console.log('[SyncManager] Data prepared:', data);

      this.dataSyncService.sync(data);
      console.log('[SyncManager] Data synced successfully');

    } catch (error) {
      if (error instanceof Error) {
        console.log('[SyncManager] Error during synchronization:', error.message);

        this.logger.log("Error during synchronization: " + error.message, 'error');
      } else {
        console.log('[SyncManager] An unexpected error occurred during synchronization');

        this.logger.log("An unexpected error occurred during synchronization.", 'error');
      }
    }
  }
}

