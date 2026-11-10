import { Link } from "react-router-dom";

export default function Brand() {
  return (
    <Link className="brand" to="/" aria-label="FloraConnect home">
      <svg viewBox="0 0 52 57" aria-hidden="true">
        <path
          fill="#184a29"
          d="M25 55C9 49 8 35 8 35c15 0 18 13 17 20ZM27 55c-1-23 22-30 22-30s1 26-22 30Z"
        />
        <path d="M26 52 25 23M27 52l13-18" stroke="#f9f8ef" strokeWidth="1.4" />
        <ellipse
          cx="25"
          cy="13"
          rx="4.5"
          ry="11"
          fill="#e55478"
          transform="rotate(-8 25 13)"
        />
        <ellipse
          cx="15"
          cy="18"
          rx="4.5"
          ry="10"
          fill="#cb2f67"
          transform="rotate(-48 15 18)"
        />
        <ellipse
          cx="35"
          cy="16"
          rx="4.5"
          ry="10"
          fill="#ef956e"
          transform="rotate(32 35 16)"
        />
        <ellipse
          cx="11"
          cy="28"
          rx="4"
          ry="9"
          fill="#dc4778"
          transform="rotate(-76 11 28)"
        />
        <path d="m17 29 9 8 9-13" fill="#347a40" />
      </svg>
      <span>
        <span className="brand-name">
          <b>Flora</b>Connect
        </span>
        <span className="brand-tagline">SRI LANKA’S FLOWER COMMUNITY</span>
      </span>
    </Link>
  );
}
