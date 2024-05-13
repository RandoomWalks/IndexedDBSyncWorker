// declare namespace NodeJS {
//   interface Global {
//     Worker: any;
//   }
// }



// declare global {
//   namespace NodeJS {
//     interface Global {
//       Worker: any;
//     }
//   }
// }


// declare module 'global' {
//   namespace NodeJS {
//     interface Global {
//       Worker: any;
//     }
//   }
// }

// global.d.ts
declare module global {
  interface Worker {
      postMessage: jest.Mock<any, any>;
      terminate: jest.Mock<void>;
      addEventListener: jest.Mock<void>;
      removeEventListener: jest.Mock<void>;
  }
}
