import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.scss"]
})
export class BreadcrumbComponent implements AfterViewInit {
  @Input() title: string;
  @Input() parent: string;

  constructor() {}
  displayMe = "disp-none";

  ngAfterViewInit() {
    console.log("parent " + this.parent);
    console.log("title " + this.title);
    // this.displayMe = this.parent === '' || this.parent === undefined ? 'disp-none' : 'disp-block';
  }
}
