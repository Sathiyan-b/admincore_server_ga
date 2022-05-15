import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { translateBooleanFormatter } from "angular-slickgrid/app/modules/angular-slickgrid/formatters/translateBooleanFormatter";
import { Console } from "console";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import * as _ from "lodash";
import { ToastrService } from "ngx-toastr";
import { UserPasswordComponent } from "src/app/modules/global/containers/password/password.component";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import ActionRes from "src/app/modules/global/model/actionres.model";
import ErrorResponse from "src/app/modules/global/model/errorres.model";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { PasswordValidatorService } from "src/app/modules/global/service/validator/passwordvalidator.service";
import { ValidatorService } from "src/app/modules/global/service/validator/validator.service";
import { threadId } from "worker_threads";
import {
  Application,
  ApplicationWrapper,
} from "../../models/application.model";
import { PasswordPolicyModel } from "../../models/passwordpolicy.model";
import { ReferenceListModel } from "../../models/referencelist.model";
import { UserModel } from "../../models/user.model";
import { ApplicationService } from "../../service/application.service";
import { PasswordPolicyService } from "../../service/passwordpolicy.service";
import { ReferenceListService } from "../../service/referencelist.service";
import { PasswordpolicyService } from "../password-policy/password.policy.service";
import { PopupCommonComponent } from "../popup-common/popup-common.component";
import { ApplicationMergeAlarmService } from "./application-merge.alarm.service";

