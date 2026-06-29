/** LP brand assets — source: repo root `aset/` → synced to `public/aset/` */
const LP_ASSET_VERSION = "0.4.2";

function lpAsset(path: string): string {
  return `${path}?v=${LP_ASSET_VERSION}`;
}

export const LP_ASSETS = {
  logo: lpAsset("/aset/logo.png"),
  hero: lpAsset("/aset/lp/hero.png"),
  world: lpAsset("/aset/lp/world.png"),
  pinBadge: lpAsset("/aset/lp/pin-badge.png"),
  globe: lpAsset("/aset/lp/globe.png"),
  ctaBg: lpAsset("/aset/lp/hero.png"),
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
    gallery: lpAsset("/aset/gallery_icon_1024.png"),
    community: lpAsset("/aset/community_icon_1024.png"),
    shop: lpAsset("/aset/shop_icon_1024.png"),
    event: lpAsset("/aset/event_icon_1024.png"),
    work: lpAsset("/aset/work_icon_1024.png"),
    lab: lpAsset("/aset/lab_icon_1024.png"),
  },
} as const;
