import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";

export default function CommunityPage({
  title,
  description,
  message,
}: {
  title: string;
  description: string;
  message: string;
}) {
  return (
    <main id="main" className="foundation-main">
      <p className="foundation-eyebrow">FLORACONNECT COMMUNITY</p>
      <h1>{title}</h1>
      <p className="foundation-description">{description}</p>
      <EmptyState title="Stay connected" message={message} />
      <Link className="foundation-home-link" to="/">
        Return to home
      </Link>
    </main>
  );
}
