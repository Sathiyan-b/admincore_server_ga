import { Base } from "../../global/model/base.model";
export class AlarmActors extends Base {
  id: number = 0;
  alarm_id: number = 0;
  user_id: number = 0;
  role_profile_id: number = 0;
  user_team_id: number = 0;
  poc_id: number = 0;
  action_start: Date = new Date();
  action_end: Date = new Date();
  action_response: string = "";
  action_on: Date = new Date();
  is_read_only: boolean = false;
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
export class AlarmActorsWrapper extends AlarmActors {}
