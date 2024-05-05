import { Service } from "typedi";

@Service()
export class DatabaseService {
  async connect(): Promise<void> {
    try {
      console.log("Connecting to the database...");
      // Simulate database connection logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Database connected.");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      throw new Error("Database connection failed");
    }
  }
}

