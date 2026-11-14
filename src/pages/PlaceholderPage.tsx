import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import PageContainer from "../components/layout/PageContainer";

export default function PlaceholderPage({
  title,
  description,
  emptyMessage,
}: {
  title: string;
  description: string;
  emptyMessage: string;
}) {
  return (
    <PageContainer>
      <p className="foundation-eyebrow">FLORACONNECT</p>
      <h1>{title}</h1>
      <p className="foundation-description">{description}</p>
      <EmptyState title="Coming soon" message={emptyMessage} />
      <Link className="foundation-home-link" to="/">
        Return to home
      </Link>
    </PageContainer>
  );
}
