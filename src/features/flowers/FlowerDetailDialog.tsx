import { Leaf, ExternalLink } from "lucide-react";
import Modal from "../../components/ui/Modal";
import { FlowerPhoto } from "./FlowerCatalogueCard";
import type { Flower } from "./data/flowers";

export default function FlowerDetailDialog({
  flower,
  onClose,
}: {
  flower: Flower;
  onClose: () => void;
}) {
  return (
    <Modal
      title={flower.name}
      onClose={onClose}
      className="flower-detail-modal"
    >
      <div className="flower-detail-layout">
        <div className="flower-detail-visual">
          <FlowerPhoto key={flower.id} flower={flower} />
          <span className="flower-photo-caption">
            Representative botanical photography
          </span>
        </div>
        <div className="flower-detail-copy">
          <p className="flower-detail-eyebrow">
            FLORACONNECT BOTANICAL LIBRARY
          </p>
          <dl className="flower-detail-facts">
            {flower.scientific && (
              <div>
                <dt>Botanical name</dt>
                <dd>
                  <i>{flower.scientific}</i>
                </dd>
              </div>
            )}
            <div>
              <dt>Collection</dt>
              <dd>{flower.featured ? flower.category : "Flower reference"}</dd>
            </div>
          </dl>
          <h3>About this flower</h3>
          <p className="flower-detail-description">{flower.detail}</p>
          <aside className="flower-detail-note">
            <Leaf size={18} aria-hidden="true" />
            <p>
              A little botanical inspiration. Local availability and growing
              suitability have not been verified.
            </p>
          </aside>
          <details className="flower-detail-credits">
            <summary>Sources &amp; photography credits</summary>
            <div>
              {flower.source && (
                <p>
                  Description:{" "}
                  <a href={flower.source} target="_blank" rel="noreferrer">
                    BioExplorer flower guide <ExternalLink size={11} />
                  </a>{" "}
                  (supplied excerpt).
                </p>
              )}
              {flower.photoCredit ? (
                <>
                  <p>
                    Photo by {flower.photoCredit.author}.{" "}
                    <a
                      href={flower.photoCredit.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Wikimedia Commons
                    </a>{" "}
                    ·{" "}
                    <a
                      href={flower.photoCredit.licenseUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {flower.photoCredit.license}
                    </a>
                    .
                  </p>
                  {flower.photoCredit.illustratedTaxon && (
                    <p>
                      Illustrated taxon: {flower.photoCredit.illustratedTaxon}.
                      A common-name or cultivar entry may show a representative
                      species.
                    </p>
                  )}
                </>
              ) : (
                flower.image && (
                  <p>
                    <a href="/credits/images.html">
                      Photo attribution and license
                    </a>
                  </p>
                )
              )}
            </div>
          </details>
          <button
            type="button"
            className="button outline flower-detail-back"
            onClick={onClose}
          >
            Back to catalogue
          </button>
        </div>
      </div>
    </Modal>
  );
}
