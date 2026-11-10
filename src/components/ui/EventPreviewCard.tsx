import ShimmerImage from "./ShimmerImage";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

/** Illustrated event categories, never presented as confirmed event listings. */
export default function EventPreviewCard({
  title,
  image,
  alt,
}: {
  title: string;
  image: string;
  alt: string;
}) {
  return (
    <article className="event-card">
      <div className="event-card-image">
        <ShimmerImage
          src={image}
          alt={alt}
          width="600"
          height="360"
          loading="lazy"
        />
        <span className="event-date-badge" aria-label="No confirmed event date">
          <strong aria-hidden="true">{"\u2014"}</strong>
          <span>DATE TBA</span>
        </span>
      </div>
      <div className="event-card-content">
        <div>
          <h3>{title}</h3>
          <p>
            <MapPin size={16} aria-hidden="true" />
            Dates &amp; venues not published
          </p>
        </div>
        <Link
          className="round-arrow"
          to="/events"
          aria-label={`View community events: ${title}`}
        >
          <ArrowRight size={18} />
        </Link>
      </div>
    </article>
  );
}
