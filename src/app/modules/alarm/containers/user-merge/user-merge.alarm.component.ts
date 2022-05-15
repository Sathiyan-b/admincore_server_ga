/// <reference path="../password-policy/password.policy.service.ts" />
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
import { UserMergeAlarmService } from "./user-merge.alarm.service";
import ActionRes from "src/app/modules/global/model/actionres.model";
import { UserModel } from "../../models/user.model";
import {
  RoleProfileModel,
  UserRoleProfile,
} from "../../models/roleprofile.model";
import { EnterpriseModel } from "../../models/enterprise.model";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { EventEmitter } from "protractor";
import { ToastrService } from "ngx-toastr";
import ActionReq from "src/app/modules/global/model/actionreq.model";
import { ValidatorService } from "src/app/modules/global/service//validator/validator.service";
import { ErrorStateMatcher } from "@angular/material/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { BehaviorSubject, forkJoin } from "rxjs";
import { ActiveDirectoryModel } from "../../models/appsettings.model";
import { LocationModel } from "../../models/location.model";
import { GlobalService } from "src/app/modules/global/service/shared/global.service";
import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import { ReferenceListModel } from "../../models/referencelist.model";
import { PasswordValidatorService } from "src/app/modules/global/service/validator/passwordvalidator.service";
import { PasswordpolicyService } from "../password-policy/password.policy.service";
import PasswordPolicyModel from "../../models/passwordpolicy.model";
import { UserMergeUserModel } from "./usermergeuser.model";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { PopupCommonComponent } from "../popup-common/popup-common.component";
@Component({
  selector: "alarm-user-merge",
  styleUrls: ["./user-merge.alarm.component.scss"],
  templateUrl: "./user-merge.alarm.component.html",
})
export class UserMergeAlarmComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private user_merge_alarm_service: UserMergeAlarmService,
    private toastr_service: ToastrService,
    public validator_service: ValidatorService,
    private global_service: GlobalService,
    private passwordvalidator_service: PasswordValidatorService,
    private passwordpolicy_service: PasswordpolicyService,
    public translate: TranslateService,
    private alert_dialog: MatDialog
  ) {}
  country_code_list = [];
  selected_country_code: any = {};
  mobile_number: string = "";
  user_type_list = [];
  // matcher = new MyErrorStateMatcher();
  is_edit: boolean = false;
  is_add: boolean = false;
  is_dirty: boolean = true;
  is_save: boolean = false;
  user: UserModel | any;
  role_profile_list = [];
  // auth_mode: string = localStorage["alarm_auth_mode"];
  is_ldap: boolean =
    this.global_service.app_settings.auth_mode == "LDAP" ? true : false;
  active_directory_credentials: ActiveDirectoryModel =
    new ActiveDirectoryModel();
  enterprise_list = [];
  location_list = [];
  passwordpolicy = new PasswordPolicyModel();
  LanguageList = [];
  passwordStartWith: string = "";
  selectedLang: string = "en-GB";

  ngOnInit() {
    // country codes
    this.getCountryCodes();
    // initialize user
    this.user = new UserMergeUserModel();
    // for confirm_password password
    this.user.confirm_password = "";
    // get languages
    this.getlanguagedata();
    // get data
    this.getData();
    // getting id from route parameter
    if (!this.is_ldap) {
      this.route.queryParams.subscribe((params) => {
        this.user.id = _.get(params, "id", 0);
        if (this.user.id != 0) {
          this.is_edit = true;
          this.getUserData();
        }
      });
    } else {
      console.log("route -- ", this.route);
      this.route.queryParams.subscribe((params) => {
        this.user.login = _.get(params, "user_login", "");
        this.user.first_name = _.get(params, "user_display_name", "");
        this.user.email = _.get(params, "user_email", "");
        this.user.mobile_number = _.get(params, "user_mobile_number", "");
        this.user.active_directory_dn = _.get(
          params,
          "user_active_directory_dn",
          ""
        );
        if (this.user.login != null && this.user.login.length > 0)
          this.is_edit = true;
      });
      this.getDataforAD();
    }
    if (this.is_edit == false) {
      this.selected_country_code = this.country_code_list[0];
      this.passwordpolicy_service.getPasswordPolicy().subscribe(
        (resp: ActionRes<Array<PasswordPolicyModel>>) => {
          if (resp.item.length > 0) {
            this.passwordpolicy = resp.item[0];
          }
        },
        (error) => {
          this.toastr_service.error(
            "Error in fetching details of Password Policy"
          );
        }
      );
    }
  }

  getlanguagedata() {
    this.user_merge_alarm_service.loadLanguages().subscribe(
      (resp: any) => {
        if (resp.item) {
          this.LanguageList = resp.item.lang_code;
        }
      },
      (error) => {
        this.toastr_service.error("Error loading Languages");
      }
    );
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
  }
  getData() {
    this.user_merge_alarm_service.getRoleProfiles().subscribe(
      (resp: ActionRes<Array<UserRoleProfile>>) => {
        if (resp.item) {
          this.role_profile_list = resp.item;
        }
      },
      (error) => {
        this.toastr_service.error("Error loading Roles");
      }
    );
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
    // console.log("mobile_num", mobile_number);
    return mobile_number;
  }
  getUserData() {
    this.user_merge_alarm_service.getUsersById(this.user.id).subscribe(
      (resp: ActionRes<Array<UserMergeUserModel>>) => {
        if (_.get(resp, "item.0", null) != null) {
          this.user = resp.item[0];
          this.user.confirm_password = this.user.password;
          this.mobile_number =
            this.setCountryCodeAndFormatMobileNumberAsNational(
              this.user.mobile_number
            );
          this.selectedLang = this.user.lang_code;
        }
      },
      (error) => {
        this.toastr_service.error(
          `Error in fetching details of User with id ${this.user.id}`
        );
      }
    );
  }

  getDataforAD() {
    var active_directory_dn: string = this.user.active_directory_dn;
    active_directory_dn = active_directory_dn.substring(
      active_directory_dn.indexOf(",DC=") + 1,
      active_directory_dn.length
    );
    this.user_merge_alarm_service
      .getActiveDirectoryCredentials(active_directory_dn)
      .subscribe((resp: ActionRes<ActiveDirectoryModel>) => {
        if (resp.item) {
          this.active_directory_credentials = resp.item;
          console.log("Output: ", this.active_directory_credentials);
          this.getLDAPUserData();
        }
      });
  }

  getLDAPUserData() {
    /* var ldap_info: object = { "name": "Quanto", "base_domain_name": "DC=eazysaas,DC=local", 
    "url": "ldap://10.20.1.10", "user_name": "vijay@eazysaas.local", 
    "password": "Eazy1234$", "user_account": "bill.cox" };  */
    var ldap_info: object = {
      url: this.active_directory_credentials.url,
      base_db: this.active_directory_credentials.dn,
      user_name: this.active_directory_credentials.user_name,
      password: this.active_directory_credentials.password,
      user_dn: this.user.active_directory_dn,
    };
    // var ldap_info: object = this.active_directory_credentials;
    console.log("Params to get user ldap groups:", ldap_info);
    var request = new ActionReq<any>({
      item: ldap_info,
    });
    var subscription_list = [];
    var subscription = this.user_merge_alarm_service.getLDAPUserData(request);
    subscription_list.push(subscription);
    console.log("subs list length: ", subscription_list.length);

    forkJoin(subscription_list).subscribe(
      (resp_list: Array<ActionRes<Array<RoleProfileModel>>>) => {
        var userLDAPGroups: Array<RoleProfileModel> =
          new Array<RoleProfileModel>();
        _.forEach(resp_list, (resp, index) => {
          console.log("user LDAP data response: ", resp);
          if (resp.item && resp.item.length > 0) {
            userLDAPGroups = _.concat(userLDAPGroups, resp.item);
          }
        });
        console.log("user LDAP collection variable 2: ", userLDAPGroups);
        _.forEach(userLDAPGroups, (v, k) => {
          v.id = k + 1;
        });
        this.user.roleprofile = userLDAPGroups;
        console.log("this.user -- ",this.user);
      }
    );
  }

  onEmailIdAsLoginIdChange(e: MatCheckboxChange) {
    if (e.checked == true) {
      this.user.login = this.user.email;
    }
  }

  cancel(userMergeForm: NgForm) {
    if (userMergeForm.dirty && this.is_save === false) {
      const alert = this.alert_dialog.open(PopupCommonComponent, {
        data: {
          message: this.translate.instant(
            `All changes will be lost. Do you wish to cancel?`
          ),
        },
      });
      alert.afterClosed().subscribe((is_reset) => {
        if (is_reset) {
          this.router.navigate(["alarm/accesscontrol"]);
        }
      });
    } else this.router.navigate(["alarm/accesscontrol"]);
  }

  onChangeCountryCode(e) {
    this.mobile_number = "";
  }
  getformatedMobileNumber(mobile: string) {
    var phone_util = new PhoneNumberUtil();
    var phone_number = phone_util.parseAndKeepRawInput(
      mobile,
      this.selected_country_code.code
    );
    return phone_util.format(phone_number, PhoneNumberFormat.INTERNATIONAL);
  }
  addNew = (form: NgForm) => {
    this.is_add = false;
    this.user = new UserMergeUserModel();
    form.resetForm();
    this.selected_country_code = this.country_code_list[0];
    this.mobile_number = "";
    this.selectedLang = "en-GB";
  };
  save(form: NgForm) {
    try {
      if (!form.valid) {
        if (this.user.roleprofile.length === 0) {
          this.toastr_service.error(
            this.translate.instant("Role field is empty")
          );
        }
        return;
      }
      if (this.user.password != this.user.confirm_password) {
        this.toastr_service.error(this.translate.instant("Password mismatch"));
        return false;
      }
      if (this.is_edit == false) {
        this.user.user_type_id = UserModel.UserType.NATIVE;
      }
      if (this.is_edit == false && this.passwordpolicy.id > 0) {
        let val = this.passwordvalidator_service.validate(
          this.passwordpolicy,
          this.user.password
        );
        if (!val) {
          return false;
        }
      }
      var user_data_str: UserMergeUserModel = JSON.parse(
        localStorage.getItem("user_data")
      );
      this.user.app_id = user_data_str.app_id;
      this.user.lang_code = this.selectedLang;
      /* formatting mobile number */
      this.user.mobile_number = this.getformatedMobileNumber(
        this.mobile_number
      );
      /* forming request object */
      var request = new ActionReq<UserMergeUserModel>({
        item: this.user,
      });
      this.user_merge_alarm_service.saveUser(request).subscribe(
        (resp) => {
          if (request.item.id == 0) {
            this.is_save = true;
            this.toastr_service.success(
              this.translate.instant("User saved successfully")
            );
          } else {
            this.is_save = true;
            this.toastr_service.success(
              this.translate.instant("User updated successfully")
            );
          }
          this.is_add = true;
          this.user.id = _.get(resp, "item.id", 0);
        },
        (error) => {
          var error_msg =
            error && error.error && error.error.message
              ? error.error.message
              : "";
          this.toastr_service.error(
            error_msg.length > 0 ? error_msg : "Error saving"
          );
        }
      );
    } catch (e) {
      this.toastr_service.error("Internal error");
    }
  }
}
