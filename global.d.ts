// declare namespace NodeJS {
//   interface Global {
//     Worker: any;
//   }
// }



declare global {
  namespace NodeJS {
    interface Global {
      Worker: any;
    }
  }
}
