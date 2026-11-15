import { ChevronDown, Search } from "lucide-react";

export type GrowerFilters = {
  search: string;
  district: string;
  specialization: string;
};

export default function GrowerDirectoryFilters({
  filters,
  districts,
  specializations,
  disabled = false,
  onChange,
  onReset,
}: {
  filters: GrowerFilters;
  districts: string[];
  specializations: string[];
  disabled?: boolean;
  onChange: (filters: GrowerFilters) => void;
  onReset: () => void;
}) {
  const hasFilters = Boolean(
    filters.search || filters.district || filters.specialization,
  );

  return (
    <form
      className="catalogue-toolbar grower-directory-toolbar"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="catalogue-search-field grower-directory-search">
        <span className="sr-only">Search growers by name</span>
        <Search size={19} aria-hidden="true" />
        <input
          type="search"
          value={filters.search}
          placeholder="Search growers by name..."
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
        />
      </label>
      <label className="catalogue-select-field grower-directory-select">
        <span className="sr-only">District</span>
        <select
          aria-label="District"
          value={filters.district}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...filters, district: event.target.value })
          }
        >
          <option value="">All districts</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </label>
      <label className="catalogue-select-field grower-directory-select">
        <span className="sr-only">Specialization</span>
        <select
          aria-label="Specialization"
          value={filters.specialization}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...filters, specialization: event.target.value })
          }
        >
          <option value="">All specializations</option>
          {specializations.map((specialization) => (
            <option key={specialization} value={specialization}>
              {specialization}
            </option>
          ))}
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </label>
      <button
        className="button outline grower-filter-reset"
        type="button"
        onClick={onReset}
        disabled={disabled || !hasFilters}
      >
        Reset Filters
      </button>
    </form>
  );
}
