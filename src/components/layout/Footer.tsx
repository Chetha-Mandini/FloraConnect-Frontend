import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Brand from "./Brand";
import ApiStatus from "../../features/health/ApiStatus";
import BotanicalBranch from "../ui/BotanicalBranch";
import { footerLinks, legalLinks } from "./navigation";

const socialChannels = [
  "Facebook",
  "YouTube",
  "LinkedIn",
  "Instagram",
] as const;

function SocialMark({ name }: { name: (typeof socialChannels)[number] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="currentColor"
      aria-hidden="true"
    >
      {name === "Facebook" && (
        <path d="M14 22v-9h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5c-.7-.1-1.8-.3-3-.3-3 0-5 1.8-5 5V9H7v4h3v9Z" />
      )}
      {name === "YouTube" && (
        <>
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <path d="m10 9 6 3-6 3Z" fill="#f6f8f2" />
        </>
      )}
      {name === "LinkedIn" && (
        <>
          <circle cx="5" cy="5" r="2" />
          <path d="M3 9h4v12H3ZM10 9h4v1.5c1-2 7-3 7 4V21h-4v-6c0-3-3-3-3 0v6h-4Z" />
        </>
      )}
      {name === "Instagram" && (
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" />
        </g>
      )}
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <svg
        className="footer-wave"
        viewBox="0 0 1440 45"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 12C100 0 150 45 280 18S460 10 570 22 780 0 920 20 1100 35 1210 15 1350 10 1440 20V45H0Z"
          fill="currentColor"
        />
      </svg>
      <BotanicalBranch className="footer-botanical footer-botanical-left" />
      <BotanicalBranch className="footer-botanical footer-botanical-right" />
      <div className="footer-main container">
        <div className="footer-brand">
          <Brand />
          <p>Sri Lanka&apos;s Flower Community</p>
        </div>
        <div className="footer-links">
          <h2>Quick Links</h2>
          <nav aria-label="Footer navigation">
            {footerLinks.map(({ label, to }) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-contact">
          <h2>Get in Touch</h2>
          <Link to="/contact">
            <Mail size={15} aria-hidden="true" />
            Contact FloraConnect
          </Link>
          <p>Verified details coming soon</p>
        </div>
        <div className="footer-social">
          <div className="footer-social-icons" aria-hidden="true">
            {socialChannels.map((name) => (
              <span className="footer-social-icon" key={name}>
                <SocialMark name={name} />
              </span>
            ))}
          </div>
          <p>Official social links coming soon</p>
        </div>
        <p className="footer-tagline">
          Together for a<br />
          Greener, Blooming Sri Lanka
          <svg viewBox="0 0 170 30" aria-hidden="true">
            <path
              d="M3 28C60 22 104 0 167 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </p>
      </div>
      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} FloraConnect. All rights reserved.</p>
        <div>
          {legalLinks.map(({ label, to }, index) => (
            <span key={to}>
              {index > 0 && <span aria-hidden="true">|</span>}
              {index > 0 && " "}
              <Link to={to}>{label}</Link>
            </span>
          ))}
        </div>
      </div>
      <div className="footer-utility container">
        <a href="/credits/images.html">Image credits</a>
        <ApiStatus />
      </div>
    </footer>
  );
}
