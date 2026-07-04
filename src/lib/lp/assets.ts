/** LP brand assets — source: repo root `aset/` → synced to `public/aset/` */
const LP_ASSET_VERSION = "0.6.0";

function lpAsset(path: string): string {
  return `${path}?v=${LP_ASSET_VERSION}`;
}

export const LP_ASSETS = {
  logo: lpAsset("/aset/logo.png"),
  hero: lpAsset("/aset/lp/hero.png"),
  world: lpAsset("/aset/lp/world.png"),
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
  },
  features: {
    gallery: lpAsset("/aset/icons/modules/icon-gallery.png"),
    global: lpAsset("/aset/lp/globe.png"),
    market: lpAsset("/aset/icons/modules/icon-shop.png"),
  },
} as const;
