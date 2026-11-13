import type { Role } from "../services/api/auth";

let superAdmin: ReturnType<typeof importSuperAdmin> | undefined;
function importSuperAdmin() {
  return import("../pages/SuperAdminDashboard");
}
export function loadSuperAdmin() {
  return (superAdmin ??= importSuperAdmin().catch((error) => {
    superAdmin = undefined;
    throw error;
  }));
}
let platformAdmin:
  Promise<typeof import("../pages/AdminDashboard")> | undefined;
export function loadPlatformAdmin() {
  return (platformAdmin ??= import("../pages/AdminDashboard").catch((error) => {
    platformAdmin = undefined;
    throw error;
  }));
}
let account: Promise<typeof import("../pages/AccountPage")> | undefined;
export function loadAccount() {
  return (account ??= import("../pages/AccountPage").catch((error) => {
    account = undefined;
    throw error;
  }));
}
export function preloadAccountRoute(role: Role = "SUPER_ADMIN") {
  return role === "SUPER_ADMIN"
    ? loadSuperAdmin()
    : role === "PLATFORM_ADMIN"
      ? loadPlatformAdmin()
      : loadAccount();
}
