/** 各モジュールページ見出し用アイコン（正方形表示） */
export const MODULE_ICONS = {
  gallery: "/aset/icons/modules/icon-gallery.png",
  lab: "/aset/lab_icon_1024.png",
  shop: "/aset/icons/modules/icon-shop.png",
  community: "/aset/icons/modules/icon-community.png",
  events: "/aset/icons/modules/icon-events.png",
  works: "/aset/icons/modules/icon-works.png",
  quest: "/aset/icons/modules/icon-quest.png",
} as const;

/** モジュール以外のページ見出し用アイコン */
export const PAGE_ICONS = {
  ...MODULE_ICONS,
  help: "/aset/lp/owl.png",
  investors: "/aset/lp/globe.png",
  settings: "/aset/logo.png",
  privacy: "/aset/logo.png",
  terms: "/aset/logo.png",
} as const;

export type ModuleIconKey = keyof typeof MODULE_ICONS;
export type PageIconKey = keyof typeof PAGE_ICONS;