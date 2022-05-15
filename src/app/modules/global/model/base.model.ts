import * as _ from "lodash";
export class Base {
  constructor(init?: Base) {
    if (init) {
    }
  }
  // getMinimumDate() {
  //   return new Date(9999, 11, 31, 23, 59, 59);
  // }
}
export namespace Base {
  export enum DURATION_TYPES {
    seconds = "SECONDS",
    minutes = "MINUTES",
  }
}
