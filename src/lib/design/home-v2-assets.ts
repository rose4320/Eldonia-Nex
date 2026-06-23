/** Home v2 mockup assets — paths under /public/design/v2 */
export const HOME_V2_ASSETS = {
  hero: "/design/v2/home-hero.png",
  /** 既存ブランドロゴ（public/logo.png） */
  logo: "/logo.png",
  investorPinBadge: "/design/v2/investor-pin-badge.png",
  sheets: {
    modules: "/design/v2/module-icons-sheet.png",
    questFlow: "/design/v2/quest-flow-icons-sheet.png",
    growthMetrics: "/design/v2/growth-metrics-icons-sheet.png",
    investor: "/design/v2/investor-icons-sheet.png",
  },
  modules: {
    quest: "/design/v2/icons/modules/icon-quest.png",
    gallery: "/design/v2/icons/modules/icon-gallery.png",
    shop: "/design/v2/icons/modules/icon-shop.png",
    events: "/design/v2/icons/modules/icon-events.png",
    community: "/design/v2/icons/modules/icon-community.png",
    works: "/design/v2/icons/modules/icon-works.png",
  },
  questFlow: {
    participate: "/design/v2/icons/quest-flow/icon-participate.png",
    challenge: "/design/v2/icons/quest-flow/icon-challenge.png",
    evaluated: "/design/v2/icons/quest-flow/icon-evaluated.png",
    rewards: "/design/v2/icons/quest-flow/icon-rewards.png",
  },
  metrics: {
    exp: "/design/v2/icons/metrics/icon-exp.png",
    credit: "/design/v2/icons/metrics/icon-credit.png",
    revenue: "/design/v2/icons/metrics/icon-revenue.png",
  },
} as const;

export type HomeV2ModuleKey = keyof typeof HOME_V2_ASSETS.modules;
