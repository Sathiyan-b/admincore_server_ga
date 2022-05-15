import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import {
  AngularGridInstance,
  Column,
  FieldType,
  Filters,
  GridOption,
  GridService,
  OnEventArgs,
} from "angular-slickgrid";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import ErrorResponse from "src/app/modules/global/model/errorres.model";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { UserPermissionGuardService } from "src/app/modules/global/service/user-guard/user-permission-guard.service";
import {
  Application,
  ApplicationWrapper,
} from "../../models/application.model";
import { ApplicationService } from "../../service/application.service";

@Component({
  selector: "alarm-application",
  styleUrls: ["./application.alarm.component.css"],
  templateUrl: "./application.alarm.component.html",
})
export class ApplicationAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private application_service: ApplicationService,
    private toastr_service: ToastrService,
    public translate: TranslateService,
    private global_service: GlobalService,
    public user_permission_guard: UserPermissionGuardService
  ) {}
  ngOnInit() {
    this.getData();
    this.setupApplicationListGrid();
  }
  application_list: Array<ApplicationWrapper> = [];
  is_loading: boolean = false;
  application_list_angular_grid: AngularGridInstance;
  application_list_grid: any;
  application_list_grid_service: GridService;
  application_list_grid_data_view: any;
  application_list_grid_column_definitions: Column[];
  application_list_grid_options: GridOption;

  setLoading(arg: boolean) {
    this.is_loading = arg;
  }
  async getData() {
    this.setLoading(true);
    try {
      let application_req = new ApplicationWrapper();
      this.application_list = await this.application_service.get(
        application_req
      );
      // console.log("app_list",this.application_list)
    } catch (error) {
      var message: string = "couldn't get data";
      if (error.error && error.error instanceof ErrorResponse) {
        message = error.error.message;
      }
      this.toastr_service.error(message);
    } finally {
      this.setLoading(false);
    }
  }
  applicationListGridReady(angularGrid: AngularGridInstance) {
    this.application_list_angular_grid = angularGrid;
    this.application_list_grid_data_view = angularGrid.dataView;
    this.application_list_grid = angularGrid.slickGrid;
    this.application_list_grid_service = angularGrid.gridService;
    this.translate.onLangChange.subscribe((lang) => {
      var cols = angularGrid.extensionService.getAllColumns();
      for (var i = 0, il = cols.length; i < il; i++) {
        if (
          cols[i].id &&
          typeof cols[i].id == "string" &&
          (cols[i].id as string).length > 0
        )
          cols[i].name = this.translate.instant(cols[i].id as string);
      }
      this.application_list_angular_grid.extensionService.renderColumnHeaders(
        cols
      );
    });
  }
  setupApplicationListGrid() {
    this.application_list_grid_column_definitions = [
      {
        name: `<i class="fas fa-copy" data-toggle="tooltip" data-placement="top" title="Copy secret key" style="color:	#D3D3D3;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`,
        field: "id",
        id: 2,
        formatter: (row, cell, value, columnDef, dataContext) => {
          return `<i class="fas fa-copy" data-toggle="tooltip" data-placement="top" style="color:#036BC0;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`;
        },
        width: 40,
        onCellClick: (e: KeyboardEvent | MouseEvent, args: OnEventArgs) => {
          let data: ApplicationWrapper = args.dataContext;
          this.getSecret(data.id);
        },
      },
      {
        id: "Name",
        name: this.translate.instant("Name"),
        field: "display_text",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Security mode",
        name: this.translate.instant("Security mode"),
        field: "security_mode_display_text",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Success callback",
        name: this.translate.instant("Success callback"),
        field: "success_callback",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Failure callback",
        name: this.translate.instant("Failure callback"),
        field: "failure_callback",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "When registered",
        name: this.translate.instant("When registered"),
        field: "created_on",
        type: FieldType.string,
        sortable: true,
        minWidth: 200,
        filterable: true,
        filter: { model: Filters.compoundInput },
        formatter: (
          row: number,
          cell: number,
          value: any,
          columnDef: Column,
          dataContext: any,
          grid?: any
        ) => {
          var created_on_string = "";
          if (_.get(dataContext, "created_on", null) != null) {
            created_on_string = this.global_service.formatDateTime(
              dataContext.created_on
            );
          }
          return created_on_string;
        },
      },
    ];
    if (this.user_permission_guard.hasCanManageRegisteredAppPermission()) {
      this.application_list_grid_column_definitions.unshift({
        name: `<i class="fa fa-pencil" style="color:	#D3D3D3;cursor:pointer;justify-align: center;" title="Edit" name="edit" aria-hidden="true"></i>`,
        field: "id",
        id: 1,
        formatter: (row, cell, value, columnDef, dataContext) => {
          return `<i class="fa fa-pencil" style="color:#036BC0;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`;
        },
        width: 40,
        onCellClick: this.editRegisteredApplication,
      });
    }

    this.application_list_grid_options = {
      asyncEditorLoading: false,
      autoResize: {
        containerId: "application-list-grid-container",
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
      enableAutoTooltip: true,
    };
  }
  goToApplicationMerge(
    id: number = 0,
    root_userid: number = 0,
    first_name: string = ""
  ) {
    if (id == 0) {
      this.router.navigate(["application/applicationmerge"], {
        relativeTo: this.route.parent,
      });
    } else {
      this.router.navigate(["application/applicationmerge"], {
        relativeTo: this.route.parent,
        queryParams: {
          id,
          root_userid,
          first_name,
        },
      });
    }
  }
  async getSecret(id: number) {
    this.setLoading(true);
    try {
      let application_req = new ApplicationWrapper();
      application_req.id = id;
      let application_list = await this.application_service.getSecret(
        application_req
      );
      if (application_list.length > 0) {
        let application = application_list[0];
        document.addEventListener("copy", (e: ClipboardEvent) => {
          e.clipboardData.setData("text/plain", application.license_key);
          e.preventDefault();
          document.removeEventListener("copy", null);
        });
        document.execCommand("copy");
        this.toastr_service.success("Secret key copied to clipboard");
      }
    } catch (error) {
      var message: string = "Couldn't get secret key";
      if (error.error && error.error instanceof ErrorResponse) {
        message = error.error.message;
      }
      this.toastr_service.error(message);
    } finally {
      this.setLoading(false);
    }
  }
  editRegisteredApplication = (
    e: KeyboardEvent | MouseEvent,
    args: OnEventArgs
  ) => {
    let data: ApplicationWrapper = args.dataContext;
    this.goToApplicationMerge(data.id, data.root_userid, data.root_username);
  };
}
