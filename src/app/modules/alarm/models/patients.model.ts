import { Base } from "../../global/model/base.model";
export class Patients extends Base {
  id: number = 0;
  ihe_msg_id: number = 0;
  type_id: number = 0;
  identifier: string = "";
  identifier_type_id: number = 0;
  identifier_authority: string = "";
  dob: Date = new Date();
  first_name: string = "";
  middle_name: string = "";
  last_name: string = "";
  title_id: number = 0;
  gender_id: number = 0;
  gender: string = "";
  alias: string = "";
  race_id: number = 0;
  address_home: string = "";
  country_code: string = "";
  phone_home: string = "";
  phone_business: string = "";
  primary_language: string = "";
  marital_status_id: number = 0;
  religion_id: number = 0;
  primary_account_no: string = "";
  is_discharged: boolean = false;
  discharged_dttm: Date = new Date();
  is_alive: boolean = false;
  death_dttm: Date = new Date();
  is_registered: boolean = false;
  record_hash_key: string = "";
  enterprise_id: number = 0;
  ent_location_id: number = 0;
  row_key: string = "";
  created_by: number = 0;
  modified_by: number = 0;
  created_on: Date = new Date();
  modified_on: Date = new Date();
  is_active: boolean = false;
  is_suspended: boolean = false;
  parent_id: number = 0;
  is_factory: boolean = false;
  notes: string = "";
}
export class PatientsWrapper extends Patients {}
