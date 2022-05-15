import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-pop-up-common',
  templateUrl: './pop-up-common.component.html',
  styleUrls: ['./pop-up-common.component.css']
})
export class PopUpCommonComponent { 
  
  constructor(
  public translate: TranslateService,
  public dialogRef: MatDialogRef<PopUpCommonComponent>,
  @Inject(MAT_DIALOG_DATA) public alert_data: any
) {}

onNoClick(): void {
  this.dialogRef.close();
}
}
