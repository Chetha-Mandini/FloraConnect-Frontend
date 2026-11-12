export const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "Explore Flowers", to: "/flowers" },
  { label: "Growers", to: "/growers" },
  { label: "Associations", to: "/associations" },
  { label: "Events", to: "/events" },
  { label: "Announcements", to: "/announcements" },
] as const;

export const footerLinks = [
  navigationLinks[0],
  navigationLinks[1],
  navigationLinks[4],
  { label: "Contact", to: "/contact" },
] as const;

export const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
] as const;
