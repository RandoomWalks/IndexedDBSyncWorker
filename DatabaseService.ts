import { Service } from "typedi";
import * as mongodb from 'mongodb';

@Service()
class DatabaseService {
  private client: mongodb.MongoClient;
  private db?: mongodb.Db;

  // constructor() {
  //   const url = process.env.DB_URL || 'mongodb://localhost:27017';
  //   const dbName = process.env.DB_NAME || 'myDatabase';

  //   this.client = new mongodb.MongoClient(url, {
  //     poolSize: 10 // Configurable connection pool size
  //   });

  //   this.client.connect()
  //     .then(() => {
  //       console.log('Database connected.');
  //       this.db = this.client.db(dbName);
  //     })
  //     .catch((error) => {
  //       console.error('Database connection failed:', error);
  //       this.reconnect(); // Attempt to reconnect
  //     });
  // }

  constructor(url: string = process.env.DB_URL || 'mongodb://localhost:27017') {
    // const url = process.env.DB_URL || 'mongodb://localhost:27017';

    // MongoClient in v4.x and later handles connection pooling automatically with default settings
    this.client = new mongodb.MongoClient(url);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Database connected.");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      throw new Error("Database connection failed");
    }
  }

  async reconnect() {
    try {
      await this.client.connect();
      console.log('Reconnected to database successfully.');
    } catch (error) {
      console.log('Reconnection failed, retrying in 5 seconds...');
      setTimeout(() => this.reconnect(), 5000);
    }
  }

  async getCollection(collectionName: string): Promise<mongodb.Collection> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db.collection(collectionName);
  }

  // Example CRUD operation
  async findOne(collectionName: string, query: object): Promise<any> {
    const collection = await this.getCollection(collectionName);
    return collection.findOne(query);
  }

  // Cleanup resources
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }

  }
}

export { DatabaseService };
