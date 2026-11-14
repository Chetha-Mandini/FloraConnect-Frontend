import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  flowers,
  referenceFlowerCount,
} from "../features/flowers/data/flowers";
import type { Flower } from "../features/flowers/data/flowers";
import { normalizeFlowerText } from "../features/flowers/normalizeFlowerText";
import FlowerCatalogueCard from "../features/flowers/FlowerCatalogueCard";
import FlowerDetailDialog from "../features/flowers/FlowerDetailDialog";
import EmptyState from "../components/ui/EmptyState";
import PageContainer from "../components/layout/PageContainer";

const PAGE_SIZE = 40;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function FlowerCataloguePage() {
  const [params, setParams] = useSearchParams();
  const catalogueTab =
    params.get("tab") === "growers"
      ? "growers"
      : params.get("tab") === "varieties" ||
          ["q", "category", "letter", "collection", "sort", "page"].some(
            (key) => params.has(key),
          )
        ? "varieties"
        : "growers";
  const [selected, setSelected] = useState<Flower | null>(null);
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const letter = params.get("letter") ?? "";
  const collection = params.get("collection") ?? "";
  const sort = params.get("sort") === "za" ? "za" : "az";
  const filtered = flowers.filter(
    (f) =>
      (!category ||
        normalizeFlowerText(f.name) === normalizeFlowerText(category)) &&
      (!letter || f.name.toUpperCase().startsWith(letter)) &&
      (collection !== "reference" || f.source) &&
      (collection !== "featured" || f.featured) &&
      normalizeFlowerText(
        `${f.name} ${f.scientific ?? ""} ${f.category} ${(f.aliases ?? []).join(" ")}`,
      ).includes(normalizeFlowerText(query)),
  );
  const ordered = sort === "za" ? [...filtered].reverse() : filtered;
  const totalPages = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE));
  const requestedPage = Number(params.get("page"));
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1;
  const visible = ordered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(query || category || letter || collection);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    next.set("tab", "varieties");
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next, { replace: key === "q" });
  }
  function changePage(value: number) {
    update("page", value === 1 ? "" : String(value));
    document
      .getElementById("catalogue-results")
      ?.scrollIntoView?.({ behavior: "instant", block: "start" });
  }

  return (
    <PageContainer className="catalogue-page">
      <header className="catalogue-intro">
        <div>
          <p className="foundation-eyebrow">DISCOVER FLORACONNECT</p>
          <h1>Flowers</h1>
          <p className="foundation-description">
            Explore growers' flowers or discover flower varieties from around
            the world.
          </p>
        </div>
        {catalogueTab === "varieties" && (
          <div className="catalogue-total">
            <strong>{flowers.length.toLocaleString("en-LK")}</strong>
            <span>
              flower references
              <br />
              to explore
            </span>
          </div>
        )}
      </header>
      <nav className="catalogue-tabs" aria-label="Flower collections">
        <Link
          to="/flowers?tab=growers"
          aria-current={catalogueTab === "growers" ? "page" : undefined}
        >
          Grower Flowers
        </Link>
        <Link
          to="/flowers?tab=varieties"
          aria-current={catalogueTab === "varieties" ? "page" : undefined}
        >
          World Flower Varieties
        </Link>
      </nav>
      {catalogueTab === "growers" ? (
        <section aria-label="Grower Flowers">
          <EmptyState
            title="No grower flowers listed yet"
            message="Flowers offered by growers will appear here. Browse World Flower Varieties for botanical information and inspiration."
          />
        </section>
      ) : (
        <section aria-label="World Flower Varieties">
          <p className="catalogue-note">
            Flower varieties from around the world. This reference catalogue
            provides botanical information and inspiration; it does not indicate
            grower stock or availability.
          </p>
          <form
            className="catalogue-toolbar"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="catalogue-search-field">
              <span className="sr-only">Search flowers</span>
              <Search size={19} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => update("q", event.target.value)}
                placeholder="Search flowers or scientific names..."
              />
            </label>
            <label className="catalogue-select-field">
              <SlidersHorizontal size={16} aria-hidden="true" />
              <span className="sr-only">Browse collection</span>
              <select
                value={collection}
                onChange={(event) => update("collection", event.target.value)}
              >
                <option value="">All collections</option>
                <option value="featured">Featured varieties</option>
                <option value="reference">Imported flower guide</option>
              </select>
            </label>
            <label className="catalogue-select-field">
              <span className="sr-only">Filter by first letter</span>
              <select
                value={letter}
                onChange={(event) => update("letter", event.target.value)}
              >
                <option value="">All starting letters</option>
                {letters.map((value) => {
                  const count = flowers.filter((flower) =>
                    flower.name.toUpperCase().startsWith(value),
                  ).length;
                  return (
                    <option key={value} value={value} disabled={!count}>
                      {value} ({count})
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="catalogue-select-field">
              <span className="sr-only">Sort flowers</span>
              <select
                value={sort}
                onChange={(event) => update("sort", event.target.value)}
              >
                <option value="az">Name: A to Z</option>
                <option value="za">Name: Z to A</option>
              </select>
            </label>
          </form>
          <div className="catalogue-results-bar" id="catalogue-results">
            <p role="status">
              {ordered.length
                ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, ordered.length)} of ${ordered.length} varieties`
                : "0 varieties found"}
            </p>
            <div>
              {category && (
                <span className="catalogue-filter-chip">
                  {category}
                  <button
                    type="button"
                    aria-label="Remove flower variety filter"
                    onClick={() => update("category", "")}
                  >
                    <X size={13} />
                  </button>
                </span>
              )}
              {hasFilters && (
                <button
                  type="button"
                  className="catalogue-clear"
                  onClick={() => setParams({ tab: "varieties" })}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
          {visible.length ? (
            <div className="catalogue-grid">
              {visible.map((flower) => (
                <FlowerCatalogueCard
                  key={flower.id}
                  flower={flower}
                  onSelect={setSelected}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching flowers"
              message="Try another flower name, collection or letter, or clear your filters."
            />
          )}
          {totalPages > 1 && (
            <nav className="catalogue-pagination" aria-label="Catalogue pages">
              <button
                className="button outline"
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
              >
                <ArrowLeft size={16} /> Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="button outline"
                disabled={page === totalPages}
                onClick={() => changePage(page + 1)}
              >
                Next <ArrowRight size={16} />
              </button>
            </nav>
          )}
          <aside className="catalogue-source-note">
            <p>
              {referenceFlowerCount} named entries and their supplied
              descriptions were imported from the{" "}
              <a
                href="https://www.bioexplorer.net/plants/flowers/"
                target="_blank"
                rel="noreferrer"
              >
                BioExplorer flower guide
              </a>
              . Names and excerpts are preserved as reference material; they are
              not verified Sri Lankan growing or medical advice.
            </p>
            <a href="/credits/catalogue-images.html">Catalogue photo credits</a>
          </aside>
        </section>
      )}
      <Link className="foundation-home-link" to="/">
        Return to home
      </Link>
      {selected && (
        <FlowerDetailDialog
          flower={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </PageContainer>
  );
}
