import { CalendarDays, Handshake, Sprout, UsersRound } from "lucide-react";

export const features = [
  { title: "Discover Flowers", to: "/flowers", Icon: Sprout },
  { title: "Connect with Growers", to: "/growers", Icon: UsersRound },
  { title: "Attend Events", to: "/events", Icon: CalendarDays },
  { title: "Grow Together", to: "/associations", Icon: Handshake },
];

// Editorial categories, separate from live grower listings.
export const featuredCategories = [
  {
    name: "Roses",
    image: "featured-rose",
    alt: "Coral pink garden rose with layered petals and fresh green leaves",
    category: "Rose",
  },
  {
    name: "Orchids",
    image: "featured-orchid",
    alt: "White and pale lilac orchids on a gently curved flowering stem",
    category: "Orchid",
  },
  {
    name: "Anthuriums",
    image: "featured-anthurium",
    alt: "Glossy coral and red anthuriums among heart-shaped green leaves",
    category: "Anthurium",
  },
  {
    name: "Sunflowers",
    image: "featured-sunflower",
    alt: "Golden yellow sunflower with a detailed seed center in a green garden",
    category: "Sunflower",
  },
];

// Category inspiration only: no event dates, venues, or attendance are claimed.
export const eventPreviews = [
  {
    title: "Flower Exhibitions",
    image: "/images/events-greenhouse.png",
    alt: "Illustrative greenhouse filled with rows of colorful flowering plants",
  },
  {
    title: "Floriculture Workshops",
    image: "/images/events-workshop.png",
    alt: "Illustrative arrangement of pink and yellow flowers in a rustic vase",
  },
];

export const heroMessages = [
  {
    title: "Connect. Grow. Bloom Together.",
    description:
      "A unified platform for flower growers, buyers and associations across Sri Lanka.",
  },
  {
    title: "Discover. Connect. Grow.",
    description:
      "Explore beautiful blooms and find inspiration for your next growing journey.",
  },
  {
    title: "Local Roots. Shared Possibilities.",
    description:
      "Bring your passion for flowers to a community of growers, buyers and associations.",
  },
];
