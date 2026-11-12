import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import PageContainer from "../components/layout/PageContainer";

export default function NotFoundPage() {
  return (
    <PageContainer>
      <p className="foundation-eyebrow">404 · PAGE NOT FOUND</p>
      <h1>We couldn’t find that page</h1>
      <p className="foundation-description">
        The address may be incorrect, or the page may have moved.
      </p>
      <EmptyState
        title="Nothing is growing here yet"
        message="Use the link below to return to the FloraConnect home page."
      />
      <Link className="foundation-home-link" to="/">
        Return to home
      </Link>
    </PageContainer>
  );
}
