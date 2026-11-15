export type Grower = {
  id: string;
  name: string;
  district: string;
  province: string;
  specialization: string;
  biography: string;
  image: string | null;
  listings: GrowerListing[];
};

export type GrowerListing = {
  id: string;
  name: string;
  category: string;
  image: string | null;
};

// Preview data is intentionally isolated until a public backend contract exists.
export const previewGrowers: Grower[] = [
  {
    id: "nuwara-eliya-bloom",
    name: "Nuwara Eliya Bloom Garden",
    district: "Nuwara Eliya",
    province: "Central Province",
    specialization: "Roses & carnations",
    biography: "A family grower cultivating cool-climate flowers with care and patience.",
    image: "/images/flowers.jpg",
    listings: [
      { id: "preview-rose", name: "Garden Rose", category: "Rose", image: "/images/flowers.jpg" },
      { id: "preview-carnation", name: "Carnation", category: "Carnation", image: "/images/flowers.jpg" },
    ],
  },
  {
    id: "kandy-orchid-house",
    name: "Kandy Orchid House",
    district: "Kandy",
    province: "Central Province",
    specialization: "Orchids",
    biography: "Growing expressive orchid varieties for homes, gardens and celebrations.",
    image: "/images/featured-sunflower-720.webp",
    listings: [{ id: "preview-orchid", name: "Dendrobium Orchid", category: "Orchid", image: "/images/featured-sunflower-720.webp" }],
  },
  {
    id: "galle-tropical-blooms",
    name: "Galle Tropical Blooms",
    district: "Galle",
    province: "Southern Province",
    specialization: "Tropical flowers",
    biography: "A small coastal grower sharing bright tropical blooms from the south.",
    image: "/images/national-flower-hero.png",
    listings: [],
  },
];

export function getGrowers() {
  return Promise.resolve(previewGrowers);
}

export function getGrowerById(id: string) {
  return Promise.resolve(previewGrowers.find((grower) => grower.id === id));
}
