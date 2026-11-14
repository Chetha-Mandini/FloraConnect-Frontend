import {
  CalendarDays,
  Flower2,
  Handshake,
  MapPin,
  Megaphone,
  Sprout,
  UsersRound,
} from "lucide-react";

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

// Illustrative community categories only; these do not represent real organizations.
export const associationPreviews = [
  {
    title: "Flower Grower Groups",
    description:
      "Connect with growers sharing knowledge and practical cultivation experience.",
    label: "Grower community",
    Icon: Sprout,
  },
  {
    title: "Horticultural Societies",
    description:
      "Explore communities focused on learning, cultivation and plant appreciation.",
    label: "Learning community",
    Icon: Flower2,
  },
  {
    title: "Regional Chapters",
    description:
      "Discover local connections across Sri Lanka’s diverse growing regions.",
    label: "Local connection",
    Icon: MapPin,
  },
];

// Synthetic preview copy only; these are not published or official announcements.
export const announcementPreviews = [
  {
    title: "Platform updates",
    description:
      "Updates about FloraConnect features and availability will appear here.",
    label: "Sample preview",
    Icon: Megaphone,
  },
  {
    title: "Growing resources",
    description:
      "Practical learning resources for flower growers will be shared when available.",
    label: "Sample preview",
    Icon: Sprout,
  },
  {
    title: "Community opportunities",
    description:
      "Verified events and opportunities will be listed when their details are confirmed.",
    label: "Sample preview",
    Icon: CalendarDays,
  },
];

export const howItWorksSteps = [
  {
    title: "Explore flowers",
    description:
      "Browse the flower catalogue and discover varieties that interest you.",
    to: "/flowers",
    linkLabel: "Browse flowers",
    Icon: Flower2,
  },
  {
    title: "Find your community",
    description:
      "Explore growers and associations to learn about the wider flower community.",
    to: "/associations",
    linkLabel: "Explore associations",
    Icon: UsersRound,
  },
  {
    title: "Join FloraConnect",
    description:
      "Create an account to take your next step as a grower, enthusiast or organization.",
    to: "/register",
    linkLabel: "Create an account",
    Icon: Handshake,
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
