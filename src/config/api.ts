// Public API paths are a contract, not secrets. Host configuration lives in env.ts.
// Components use these builders rather than duplicating endpoints.
const resourceId = (id: string) => {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  ) {
    throw new Error(
      "Invalid resource identifier. Refresh the page and try again.",
    );
  }
  return encodeURIComponent(id);
};
export const apiEndpoints = {
  health: "/health",
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    logout: "/auth/logout",
    profile: "/auth/profile",
    password: "/auth/password",
    verifyEmail: "/auth/verify-email",
    resendVerification: "/auth/resend-verification",
  },
  admin: {
    summary: "/admin/console/summary",
    analytics: "/admin/console/analytics",
    roles: "/admin/console/roles",
    records: (resource: string) => {
      if (
        ![
          "users",
          "applications",
          "organizations",
          "businesses",
          "audit-logs",
        ].includes(resource)
      )
        throw new Error("Unsupported administrative resource.");
      return `/admin/console/records/${resource}/query`;
    },
    editUser: (id: string) => `/admin/console/users/${resourceId(id)}`,
    userStatus: (id: string) => `/admin/users/${resourceId(id)}/status`,
    staffAssignment: (id: string) =>
      `/admin/users/${resourceId(id)}/platform-admin`,
    review: (id: string) => `/admin/applications/${resourceId(id)}/review`,
  },
  workspace: (superAdmin: boolean) => {
    const base = superAdmin ? "/admin" : "/platform-admin";
    return {
      overview: `${base}/overview`,
      applications: `${base}/applications`,
      users: `${base}/users`,
      review: (id: string) => `${base}/applications/${resourceId(id)}/review`,
      userStatus: (id: string) => `${base}/users/${resourceId(id)}/status`,
      staffAssignment: (id: string) =>
        `${base}/users/${resourceId(id)}/platform-admin`,
    };
  },
} as const;
