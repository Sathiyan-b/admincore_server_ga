import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SharedService {
  name: string;
  constructor() {}
  getname() {
    return this.name;
  }
  setname(str: string) {
    this.name = str;
  }
}
