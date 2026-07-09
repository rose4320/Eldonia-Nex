/** LP brand assets — source: repo root `aset/` → synced to `public/aset/` */
const LP_ASSET_VERSION = "0.9.1";

function lpAsset(path: string): string {
  return `${path}?v=${LP_ASSET_VERSION}`;
}

export const LP_ASSETS = {
  logo: lpAsset("/aset/logo.png"),
  hero: lpAsset("/aset/lp/hero.png"),
  world: lpAsset("/aset/lp/world-cut.png"),
  pinBadge: lpAsset("/aset/lp/pin-badge.png"),
  globe: lpAsset("/aset/lp/globe.png"),
  translation: lpAsset("/aset/lp/translation.png"),
  ctaBg: lpAsset("/aset/lp/cta-bg.png"),
  owl: lpAsset("/aset/lp/owl.png"),
  borders: {
    sheet: lpAsset("/aset/lp/border-sheet.png"),
    frameOrnate: lpAsset("/aset/lp/borders/frame-ornate.png"),
    dividerStar: lpAsset("/aset/lp/borders/divider-star.png"),
    dividerEnOrnate: lpAsset("/aset/lp/borders/divider-en-ornate.png"),
    dividerEnSimple: lpAsset("/aset/lp/borders/divider-en-simple.png"),
    dividerCrest: lpAsset("/aset/lp/borders/divider-crest.png"),
  },
  modules: {
    gallery: lpAsset("/aset/icons/modules/icon-gallery.png"),
    community: lpAsset("/aset/icons/modules/icon-community.png"),
    shop: lpAsset("/aset/icons/modules/icon-shop.png"),
    event: lpAsset("/aset/icons/modules/icon-events.png"),
    work: lpAsset("/aset/icons/modules/icon-works.png"),
    lab: lpAsset("/aset/lab_icon_1024.png"),
    quest: lpAsset("/aset/icons/modules/icon-quest.png"),
  },
  features: {
    gallery: lpAsset("/aset/icons/modules/icon-gallery.png"),
    global: lpAsset("/aset/lp/globe.png"),
    market: lpAsset("/aset/icons/modules/icon-shop.png"),
  },
  // Concept lifecycle (生まれる→育つ→実る→また種に)
  concept: {
    born: lpAsset("/aset/icons/modules/icon-gallery.png"),
    grow: lpAsset("/aset/icons/modules/icon-community.png"),
    fruit: lpAsset("/aset/lab_icon_1024.png"),
    cycle: lpAsset("/aset/icons/modules/icon-quest.png"),
  },
  // Concept cycle infographic (world-tree, 7-step ecosystem)
  conceptCycle: lpAsset("/aset/lp/concept-cycle.png"),
  // Clean world-tree art (text-free) for the animated cycle
  conceptTree: lpAsset("/aset/lp/concept-tree.png"),
  // Service card background scenes
  serviceBg: {
    gallery: lpAsset("/aset/lp/services/gallery.png"),
    community: lpAsset("/aset/lp/services/community.png"),
    shop: lpAsset("/aset/lp/services/shop.png"),
    event: lpAsset("/aset/lp/services/event.png"),
    work: lpAsset("/aset/lp/services/work.png"),
    lab: lpAsset("/aset/lp/services/lab.png"),
    quest: lpAsset("/aset/lp/services/quest.png"),
    portfolio: lpAsset("/aset/lp/services/portfolio.png"),
  },
} as const;
