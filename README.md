
#### 2.1 High-Level Overview

The system is divided into three main layers, each responsible for a specific aspect of the synchronization process:

- **Client-Side Database Layer:** Manages local storage using IndexedDB, facilitating offline data storage and operations.
- **Synchronization Layer:** Acts as the mediator between the client and server databases, managing data synchronization, conflict resolution, and change tracking.
- **Server-Side Logic:** Handles interactions with the MongoDB database, processes synchronization requests, and maintains a global state of data across all clients.


### Current Server side

### Components:
1. **`LoggerService`** - Handles logging across the application.
2. **`DatabaseService`** - Manages database connections and operations.
3. **`DataPreparationService`** - Prepares and validates data before synchronization.
4. **`DataSyncService`** - Responsible for the synchronization logic, including conflict resolution.
5. **`ConflictResolver`** - Defines strategies for resolving data conflicts during synchronization.
6. **`SyncManager`** - Coordinates the entire synchronization process, utilizing all other services.
7. **`IndexedDBUtil`** - Manages local IndexedDB operations (if this is relevant to the overall architecture).

### Interactions:
- **`SyncManager`** orchestrates the synchronization process, relying on `DatabaseService` for database interactions, `DataPreparationService` for preparing data, and `DataSyncService` for handling the synchronization logic.
- **`DataSyncService`** uses `ConflictResolver` to handle conflicts and `LoggerService` to log activities.
- **`DataPreparationService`** also utilizes `LoggerService` to log its activities.
- **`DatabaseService`** is used directly by `SyncManager` for database operations.
- **`LoggerService`** is used across various services for logging different events and errors.

### Diagram Sketch:
Here's a textual layout of the architecture:

```
                    +-----------------+
                    |  SyncManager    |
                    +-----------------+
                           | |
                +----------+ +-----------+
                |                           |
        +-------v--------+          +------v------+
        | DatabaseService|          | DataPrepService|
        +----------------+          +--------------+
                                                |
                                                |
        +----------------+          +------v------+
        | IndexedDBUtil   |          | DataSyncService|
        +----------------+          +--------------+
                                                |
                                        +-------v-------+
                                        | ConflictResolver |
                                        +-----------------+

                  +-----------------+
                  | LoggerService    |
                  +-----------------+
```

### Class Diagram

```
+------------------------------------+
| <<service>>                        |
| LoggerService                      |
|------------------------------------|
| -logger: winston.Logger            |
|------------------------------------|
| +log(message: string, level: string)|
+---------------^--------------------+
                | uses
+------------------------------------+        +------------------------------------+
| <<service>>                        |        | <<service>>                        |
| SyncManager                        |        | DatabaseService                    |
|------------------------------------|        |------------------------------------|
| -databaseService: DatabaseService  |------->| +connect(): Promise<void>          |
| -dataPreparationService:           |        | +disconnect(): Promise<void>       |
|     DataPreparationService         |        +------------------------------------+
| -dataSyncService: DataSyncService  |        | <<service>>                        |
| -loggerService: LoggerService      |        | DataPreparationService             |
|------------------------------------|        |------------------------------------|
| +performSync(): Promise<void>      |        | +prepareData(): { data: string }   |
+-----------------^------------------+        +---------------^--------------------+
                  | injects                               uses |
+------------------------------------+        +------------------------------------+
| <<service>>                        |        | <<service>>                        |
| DataSyncService                    |        | DataSyncService                    |
|------------------------------------|        |------------------------------------|
| -logger: LoggerService             |<-------| -logger: LoggerService             |
|------------------------------------|        |------------------------------------|
| +sync(data: any): void             |        | +sync(data: any): void             |
+------------------------------------+        +------------------------------------+
```



**Step-by-Step Process**:

1. **Start Synchronization**:
   - The user or system triggers the synchronization process in the `SyncManager`.

2. **Connect to Database**:
   - The `SyncManager` sends a message to `DatabaseService` to establish a database connection.
   - `DatabaseService` acknowledges the connection.

3. **Fetch Data**:
   - `SyncManager` requests raw data from `DatabaseService`.
   - `DatabaseService` retrieves and returns the data.

4. **Prepare Data**:
   - `SyncManager` sends the raw data to `DataPreparationService` for processing.
   - `DataPreparationService` processes the data and returns the prepared data.

