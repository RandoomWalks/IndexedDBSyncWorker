import { Service } from "typedi";

@Service()
export class DataPreparationService {
  prepareData() {
    console.log("Preparing data for synchronization...");
    return { data: "Sample data" };  // Example data
  }
}

