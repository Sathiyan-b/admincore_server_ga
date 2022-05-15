import { Injectable } from "@angular/core";
import { PrivilegePermissions } from "../../model/permission.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class UserPermissionGuardService {
  constructor(private auth_service: AuthService) {}

  hasCanManageRegisteredAppPermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_REGISTERED_APPLICATIONS],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }

  hasCanManageEnterpriseHierarchyPermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_ENTERPRISE],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanDesignEnterpriseHierarchyPermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_DESIGN_ENTERPRISE_LAYOUT],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanViewUserPermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_VIEW_USER],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }

  hasCanViewTeamPermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_VIEW_TEAMS],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanViewPointOfCarePermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_VIEW_POINT_OF_CARE],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanViewRolePermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_VIEW_ROLEPROFILE],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanManagePasswordPolicyPermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_PASSWORD_POLICY],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanViewPasswordPolicyPermissions() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_VIEW_PASSWORD_POLICY],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanManagePointofCarePermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_POINT_OF_CARE],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanManageEscalationRoutingPermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_ESCALATION],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanViewRoleProfilePermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_VIEW_ROLEPROFILE],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanManageRoleProfilePermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_ROLEPROFILE],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanManageSettingPermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_SETTINGS],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanManageTeamsPermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_TEAM],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
  hasCanManageUsersPermission() {
    return this.auth_service.matchPermissions(
      [PrivilegePermissions.PERMISSIONS.CAN_MANAGE_USER],
      PrivilegePermissions.PERMISSION_CHECK_MODE.SOME
    );
  }
}
