import { Link } from "react-router-dom";
export default function Brand() {
  return (
    <Link className="brand" to="/" aria-label="FloraConnect home">
      <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <path
          d="M28 48C10 44 7 32 6 18c16 1 24 12 22 30Z"
          fill="#8eac77"
          stroke="#245c35"
          strokeWidth="1.2"
        />
        <path
          d="M29 42C18 25 26 11 40 3c4 17 1 30-11 39Z"
          fill="#769b61"
          stroke="#245c35"
          strokeWidth="1.2"
        />
        <path
          d="M30 49c2-14 12-19 23-18-4 13-12 19-23 18Z"
          fill="#a6be8e"
          stroke="#245c35"
          strokeWidth="1.2"
        />
        <path
          d="m15 26 14 24M37 10l-8 40m17-14L29 50v4"
          stroke="#245c35"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="m11 21 8 20M33 13l-7 17"
          stroke="#d8e4cb"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span>
        <span className="brand-name">
          <b>Flora</b>Connect
        </span>
        <span className="brand-tagline">SRI LANKA'S FLOWER COMMUNITY</span>
      </span>
    </Link>
  );
}
