import { Service, Inject } from "typedi";
import { LoggerService } from "./LoggerService";

@Service()
class DataPreparationService {
  constructor(@Inject() private logger: LoggerService) {}

  async prepareData(data: any[]): Promise<any[]> {
    this.logger.log('Starting data preparation');

    const preparedData = await Promise.all(data.map(async (item) => {
      // Simulate data validation and transformation
      if (this.validateData(item)) {
        return this.transformData(item);
      } else {
        this.logger.log(`Invalid data found: ${JSON.stringify(item)}`, 'warn');
        return null;  // or handle the error as needed
      }
    }));

    // Filter out null values if any invalid data was found
    const validData = preparedData.filter(item => item !== null);

    this.logger.log(`Data prepared with ${validData.length} valid entries out of ${data.length}`);
    return validData;
  }

  private validateData(data: any): boolean {
    // Implement validation logic here
    return true; // Simplified for demonstration
  }

  private transformData(data: any): any {
    // Implement transformation logic here
    data.processed = true; // Simplified for demonstration
    return data;
  }
}

export { DataPreparationService };
