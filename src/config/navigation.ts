// Primary navigation structure — which pages exist, in what order, is a
// code/deploy-time decision, not a content-editor decision (Blueprint 2.2).
// `labelKey` looks up the localized label in the "Navigation" message namespace.

export type NavItem = {
  href: string;
  labelKey: "home" | "about" | "roots" | "culture" | "events" | "news" | "archive" | "contact";
};

export const navigation: NavItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/roots", labelKey: "roots" },
  { href: "/culture", labelKey: "culture" },
  { href: "/events", labelKey: "events" },
  { href: "/news", labelKey: "news" },
  { href: "/archive", labelKey: "archive" },
  { href: "/contact", labelKey: "contact" },
];
