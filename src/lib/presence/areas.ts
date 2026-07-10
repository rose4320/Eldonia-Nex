/** Infer Eldonia module area from a pathname. */
export function inferPresenceArea(pathname: string): string {
  const path = (pathname || "/").split("?")[0].toLowerCase();
  if (path === "/" || path === "") return "home";
  if (path.startsWith("/lp")) return "lp";
  if (path.includes("/lab")) return "lab";
  if (path.startsWith("/gallery")) return "gallery";
  if (path.startsWith("/shop")) return "shop";
  if (path.startsWith("/community")) return "community";
  if (path.startsWith("/events") || path.startsWith("/event")) return "events";
  if (path.startsWith("/works")) return "works";
  if (path.startsWith("/quest")) return "quest";
  if (path.startsWith("/portfolio") || path.startsWith("/passport")) return "portfolio";
  if (path.startsWith("/settings")) return "settings";
  if (path.startsWith("/auth") || path.startsWith("/login") || path.startsWith("/signup"))
    return "auth";
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/notifications")) return "notifications";
  return "other";
}

export type PresencePayload = {
  path: string;
  area: string;
  title?: string;
};
