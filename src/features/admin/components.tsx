import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Inbox } from "lucide-react";
import type { AdminRecord, TrendPoint } from "../../services/api/admin";

import { readable } from "./format";
export function StatusBadge({ value }: { value?: string }) {
  return (
    <span
      className={`ad-badge ${["SUSPENDED", "REJECTED", "REMOVED"].includes(value ?? "") ? "ad-badge-danger" : ""}`}
    >
      {readable(value)}
    </span>
  );
}
export function EmptyState({
  title = "No records found",
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="ad-empty">
      <Inbox size={28} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{children ?? "Try another search or adjust your filters."}</p>
    </div>
  );
}
export function MetricCard({
  title,
  count,
  to,
}: {
  title: string;
  count: number;
  to: string;
}) {
  return (
    <Link className="ad-metric" to={to}>
      <span>
        {title}
        <ArrowUpRight size={16} aria-hidden="true" />
      </span>
      <strong>{count.toLocaleString()}</strong>
      <small>View records</small>
    </Link>
  );
}
export function LoadingSkeleton() {
  return (
    <div
      className="ad-loading"
      role="status"
      aria-label="Loading administrative records"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} />
      ))}
    </div>
  );
}
export function DataTable({
  records,
  columns,
  onSelect,
}: {
  records: AdminRecord[];
  columns: { label: string; render: (record: AdminRecord) => ReactNode }[];
  onSelect?: (record: AdminRecord) => void;
}) {
  if (!records.length) return <EmptyState />;
  return (
    <div className="ad-table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.label} scope="col">
                {c.label}
              </th>
            ))}
            {onSelect && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              {columns.map((c) => (
                <td key={c.label}>{c.render(record)}</td>
              ))}
              {onSelect && (
                <td>
                  <button
                    onClick={() => onSelect(record)}
                    aria-label={`View ${record.name ?? record.action ?? "record"}`}
                  >
                    View details
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (page: number) => void;
}) {
  return (
    <nav className="ad-pagination" aria-label="Table pagination">
      <span>
        {total.toLocaleString()} records · Page {page} of{" "}
        {Math.max(1, Math.ceil(total / 20))}
      </span>
      <div>
        <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <button
          disabled={page * 20 >= total}
          onClick={() => onChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
export function TrendChart({
  title,
  points,
}: {
  title: string;
  points: TrendPoint[];
}) {
  const max = Math.max(1, ...points.map((p) => p.count));
  return (
    <section className="ad-panel">
      <h2>{title}</h2>
      {points.length ? (
        <>
          <div
            className="ad-chart"
            role="img"
            aria-label={`${title}: ${points.map((p) => `${p._id}: ${p.count}`).join(", ")}`}
          >
            {points.map((p) => (
              <div key={p._id} title={`${p._id}: ${p.count}`}>
                <span
                  style={{ height: `${Math.max(2, (p.count / max) * 130)}px` }}
                />
                <small>{p._id.slice(5)}</small>
              </div>
            ))}
          </div>
          <p className="ad-muted">
            Daily counts · Asia/Colombo · Dates with records shown
          </p>
        </>
      ) : (
        <EmptyState title="No activity in this period" />
      )}
    </section>
  );
}
