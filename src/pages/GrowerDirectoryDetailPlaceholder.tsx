import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import PageContainer from "../components/layout/PageContainer";

export default function GrowerDirectoryDetailPlaceholder({
  type,
}: {
  type: "flower" | "grower";
}) {
  const isFlower = type === "flower";
  const title = isFlower ? "Flower Listing" : "Grower Profile";

  return (
    <PageContainer>
      <p className="foundation-eyebrow">FLORACONNECT DIRECTORY</p>
      <h1>{title}</h1>
      <EmptyState
        title="Details are not available yet"
        message={
          isFlower
            ? "Flower listing details will appear here when the grower listings service is connected."
            : "Public grower profile details will appear here when the grower profiles service is connected."
        }
      />
      <Link
        className="foundation-home-link"
        to={isFlower ? "/flowers" : "/growers"}
      >
        {isFlower ? "Back to Flowers & Plants" : "Back to Growers"}
      </Link>
    </PageContainer>
  );
}
