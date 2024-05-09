import { IndexedDBManager } from './IndexedDBManager';

// Tests for the IndexedDBManager class
describe('IndexedDBManager', () => {
  let indexedDBManager: IndexedDBManager;
  let mockWorker: any;

  // Setup before each test
  beforeEach(() => {
    // Mock Worker setup
    mockWorker = {
      postMessage: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      terminate: jest.fn()
    };
    // Overriding the global Worker with a mock
    global.Worker = jest.fn(() => mockWorker);

    // Initializing IndexedDBManager with the mocked Worker
    indexedDBManager = new IndexedDBManager(new Worker('worker/IndexedDBWorker.js'));
    console.log("IndexedDBManager initialized for testing.");
  });

  // Test to verify that adding an item sends the correct message to the worker
  it('should send an add message to the worker', () => {
    indexedDBManager.addItemToSet('exampleSet', 'testItem');
    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      type: 'add',
      payload: { id: 'exampleSet', item: 'testItem' },
    });
    console.log("Add message sent correctly.");
  });

  // Test to verify that requesting items sends the correct message to the worker
  it('should send a getItems message to the worker', () => {
    indexedDBManager.getItemsFromSet('exampleSet');
    expect(mockWorker.postMessage).toHaveBeenCalledWith({
      type: 'getItems',
      payload: { id: 'exampleSet' },
    });
    console.log("GetItems message sent correctly.");
  });
});

// Additional test suite for error handling and data retrieval
describe('IndexedDBManager Error and Data Handling', () => {
  let indexedDBManager: IndexedDBManager;
  let mockWorker: any;

  // Setup before each test
  beforeEach(() => {
    // Detailed mock setup including event listeners
    mockWorker = {
      postMessage: jest.fn(),
      addEventListener: jest.fn((event, handler) => {
        if (event === 'message') {
          mockWorker.onmessage = handler;
        } else if (event === 'error') {
          mockWorker.onerror = handler;
        }
      }),
      removeEventListener: jest.fn(),
      terminate: jest.fn(),
      onmessage: jest.fn(),
      onerror: jest.fn()
    };
    global.Worker = jest.fn(() => mockWorker);
    indexedDBManager = new IndexedDBManager(new Worker('worker/IndexedDBWorker.js'));
    console.log("IndexedDBManager initialized with detailed event handling for testing.");
  });
  
  // Test to simulate worker initialization failure
  it('should handle worker initialization failure', () => {
    global.Worker = jest.fn(() => { throw new Error('Worker failed to initialize'); });
    expect(() => new IndexedDBManager(new Worker('worker/IndexedDBWorker.js')))
      .toThrow('Worker failed to initialize');
    console.error("Handled worker initialization failure.");
  });

  // Test to verify error handling from the worker
  it('should handle errors from the worker', () => {
    const errorHandler = jest.fn();
    indexedDBManager.onError(errorHandler);
    const errorMessage = { message: 'Error from worker' };
    mockWorker.onerror({ error: errorMessage });

    expect(errorHandler).toHaveBeenCalledWith(errorMessage);
    console.log("Error handling verified.");
  });

  // Test to verify correct data handling when items are received from the worker
  it('should receive items from the worker and process them correctly', () => {
    const processItems = jest.fn();
    indexedDBManager.onItemsReceived(processItems); // Ensures handler is set before the event

    const testData = { type: 'items', id: 'exampleSet', items: ['item1', 'item2'] };
    mockWorker.onmessage({ data: testData });

    expect(processItems).toHaveBeenCalledWith(['item1', 'item2'], 'exampleSet');
    console.log("Data received and processed correctly.");
  });

  // Test to verify handling of empty data set from the worker
  it('should send a getItems message to the worker and handle empty data', () => {
    const processItems = jest.fn();
    indexedDBManager.onItemsReceived(processItems); // Ensures handler is set before the event

    mockWorker.onmessage({ data: { type: 'items', id: 'exampleSet', items: [] } });

    expect(processItems).toHaveBeenCalledWith([], 'exampleSet');
    console.log("Empty data set handled correctly.");
  });
});
