export const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "Flowers", to: "/flowers" },
  { label: "Growers", to: "/growers" },
  { label: "Associations", to: "/associations" },
  { label: "Events", to: "/events" },
  { label: "Announcements", to: "/announcements" },
  { label: "Flower Varieties", to: "/flowers?tab=varieties" },
] as const;

export const footerLinks = [
  navigationLinks[0],
  { label: "Flowers & Plants", to: navigationLinks[1].to },
  navigationLinks.find((link) => link.to === "/events")!,
  { label: "Contact", to: "/contact" },
] as const;

export const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
] as const;
