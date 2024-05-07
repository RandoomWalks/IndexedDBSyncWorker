// import { IndexedDBManager } from '../Main';
import { IndexedDBManager } from './Main';

// Define or extend the global scope if needed for types
// declare global {
//   namespace NodeJS {
//     interface Global {
//       Worker: typeof Worker;
//     }
//   }
// }



// Include Jest types for better integration with TypeScript
// import '@types/jest';

describe.only('IndexedDBManager', () => {
  let IndexedDBManager_inst: IndexedDBManager;
  let mockPostMessage: jest.Mock;  // Explicitly typing as jest.Mock

  // A more detailed mock that adheres to the Worker interface
  beforeEach(() => {
    mockPostMessage = jest.fn();

    // Create a mock that adheres to the Worker interface
    // class MockWorker {
    //   constructor(stringUrl: string, options?: WorkerOptions) {
    //     this.url = stringUrl;
    //     this.options = options;
    //   }

    //   postMessage = mockPostMessage;
    //   addEventListener = jest.fn();
    //   terminate = jest.fn();
    //   url: string;
    //   options?: WorkerOptions;
    // }

    // // Assigning the Worker prototype if needed
    // MockWorker.prototype = Object.create(Worker.prototype);

    // global.Worker = MockWorker as any;


    // Create a simple mock Worker object
    const mockWorker = {
      postMessage: jest.fn(),
      addEventListener: jest.fn(),
      terminate: jest.fn()
    };

    // Assign the mock Worker to the global object
    global.Worker = jest.fn(() => mockWorker) as any;


    IndexedDBManager_inst = new IndexedDBManager(new Worker('worker/IndexedDBWorker.js'));
  });

  it('should send an add message to the worker', () => {
    IndexedDBManager_inst.addItemToSet('exampleSet', 'testItem');
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'add',
      payload: { id: 'exampleSet', item: 'testItem' },
    });
  });

  it('should send a getItems message to the worker', () => {
    IndexedDBManager_inst.getItemsFromSet('exampleSet');
    expect(mockPostMessage).toHaveBeenCalledWith({
      type: 'getItems',
      payload: { id: 'exampleSet' },
    });
  });
});

