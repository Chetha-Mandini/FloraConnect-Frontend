import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import PageContainer from "../components/layout/PageContainer";

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
    <PageContainer>
      <p className="foundation-eyebrow">FLORACONNECT COMMUNITY</p>
      <h1>{title}</h1>
      <p className="foundation-description">{description}</p>
      <EmptyState title="Stay connected" message={message} />
      <Link className="foundation-home-link" to="/">
        Return to home
      </Link>
    </PageContainer>
  );
}
