import * as mongodb from 'mongodb';
import { LoggerService } from './LoggerService';

class DatabaseService {
  private client: mongodb.MongoClient;
  private db?: mongodb.Db;
  private retryCount = 0;
  private maxRetries = 3;

  constructor(private logger: LoggerService, url: string = process.env.DB_URL || 'mongodb://localhost:27017') {
    // Create a MongoDB client with default settings for connection pooling
    this.client = new mongodb.MongoClient(url);
  }

  async connect() {
    try {
      // Attempt to connect to MongoDB
      await this.client.connect();
      this.db = this.client.db("syncDB"); // Select the database after a successful connection
      console.log('(DatabaseService): Database connected.');
      this.retryCount = 0; // Reset retry count on successful connection
    } catch (error) {
      console.error('(DatabaseService): Connection attempt failed: ' + (error as Error).message);
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`(DatabaseService): Retrying... Attempt ${this.retryCount}`);
        await this.connect();
      } else {
        console.error("(DatabaseService): All connection attempts failed.");
        throw new Error("Database connection failed");
      }
    }
  }

  async reconnect() {
    try {
      await this.client.connect();
      this.db = this.client.db("syncDB"); // Ensure the db instance is correctly assigned on reconnect
      console.log('(DatabaseService): Reconnected to database successfully.');
    } catch (error) {
      console.error('(DatabaseService): Reconnection failed, retrying in 5 seconds...');
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  async getCollection(collectionName: string): Promise<mongodb.Collection> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db.collection(collectionName);
  }

  async findOne(collectionName: string, query: object): Promise<any> {
    const collection = await this.getCollection(collectionName);
    return collection.findOne(query);
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('(DatabaseService): Database connection closed.');
    }
  }
}

export { DatabaseService };
