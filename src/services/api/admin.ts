import { apiEndpoints } from "../../config/api";
import { api } from "./auth";
export type AdminRecord = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  status?: string;
  type?: string;
  contact?: string;
  location?: string;
  emailVerified?: boolean;
  createdAt?: string;
  action?: string;
  details?: string;
  evidenceUrl?: string;
  decisionReason?: string;
  organizationType?: string;
  position?: string;
  count?: number;
  userId?: { name: string; email: string; emailVerified: boolean } | null;
};
export type RecordPage = {
  records: AdminRecord[];
  total: number;
  page: number;
  pageSize: number;
};
export type Summary = { counts: Record<string, number>; audit: AdminRecord[] };
export type TrendPoint = { _id: string; count: number };
export type Analytics = {
  users: TrendPoint[];
  organizations: TrendPoint[];
  businesses: TrendPoint[];
  byRole: TrendPoint[];
};
export const adminApi = {
  summary: (signal: AbortSignal) =>
    api<Summary>(apiEndpoints.admin.summary, { signal }),
  records: (resource: string, query: URLSearchParams, signal: AbortSignal) =>
    api<RecordPage>(apiEndpoints.admin.records(resource), {
      method: "POST",
      body: Object.fromEntries(query),
      signal,
    }),
  analytics: (query: URLSearchParams, signal: AbortSignal) =>
    api<Analytics>(`${apiEndpoints.admin.analytics}?${query}`, { signal }),
};
