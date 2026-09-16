import type { User } from "firebase/auth";

export type UserRole = "guest" | "user" | "admin";

export type Permission =
  | "manage_backup"
  | "export_data"
  | "sync_cloud"
  | "edit_profile"
  | "admin_access";

export interface UserAuthorization {
  role: UserRole;
  isAnonymous: boolean;
  isAuthenticated: boolean;
  permissions: Permission[];
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: ["manage_backup", "export_data"],
  user: ["manage_backup", "export_data", "sync_cloud", "edit_profile"],
  admin: ["manage_backup", "export_data", "sync_cloud", "edit_profile", "admin_access"],
};

export function getUserRole(user: User | null): UserRole {
  if (!user) return "guest";
  if (user.isAnonymous) return "guest";
  // Custom claim check if present in token/metadata in future
  return "user";
}

export function getUserPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = getUserPermissions(role);
  return permissions.includes(permission);
}
