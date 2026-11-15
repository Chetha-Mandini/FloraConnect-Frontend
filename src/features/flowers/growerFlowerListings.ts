export interface GrowerFlowerListing {
  id: string;
  name: string;
  image: string | null;
  plantType: string;
  location: string;
  growerId: string;
  growerName: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
}

// No live grower-listings API is currently available in the frontend.
export const growerFlowerListings: GrowerFlowerListing[] = [];
