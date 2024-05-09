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


// mock the interface directly and provide custom implementations for its methods, you would use jest.fn()
// if your IndexedDBManager class interacts with a Worker instance created from a module, you might use jest.mock() to mock the module containing the Worker class. 

describe.only('IndexedDBManager', () => {
  let IndexedDBManager_inst: IndexedDBManager;
  let mockPostMessage: jest.Mock;  // Explicitly typing as jest.Mock
  let mockAddEventListener: jest.Mock;  // Explicitly typing as jest.Mock
  let mockTerminate: jest.Mock;  // Explicitly typing as jest.Mock
  let mockOnmessage: jest.Mock;  // Explicitly typing as jest.Mock
  let mockOnmessageerror: jest.Mock;  // Explicitly typing as jest.Mock

  // A more detailed mock that adheres to the Worker interface
  beforeEach(() => {
    mockPostMessage = jest.fn();
    mockAddEventListener = jest.fn();
    mockTerminate = jest.fn();
    mockOnmessage = jest.fn();
    mockOnmessageerror = jest.fn();

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
      onmessage: jest.fn(),
      onmessageerror: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      terminate: jest.fn()
    };


    // Spy on the methods of the Worker interface
    const onmessageSpy = jest.spyOn(mockWorker, 'onmessage');
    const onmessageerrorSpy = jest.spyOn(mockWorker, 'onmessageerror');
    const postMessageSpy = jest.spyOn(mockWorker, 'postMessage');
    const addEventListenerSpy = jest.spyOn(mockWorker, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(mockWorker, 'removeEventListener');
    const terminateSpy = jest.spyOn(mockWorker, 'terminate');


    test('Worker methods are called correctly', () => {
      // Call a method of the Worker interface
      mockWorker.postMessage('message');
  
      // Verify that the method was called with the correct parameters
      expect(postMessageSpy).toHaveBeenCalledWith('message');
  
      // You can similarly test other methods of the Worker interface
  });
  
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