5. **Synchronize Data**:
   - `SyncManager` sends the prepared data to `DataSyncService`.
   - `DataSyncService` initiates the synchronization.
   - If conflicts are detected, `DataSyncService` requests resolution from `ConflictResolver`.
   - `ConflictResolver` resolves the conflicts and returns the resolved data.
   - `DataSyncService` completes the synchronization by sending the resolved data to the server or database.

6. **Complete Synchronization**:
   - `SyncManager` logs the completion and possibly returns a status to the user or system.
  

   
```
+------------------+    +------------------+    +---------------------+    +----------------------+    +------------------+
| User/System      |    | SyncManager      |    | DatabaseService    |    | DataPreparationService|    | DataSyncService  |
+------------------+    +------------------+    +---------------------+    +----------------------+    +------------------+
         |                       |                         |                             |                            |
         |---------------------->|                         |                             |                            |
         |   Start Sync          |                         |                             |                            |
         |---------------------->|                         |                             |                            |
         |   Connect Database    |------------------------>|                             |                            |
         |                       |      Connect            |                             |                            |
         |                       |<------------------------|                             |                            |
         |                       |                         |                             |                            |
         |                       |      Fetch xData         |-----------------------------|                            |
         |                       |                         |       Return Data           |                            |
         |                       |<------------------------|                             |                            |
         |                       |                         |                             |                            |
         |                       |      Prepare Data       |-----------------------------|                            |
         |                       |                         |       Return Prepared Data  |                            |
         |                       |<------------------------------------------------------|                            |
         |                       |                         |                             |     Synchronize Data       |
         |                       |------------------------------------------------------>|                            |
         |                       |                         |                             |     Resolve Conflicts      |
         |                       |                         |                             |---------------------------->
         |                       |                         |                             |       Return Resolved Data |
         |                       |                         |                             |<----------------------------|
         |                       |                         |                             |                            |
         |                       |      Complete Sync      |-----------------------------|                            |
         |                       |<------------------------------------------------------|                            |
+------------------+    +------------------+    +---------------------+    +----------------------+    +------------------+
```

```
+--------------+      +--------------+      +-----------------------+      +----------------+      +---------------+
| SyncManager  |      | DatabaseSvc  |      | DataPreparationSvc   |      | DataSyncSvc    |      | LoggerService |
+------+-------+      +------+-------+      +----------+-----------+      +--------+-------+      +-------+-------+
       |                     |                          |                            |                      |
       | [1] connect()       |                          |                            |                      |
       |-------------------->|                          |                            |                      |
       |                     |                          |                            |                      |
       |                     | [2] <Promise resolved>  |                            |                      |
       |<--------------------|                          |                            |                      |
       |                     |                          |                            |                      |
       | [3] prepareData()   |                          |                            |                      |
       |----------------------------------------------->|                            |                      |
       |                     |                          | [4] <Data preparation>    |                      |
       |                     |                          |----------------------------|                      |
       |                     |                          |                            |                      |
       |                     |                          |<---------------------------|                      |
       |                     |                          |                            |                      |
       | [5] sync(data)      |                          |                            |                      |
       |----------------------------------------------------------+                 |                      |
       |                     |                          |        | [6] <Sync start> |                      |
       |                     |                          |        |----------------->|                      |
       |                     |                          |        |                  | [7] log(info)        |
       |                     |                          |        |                  |--------------------->|
       |                     |                          |        |                  |                      |
       |                     |                          |        |                  | [8] <Log recorded>   |
       |                     |                          |        |                  |<---------------------|
       |                     |                          |        |                  |                      |
       |                     |                          |        | [9] <Sync done>  |                      |
       |                     |                          |<-------|-----------------|                      |
       |                     |                          |                            |                      |
       |                     |                          | [10] Return sync result   |                      |
       |<----------------------------------------------------------+                 |                      |
       |                     |                          |                            |                      |
       | [11] log(error) if any                        |                            |                      |
       |---------------------+------------------------->|                            |                      |
       |                     |                          |                            |                      |
       | [12] <Error logged> |                          |                            |                      |
       |<--------------------|                          |                            |                      |
       |                     |                          |                            |                      |
+------+-------+      +------+-------+      +----------+-----------+      +--------+-------+      +-------+-------+
| SyncManager  |      | DatabaseSvc  |      | DataPreparationSvc   |      | DataSyncSvc    |      | LoggerService |
+--------------+      +--------------+      +-----------------------+      +----------------+      +---------------+
```
