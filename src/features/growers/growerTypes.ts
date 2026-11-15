export type PublishedFlowerPlant = {
  id: string;
  name: string;
  image: string | null;
  category?: string | null;
};

export type PublicGrower = {
  id: string;
  displayName: string;
  profileImage: string | null;
  district: string;
  province: string;
  biography: string;
  specialization: string;
  publishedFlowerPlants: PublishedFlowerPlant[];
};

export type GrowerPageStatus =
  "unavailable" | "loading" | "error" | "ready" | "not-found";
