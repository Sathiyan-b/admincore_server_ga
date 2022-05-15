import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-popup-common",
  templateUrl: "./popup-common.component.html",
  styleUrls: ["./popup-common.component.css"],
})
export class PopupCommonComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupCommonComponent>,
    @Inject(MAT_DIALOG_DATA) public alert_data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
