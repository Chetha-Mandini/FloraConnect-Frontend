import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import GrowerAvatar from "./GrowerAvatar";
import type { PublicGrower } from "./growerTypes";

export default function GrowerCard({ grower }: { grower: PublicGrower }) {
  return (
    <article className="grower-directory-card">
      <GrowerAvatar
        name={grower.displayName}
        image={grower.profileImage}
        className="grower-card-photo"
      />
      <div className="grower-card-content">
        <h2>{grower.displayName}</h2>
        <p className="grower-card-location">{grower.district}</p>
        <span className="grower-specialization-tag">
          {grower.specialization}
        </span>
        <Link
          className="button primary grower-card-link"
          to={`/growers/${encodeURIComponent(grower.id)}`}
          aria-label={`View ${grower.displayName}'s profile`}
        >
          View Profile <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
