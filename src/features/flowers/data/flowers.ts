import referenceEntries from "./flower-reference.json";
import imageIndex from "./flower-images.json";
import supplementIndex from "./flower-supplements.json";

export interface FlowerPhotoCredit {
  illustratedTaxon?: string;
  src: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  plantPage: string;
}

export interface Flower {
  aliases?: string[];
  id: string;
  name: string;
  scientific: string | null;
  category: string;
  detail: string;
  image: string | null;
  featured: boolean;
  source: string | null;
  photoCredit?: FlowerPhotoCredit;
}

const featuredFlowers = [
  {
    name: "Sunflower",
    scientific: "Helianthus annuus",
    image: "sunflower",
    category: "Cut flowers",
    detail:
      "Golden petals and bold flower heads bring warmth to sunny gardens and fresh arrangements. This sample is for growing inspiration; local availability has not been verified.",
  },
  {
    name: "Water Lily",
    scientific: "Nymphaea spp.",
    image: "water-lily",
    category: "Aquatic",
    detail:
      "A beautiful aquatic bloom for sunny ponds and water gardens. Discover local growers and learn about the varieties they cultivate.",
  },
  {
    name: "Anthurium",
    scientific: "Anthurium andraeanum",
    image: "anthurium",
    category: "Tropical",
    detail:
      "Loved for its glossy, heart-shaped spathes, anthurium brings a distinctly tropical character to gardens and floral arrangements.",
  },
  {
    name: "Orchid",
    scientific: "Dendrobium spp.",
    image: "orchid",
    category: "Orchids",
    detail:
      "Delicate blooms with remarkable character. Explore the diversity of orchids cultivated by passionate Sri Lankan growers.",
  },
  {
    name: "Chrysanthemum",
    scientific: "Chrysanthemum spp.",
    image: "chrysanthemum",
    category: "Cut flowers",
    detail:
      "Full, colorful blooms that bring texture to bouquets and gardens. Connect with growers to discover seasonal varieties.",
  },
  {
    name: "Rose",
    scientific: "Rosa spp.",
    image: "rose",
    category: "Cut flowers",
    detail:
      "A timeless garden favorite, celebrated for its varied forms, colors and fragrance. Find inspiration for your next growing project.",
  },
  {
    name: "Gerbera",
    scientific: "Gerbera jamesonii",
    image: "gerbera",
    category: "Cut flowers",
    detail:
      "Bright, cheerful daisy-like flowers that bring color to everyday spaces, from home gardens to freshly cut arrangements.",
  },
];

const referenceImages: Record<string, FlowerPhotoCredit> = imageIndex;
export const flowerSupplements: Record<
  string,
  { detail: string; source: string; aliases: string[] }
> = supplementIndex;
const featuredByName = new Map(
  featuredFlowers.map((flower) => [flower.name.toLowerCase(), flower]),
);
const referenceNames = new Set(
  referenceEntries.map((flower) => flower.name.toLowerCase()),
);

export const flowers: Flower[] = [
  ...referenceEntries.map((entry) => {
    const featured = featuredByName.get(entry.name.toLowerCase());
    const photo = referenceImages[entry.id];
    const supplement = flowerSupplements[entry.id];
    return {
      ...entry,
      detail: supplement?.detail ?? entry.detail,
      source: supplement?.source ?? entry.source,
      aliases: supplement?.aliases ?? [],
      scientific: featured?.scientific ?? entry.scientific,
      category: featured?.category ?? entry.category,
      image: featured ? `/images/${featured.image}.jpg` : (photo?.src ?? null),
      featured: Boolean(featured),
      photoCredit: featured ? undefined : photo,
    };
  }),
  ...featuredFlowers
    .filter((flower) => !referenceNames.has(flower.name.toLowerCase()))
    .map((flower) => ({
      ...flower,
      id: flower.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      image: `/images/${flower.image}.jpg`,
      featured: true,
      source: null,
    })),
].sort((left, right) => left.name.localeCompare(right.name, "en"));

export const referenceFlowerCount = referenceEntries.length;