@Component({
  selector: "alarm-application-merge",
  styleUrls: ["./application-merge.alarm.component.scss"],
  templateUrl: "./application-merge.alarm.component.html",
})
export class ApplicationMergeAlarmComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private referencelist_service: ReferenceListService,
    public validator_service: ValidatorService,
    private application_service: ApplicationService,
    private toastr_service: ToastrService,
    private passwordvalidator_service: PasswordValidatorService,
    private application_merge_alarm_service: ApplicationMergeAlarmService,
    private passwordpolicy_service: PasswordPolicyService,
    private location: Location,
    public translate: TranslateService,
    private alert_dialog: MatDialog,
    private global_service: GlobalService,
    private passwordpolicyscreenservice: PasswordpolicyService
  ) {}

  passwordpolicy = new PasswordPolicyModel();

  ngOnInit() {
    this.getCountryCodes();
    this.getMetaData();
    this.getDataWithParams();
  }

  is_edit: boolean = false;
  is_save: boolean = false;
  is_add: boolean;
  application: Application = new Application();
  users: UserModel = new UserModel();
  is_loading: boolean = false;
  is_metadata_loading: boolean = false;
  selected_country_code: any = {};
  country_code_list = [];
  security_mode_list: Array<ReferenceListModel>;
  mobile_number: string = "";
  showPolicy = new PasswordPolicyModel();
  passwordStartWith: string = "";

  setLoading(arg: boolean) {
    this.is_loading = arg;
  }
  setMetaLoading(arg: boolean) {
    this.is_metadata_loading = arg;
  }
  getDataWithParams() {
    this.route.queryParams.subscribe((params) => {
      if (params && params.id) {
        this.is_edit = true;
        this.application.id = params.id;
        this.application.root_userid = params.root_userid;
        this.application.root_username = params.root_username;
        this.getData();
      }
    });
  }

  getCountryCodes() {
    var phone_util = new PhoneNumberUtil();
    this.country_code_list = [
      { name: "Afghanistan", code: "AF" },
      { name: "land Islands", code: "AX" },
      { name: "Albania", code: "AL" },
      { name: "Algeria", code: "DZ" },
      { name: "American Samoa", code: "AS" },
      { name: "AndorrA", code: "AD" },
      { name: "Angola", code: "AO" },
      { name: "Anguilla", code: "AI" },
      { name: "Antarctica", code: "AQ" },
      { name: "Antigua and Barbuda", code: "AG" },
      { name: "Argentina", code: "AR" },
      { name: "Armenia", code: "AM" },
      { name: "Aruba", code: "AW" },
      { name: "Australia", code: "AU" },
      { name: "Austria", code: "AT" },
      { name: "Azerbaijan", code: "AZ" },
      { name: "Bahamas", code: "BS" },
      { name: "Bahrain", code: "BH" },
      { name: "Bangladesh", code: "BD" },
      { name: "Barbados", code: "BB" },
      { name: "Belarus", code: "BY" },
      { name: "Belgium", code: "BE" },
      { name: "Belize", code: "BZ" },
      { name: "Benin", code: "BJ" },
      { name: "Bermuda", code: "BM" },
      { name: "Bhutan", code: "BT" },
      { name: "Bolivia", code: "BO" },
      { name: "Bosnia and Herzegovina", code: "BA" },
      { name: "Botswana", code: "BW" },
      { name: "Bouvet Island", code: "BV" },
      { name: "Brazil", code: "BR" },
      { name: "British Indian Ocean Territory", code: "IO" },
      { name: "Brunei Darussalam", code: "BN" },
      { name: "Bulgaria", code: "BG" },
      { name: "Burkina Faso", code: "BF" },
      { name: "Burundi", code: "BI" },
      { name: "Cambodia", code: "KH" },
      { name: "Cameroon", code: "CM" },
      { name: "Canada", code: "CA" },
      { name: "Cape Verde", code: "CV" },
      { name: "Cayman Islands", code: "KY" },
      { name: "Central African Republic", code: "CF" },
      { name: "Chad", code: "TD" },
      { name: "Chile", code: "CL" },
      { name: "China", code: "CN" },
      { name: "Christmas Island", code: "CX" },
      { name: "Cocos (Keeling) Islands", code: "CC" },
      { name: "Colombia", code: "CO" },
      { name: "Comoros", code: "KM" },
      { name: "Congo", code: "CG" },
      { name: "Congo, The Democratic Republic of the", code: "CD" },
      { name: "Cook Islands", code: "CK" },
      { name: "Costa Rica", code: "CR" },
      { name: 'Cote D"Ivoire', code: "CI" },
      { name: "Croatia", code: "HR" },
      { name: "Cuba", code: "CU" },
      { name: "Cyprus", code: "CY" },
      { name: "Czech Republic", code: "CZ" },
      { name: "Denmark", code: "DK" },
      { name: "Djibouti", code: "DJ" },
      { name: "Dominica", code: "DM" },
      { name: "Dominican Republic", code: "DO" },
      { name: "Ecuador", code: "EC" },
      { name: "Egypt", code: "EG" },
      { name: "El Salvador", code: "SV" },
      { name: "Equatorial Guinea", code: "GQ" },
      { name: "Eritrea", code: "ER" },
      { name: "Estonia", code: "EE" },
      { name: "Ethiopia", code: "ET" },
      { name: "Falkland Islands (Malvinas)", code: "FK" },
      { name: "Faroe Islands", code: "FO" },
      { name: "Fiji", code: "FJ" },
      { name: "Finland", code: "FI" },
      { name: "France", code: "FR" },
      { name: "French Guiana", code: "GF" },
      { name: "French Polynesia", code: "PF" },
      { name: "French Southern Territories", code: "TF" },
      { name: "Gabon", code: "GA" },
      { name: "Gambia", code: "GM" },
      { name: "Georgia", code: "GE" },
      { name: "Germany", code: "DE" },
      { name: "Ghana", code: "GH" },
      { name: "Gibraltar", code: "GI" },
      { name: "Greece", code: "GR" },
      { name: "Greenland", code: "GL" },
      { name: "Grenada", code: "GD" },
      { name: "Guadeloupe", code: "GP" },
      { name: "Guam", code: "GU" },
      { name: "Guatemala", code: "GT" },
      { name: "Guernsey", code: "GG" },
      { name: "Guinea", code: "GN" },
      { name: "Guinea-Bissau", code: "GW" },
      { name: "Guyana", code: "GY" },
      { name: "Haiti", code: "HT" },
      { name: "Heard Island and Mcdonald Islands", code: "HM" },
      { name: "Holy See (Vatican City State)", code: "VA" },
      { name: "Honduras", code: "HN" },
      { name: "Hong Kong", code: "HK" },
      { name: "Hungary", code: "HU" },
      { name: "Iceland", code: "IS" },
      { name: "India", code: "IN" },
      { name: "Indonesia", code: "ID" },
      { name: "Iran, Islamic Republic Of", code: "IR" },
      { name: "Iraq", code: "IQ" },
      { name: "Ireland", code: "IE" },
      { name: "Isle of Man", code: "IM" },
      { name: "Israel", code: "IL" },
      { name: "Italy", code: "IT" },
      { name: "Jamaica", code: "JM" },
      { name: "Japan", code: "JP" },
      { name: "Jersey", code: "JE" },
      { name: "Jordan", code: "JO" },
      { name: "Kazakhstan", code: "KZ" },
      { name: "Kenya", code: "KE" },
      { name: "Kiribati", code: "KI" },
      { name: 'Korea, Democratic People"S Republic of', code: "KP" },
      { name: "Korea, Republic of", code: "KR" },
      { name: "Kuwait", code: "KW" },
      { name: "Kyrgyzstan", code: "KG" },
      { name: 'Lao People"S Democratic Republic', code: "LA" },
      { name: "Latvia", code: "LV" },
      { name: "Lebanon", code: "LB" },
      { name: "Lesotho", code: "LS" },
      { name: "Liberia", code: "LR" },
      { name: "Libyan Arab Jamahiriya", code: "LY" },
      { name: "Liechtenstein", code: "LI" },
      { name: "Lithuania", code: "LT" },
      { name: "Luxembourg", code: "LU" },
      { name: "Macao", code: "MO" },
      { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
      { name: "Madagascar", code: "MG" },
      { name: "Malawi", code: "MW" },
      { name: "Malaysia", code: "MY" },
      { name: "Maldives", code: "MV" },
      { name: "Mali", code: "ML" },
      { name: "Malta", code: "MT" },
      { name: "Marshall Islands", code: "MH" },
      { name: "Martinique", code: "MQ" },
      { name: "Mauritania", code: "MR" },
      { name: "Mauritius", code: "MU" },
      { name: "Mayotte", code: "YT" },
      { name: "Mexico", code: "MX" },
      { name: "Micronesia, Federated States of", code: "FM" },
      { name: "Moldova, Republic of", code: "MD" },
      { name: "Monaco", code: "MC" },
      { name: "Mongolia", code: "MN" },
      { name: "Montenegro", code: "ME" },
      { name: "Montserrat", code: "MS" },
      { name: "Morocco", code: "MA" },
      { name: "Mozambique", code: "MZ" },
      { name: "Myanmar", code: "MM" },
      { name: "Namibia", code: "NA" },
      { name: "Nauru", code: "NR" },
      { name: "Nepal", code: "NP" },
      { name: "Netherlands", code: "NL" },
      { name: "Netherlands Antilles", code: "AN" },
      { name: "New Caledonia", code: "NC" },
      { name: "New Zealand", code: "NZ" },
      { name: "Nicaragua", code: "NI" },
      { name: "Niger", code: "NE" },
      { name: "Nigeria", code: "NG" },
      { name: "Niue", code: "NU" },
      { name: "Norfolk Island", code: "NF" },
      { name: "Northern Mariana Islands", code: "MP" },
      { name: "Norway", code: "NO" },
      { name: "Oman", code: "OM" },
      { name: "Pakistan", code: "PK" },
      { name: "Palau", code: "PW" },
      { name: "Palestinian Territory, Occupied", code: "PS" },
      { name: "Panama", code: "PA" },
      { name: "Papua New Guinea", code: "PG" },
      { name: "Paraguay", code: "PY" },
      { name: "Peru", code: "PE" },
      { name: "Philippines", code: "PH" },
      { name: "Pitcairn", code: "PN" },
      { name: "Poland", code: "PL" },
      { name: "Portugal", code: "PT" },
      { name: "Puerto Rico", code: "PR" },
      { name: "Qatar", code: "QA" },
      { name: "Reunion", code: "RE" },
      { name: "Romania", code: "RO" },
      { name: "Russian Federation", code: "RU" },
      { name: "RWANDA", code: "RW" },
      { name: "Saint Helena", code: "SH" },
      { name: "Saint Kitts and Nevis", code: "KN" },
      { name: "Saint Lucia", code: "LC" },
      { name: "Saint Pierre and Miquelon", code: "PM" },
      { name: "Saint Vincent and the Grenadines", code: "VC" },
      { name: "Samoa", code: "WS" },
      { name: "San Marino", code: "SM" },
      { name: "Sao Tome and Principe", code: "ST" },
      { name: "Saudi Arabia", code: "SA" },
      { name: "Senegal", code: "SN" },
      { name: "Serbia", code: "RS" },
      { name: "Seychelles", code: "SC" },
      { name: "Sierra Leone", code: "SL" },
      { name: "Singapore", code: "SG" },
      { name: "Slovakia", code: "SK" },
      { name: "Slovenia", code: "SI" },
      { name: "Solomon Islands", code: "SB" },
      { name: "Somalia", code: "SO" },
      { name: "South Africa", code: "ZA" },
      { name: "South Georgia and the South Sandwich Islands", code: "GS" },
      { name: "Spain", code: "ES" },
      { name: "Sri Lanka", code: "LK" },
      { name: "Sudan", code: "SD" },
      { name: "Suriname", code: "SR" },
      { name: "Svalbard and Jan Mayen", code: "SJ" },
      { name: "Swaziland", code: "SZ" },
      { name: "Sweden", code: "SE" },
      { name: "Switzerland", code: "CH" },
      { name: "Syrian Arab Republic", code: "SY" },
      { name: "Taiwan, Province of China", code: "TW" },
      { name: "Tajikistan", code: "TJ" },
      { name: "Tanzania, United Republic of", code: "TZ" },
      { name: "Thailand", code: "TH" },
      { name: "Timor-Leste", code: "TL" },
      { name: "Togo", code: "TG" },
      { name: "Tokelau", code: "TK" },
      { name: "Tonga", code: "TO" },
      { name: "Trinidad and Tobago", code: "TT" },
      { name: "Tunisia", code: "TN" },
      { name: "Turkey", code: "TR" },
      { name: "Turkmenistan", code: "TM" },
      { name: "Turks and Caicos Islands", code: "TC" },
      { name: "Tuvalu", code: "TV" },
      { name: "Uganda", code: "UG" },
      { name: "Ukraine", code: "UA" },
      { name: "United Arab Emirates", code: "AE" },
      { name: "United Kingdom", code: "GB" },
      { name: "United States", code: "US" },
      { name: "United States Minor Outlying Islands", code: "UM" },
      { name: "Uruguay", code: "UY" },
      { name: "Uzbekistan", code: "UZ" },
      { name: "Vanuatu", code: "VU" },
      { name: "Venezuela", code: "VE" },
      { name: "Viet Nam", code: "VN" },
      { name: "Virgin Islands, British", code: "VG" },
      { name: "Virgin Islands, U.S.", code: "VI" },
      { name: "Wallis and Futuna", code: "WF" },
      { name: "Western Sahara", code: "EH" },
      { name: "Yemen", code: "YE" },
      { name: "Zambia", code: "ZM" },
      { name: "Zimbabwe", code: "ZW" },
    ];
    this.country_code_list = _.map(this.country_code_list, (country) => {
      const country_code = phone_util.getCountryCodeForRegion(country.code);
      return {
        code: country.code,
        name: country.name,
        display_text: `${country.code} +${country_code}`,
      };
    });
    this.selected_country_code = this.country_code_list[0];
  }
  async getData() {
    this.setLoading(true);
    try {
      let application_req = new ApplicationWrapper();
      let users_wrapper = new UserModel();
      application_req.id = this.application.id;
      application_req.root_username = this.application.root_username;
      let application_list = await this.application_service.get(
        application_req
      );

      if (application_list.length > 0) {
        this.application = application_list[0];
      }
      if (this.application.mobile_number != null) {
        this.mobile_number = this.setCountryCodeAndFormatMobileNumberAsNational(
          this.application.mobile_number
        );
      }
      if(this.is_edit) {
        this.application.root_username = this.global_service.formatrootuser(
          this.application.identifier
        );
      }
    } catch (error) {
      var message: string = this.translate.instant(
        "Couldn't get application data"
      );
      if (error.error && error.error instanceof ErrorResponse) {
        message = error.error.message;
      }
      this.toastr_service.error(message);
    } finally {
      this.setLoading(false);
    }
  }

  setCountryCodeAndFormatMobileNumberAsNational(_mobile_number: string) {
    var mobile_number = _mobile_number;
    if (mobile_number.length > 0) {
      mobile_number =
        mobile_number.indexOf("+") != -1 ? mobile_number : `+${mobile_number}`;
      try {
        var number = PhoneNumberUtil.getInstance().parse(mobile_number);
        var region = PhoneNumberUtil.getInstance().getRegionCodeForCountryCode(
          number.getCountryCode()
        );
        var country_code_index = _.findIndex(this.country_code_list, (v) => {
          return v.code == region;
        });
        if (country_code_index != -1) {
          this.selected_country_code =
            this.country_code_list[country_code_index];
          mobile_number = number.getNationalNumber().toString();
        } else {
          mobile_number = "";
        }
      } catch (error) {
        mobile_number = "";
      }
    }
    return mobile_number;
  }
  async getMetaData() {
    this.setMetaLoading(true);
    try {
      let referencelist_req = new ReferenceListModel();
      referencelist_req.identifier = ReferenceListModel.TYPES.SECURITY_MODE;
      let [security_mode_list, passwordpolicy] = await Promise.all([
        this.referencelist_service.get(referencelist_req),
        this.passwordpolicy_service.get(),
      ]);
      this.security_mode_list = security_mode_list;
      this.passwordpolicy = passwordpolicy;
    } catch (error) {
      var message: string = "Couldn't get data";
      if (error.error && error.error instanceof ErrorResponse) {
        message = error.error.message;
      }
      this.toastr_service.error(message);
    } finally {
      this.setMetaLoading(false);
    }
  }
  onChangeCountryCode(e) {
    this.application.mobile_number = "";
  }
  getformatedMobileNumber(mobile: string) {
    var phone_util = new PhoneNumberUtil();
    var phone_number = phone_util.parseAndKeepRawInput(
      mobile,
      this.selected_country_code.code
    );
    return phone_util.format(phone_number, PhoneNumberFormat.INTERNATIONAL);
  }
  cancel(ApplicationMergeForm: NgForm) {
    if (ApplicationMergeForm.dirty && this.is_save === false) {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          message: this.translate.instant(
            "All changes will be lost. Do you wish to cancel?"
          ),
        },
      });
      alert.afterClosed().subscribe((can_back) => {
        if (can_back) {
          this.location.back();
        }
      });
    } else this.location.back();
  }
  async generate_app_key() {
    try {
      this.application = await this.application_service.generateAppKey(
        this.application
      );
      this.toastr_service.success(this.translate.instant("App key generated"));
    } catch (error) {
      var message: string = this.translate.instant("Couldn't save application");
      if (error.error && error.error instanceof ErrorResponse) {
        message = error.error.message;
      }
      this.toastr_service.error(message);
    }
  }

  async save(form: NgForm) {
    try {
      if (!form.valid) {
        return;
      }
      this.application.mobile_number = this.getformatedMobileNumber(
        this.mobile_number
      );
      if (this.application.auth_type_id == 0) {
        this.security_mode_list.forEach((v) => {
          if (v.identifier == "NATIVE") {
            this.application.auth_type_id = v.id;
          }
        });
      }
      if (!this.is_edit || this.application.is_root_changed) {
        if (
          this.application.root_password !=
          this.application.root_confirmpassword
        ) {
          this.toastr_service.error("Password mismatch");
          return false;
        }
      }
      // if (!this.is_edit || (this.is_edit && this.application.is_root_changed)) {
      //   if (this.passwordpolicy.id > 0) {
      //     if (
      //       !this.passwordvalidator_service.validate(
      //         this.passwordpolicy,
      //         this.application.root_password
      //       )
      //     ) {
      //       return;
      //     }
      //   }
      // }
      if (
        (this.is_edit == false && this.passwordpolicy.id > 0) ||
        (this.is_edit &&
          this.application.is_root_changed &&
          this.passwordpolicy.id > 0)
      ) {
        let val = this.passwordvalidator_service.validate(
          this.passwordpolicy,
          this.application.root_password
        );
        if (!val) {
          return false;
        }
      }
      if (!this.is_edit) {
        this.application.root_user_role =
          this.global_service.formatrootroleprofile(
            this.application.identifier
          );
      }
      this.setLoading(true);
      if (this.is_edit == false) {
        this.application = await this.application_service.insert(
          this.application
        );
        this.toastr_service.success("Application registered successfully");
      } else {
        this.application = await this.application_service.update(
          this.application
        );
        this.toastr_service.success("Application updated successfully");
      }
      this.is_save = true;
      if (this.is_edit == false) {
        this.application = new Application();
        form.resetForm();
      }
      // }
    } catch (error) {
      var error_msg =
        error && error.error && error.error.message ? error.error.message : "";
      this.toastr_service.error(
        error_msg.length > 0 ? error_msg : "Internal error"
      );
    } finally {
      this.setLoading(false);
    }
  }
  setUserName(app_name: string) {
    if (app_name != null) {
      this.application.identifier = app_name.toUpperCase().split(" ").join("_");
      this.application.root_username = this.global_service.formatrootuser(
        this.application.identifier
      );
    }
    else this.application.root_username = "";
  }
}
