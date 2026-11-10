import ShimmerImage from "../../components/ui/ShimmerImage";
import { useState } from "react";
import { ArrowUpRight, Flower2 } from "lucide-react";
import type { Flower } from "./data/flowers";

export function FlowerPhoto({
  flower,
  className = "",
}: {
  flower: Flower;
  className?: string;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return (
    <div className={`catalogue-photo ${className}`}>
      {flower.image && failedSource !== flower.image ? (
        <ShimmerImage
          src={flower.image}
          alt={`Representative botanical photograph of ${flower.name}`}
          width="400"
          height="300"
          loading="lazy"
          decoding="async"
          onError={() => setFailedSource(flower.image)}
        />
      ) : (
        <div className="catalogue-photo-missing">
          <Flower2 size={42} strokeWidth={1} aria-hidden="true" />
          <span>Botanical reference</span>
          <small>Photo not available</small>
        </div>
      )}
    </div>
  );
}

export default function FlowerCatalogueCard({
  flower,
  onSelect,
}: {
  flower: Flower;
  onSelect: (flower: Flower) => void;
}) {
  return (
    <article className="catalogue-item">
      <FlowerPhoto flower={flower} />
      <div className="catalogue-card-body">
        <span className="catalogue-card-category">
          {flower.featured ? flower.category : "FLOWER REFERENCE"}
        </span>
        <h2>{flower.name}</h2>
        {flower.scientific && (
          <p className="catalogue-scientific">
            <i>{flower.scientific}</i>
          </p>
        )}
        <p className="catalogue-card-description">{flower.detail}</p>
        <button
          type="button"
          className="catalogue-detail-button"
          onClick={() => onSelect(flower)}
          aria-label={`View details about ${flower.name}`}
        >
          View details <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
