import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { QRCodeComponent, QRCodeModule } from "angularx-qrcode";

@Component({
  selector: "app-popup-common",
  templateUrl: "./popup-qrcode.component.html",
  styleUrls: ["./popup-qrcode.component.css"]
})
export class PopupQRCodeComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupQRCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public alert_data: any
  ) {
    console.log("injected data ",alert_data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
