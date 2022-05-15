import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AngularGridInstance,
  GridService,
  Column,
  GridOption,
  FieldType,
  Filters,
  Formatter,
  OnEventArgs,
} from "angular-slickgrid";
import * as _ from "lodash";
import { ToastrService } from 'ngx-toastr';
import ActionRes from 'src/app/modules/global/model/actionres.model';
import { GlobalService } from 'src/app/modules/global/service/shared/global.service';
import { AlarmsModel } from '../../models/alarms.model';
import { AlarmService } from './alarm-view.service';

@Component({
  selector: 'app-alarm-view',
  templateUrl: './alarm-view.component.html',
  styleUrls: ['./alarm-view.component.css']
})
export class AlarmViewComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private global_service: GlobalService,
    public service:AlarmService,
    private toastr_service: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.setupAlarmListGrid();
  }

  alarm_list_angular_grid: AngularGridInstance;
  alarm_list_grid: any;
  alarm_list_grid_service: GridService;
  alarm_list_grid_data_view: any;
  alarm_list_grid_column_definitions: Column[];
  alarm_list_grid_options: GridOption;
  alarm_list_grid_dataset: any[];
  alarm_list_grid_updated_object: any;

  getData() {
    this.service.getAlarms().subscribe(
      (resp: ActionRes<Array<AlarmsModel>>) => {
        if (resp.item) {
          this.alarm_list_grid_dataset = resp.item;
          this.alarm_list_grid_service.renderGrid();
        }
      },
      (error) => {
        var error_msg =
          error && error.error && error.error.message
            ? error.error.message
            : "";
        this.toastr_service.error(
          error_msg.length > 0 ? error_msg : "Error fetching data"
        );
      }
    );
  }
  alarmListGridReady(angularGrid: AngularGridInstance) {
    this.alarm_list_angular_grid = angularGrid;
    this.alarm_list_grid_data_view = angularGrid.dataView;
    this.alarm_list_grid = angularGrid.slickGrid;
    this.alarm_list_grid_service = angularGrid.gridService;
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
      this.alarm_list_angular_grid.extensionService.renderColumnHeaders(cols);
    });
  }

  setupAlarmListGrid() {
    this.alarm_list_grid_column_definitions = [
      {
        name: `<i class="fa fa-pencil" style="color:#D3D3D3; cursor:pointer; justify-align: center;" title="Edit" name="edit" aria-hidden="true"></i>`,
        field: "",
        id: 1,
        formatter: this.AlarmEditButtonFormat,
        minWidth: 50,
        maxWidth: 30,
        onCellClick: (e, args: OnEventArgs) => {
          this.goToAlarmMerge(args.dataContext);
        }
      },
      // {
      //   name: "",
      //   field: "",
      //   id: 2,
      //   formatter: this.userDeleteButtonFormat,
      //   minWidth: 35,
      //   maxWidth: 35,
      //   onCellClick: (e, args: OnEventArgs) => {
      //     if (!args.dataContext.is_factory) this.popupCommon("INACTIVE", args);
      //   },
      // },
      // {
      //   name: "",
      //   field: "",
      //   id: 3,
      //   formatter: this.userLockButtonFormat,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e, args: OnEventArgs) => {
      //     if (args.dataContext.is_active) {
      //       this.popupCommon("LOCKED", args);
      //     }
      //   },
      // },
      {
        name: "#",
        field: "",
        id: 4,
        formatter: function (row) {
          return (row + 1).toString();
        },
        width: 40,
      },
      {
        id: "Alarm",
        name: this.translate.instant("Alarm"),
        field: "identifier",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "Alarm description",
        name: this.translate.instant("Alarm description"),
        field: "alarm_desc",
        type: FieldType.string,
        sortable: true,
        minWidth: 150,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      {
        id: "High priority",
        name: this.translate.instant("High priority"),
        field: "is_priority",
        type: FieldType.boolean,
        sortable: true,
        minWidth: 100,
        filterable: true,
        filter: { model: Filters.compoundInput },
      },
      // {
      //   id: "When created",
      //   name: this.translate.instant("When created"),
      //   field: "created_on",
      //   sortable: true,
      //   minWidth: 110,
      //   type: FieldType.string,
      //   formatter: (
      //     row: number,
      //     cell: number,
      //     value: any,
      //     columnDef: Column,
      //     dataContext: any,
      //     grid?: any
      //   ) => {
      //     var created_on_string = "";
      //     if (_.get(dataContext, "created_on", null) != null) {
      //       created_on_string = this.global_service.formatDateTime(dataContext.created_on);
      //     }
      //     return created_on_string;
      //   },
      // },
    ];
    this.alarm_list_grid_options = {
      asyncEditorLoading: false,
      autoResize: {
        containerId: "alarm-list-grid-container",
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableFiltering: true,
      enableAutoTooltip: true,
      checkboxSelector: {
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true,
      },
      rowSelectionOptions: {
        selectActiveRow: false,
      },
      // enableCheckboxSelector: this.PermissFlag == 1 || this.PermissFlag == 2,
      // enableRowSelection: this.PermissFlag == 1 || this.PermissFlag == 2,
    };
  }

  AlarmEditButtonFormat: Formatter = (
    row,
    cell,
    value,
    columnDef,
    dataContext
  ) => {
    if (dataContext.is_factory) {
      return "";
    }
    return `<i class="fa fa-pencil" style="color:#036BC0;cursor:pointer;justify-align: center;" name="edit" aria-hidden="true"></i>`;
  };

  goToAlarmMerge(alarm){
    let navigation_extras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        id: alarm.id,
        identifier: alarm.identifier,
        alarm_desc: alarm.alarm_desc,
        is_priority: alarm.is_priority,
      },
    };
    this.router.navigate(["alarm-merge"], navigation_extras);
  }

}
