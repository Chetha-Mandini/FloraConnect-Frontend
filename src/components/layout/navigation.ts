export const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "Flowers & Plants", to: "/flowers" },
  { label: "Growers", to: "/growers" },
  { label: "Associations", to: "/associations" },
  { label: "Events", to: "/events" },
  { label: "Announcements", to: "/announcements" },
    { label: "World Flower Varieties", to: "/flowers?tab=varieties" },
] as const;

export const footerLinks = [
  navigationLinks[0],
  navigationLinks[1],
  navigationLinks.find((link) => link.to === "/events")!,
  { label: "Contact", to: "/contact" },
] as const;

export const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
] as const;
