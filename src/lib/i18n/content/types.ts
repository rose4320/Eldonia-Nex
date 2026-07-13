import type { PageMessages } from "@/lib/i18n/content/page-messages";
import type { GuidesContent } from "@/lib/i18n/content/guides-messages";
import type { FormsContent } from "@/lib/i18n/content/forms-messages";
import type { SettingsUiContent } from "@/lib/i18n/content/settings-ui-messages";
import type { EngagementContent } from "@/lib/i18n/content/engagement-messages";
import type { SignupContent } from "@/lib/i18n/content/signup-messages";
import type { HomeAuthenticatedContent } from "@/lib/i18n/content/home-authenticated-messages";

export type ModuleContent = {
  name: string;
  description: string;
};

export type HelpLinkContent = {
  href: string;
  title: string;
  description: string;
  icon: string;
  requiresAuth: boolean;
};

export type ContentCatalog = {
  common: {
    available: string;
    comingSoon: string;
    search: string;
    searchResults: (term: string) => string;
    noResults: string;
    clearFilter: string;
    viewAll: string;
    post: string;
    loginToPost: string;
    firstPost: string;
    all: string;
    countItems: (count: number, unit: string) => string;
  };
  chrome: {
    searchPlaceholder: string;
    searchSubmit: string;
    login: string;
    signup: string;
    logout: string;
    menu: string;
    menuClose: string;
    footerTech: string;
    footerHelp: string;
    footerPartners: string;
    footerSitemap: string;
    footerCopyright: string;
    expNext: string;
  };
  home: {
    eyebrow: string;
    heroTitle: string;
    heroBody: string;
    ctaSettings: string;
    ctaPostArtwork: string;
    ctaSignup: string;
    modules: ModuleContent[];
  };
  homeAuthenticated?: HomeAuthenticatedContent;
  gallery: {
    heading: string;
    lead: string;
    upload: string;
    searchPlaceholder: string;
    searchAria: string;
    empty: string;
    emptySearch: string;
    realmFiltersAria: string;
  };
  shop: {
    heading: string;
    lead: string;
    productUnit: string;
    empty: string;
    viewAll: string;
    sidebarRealms: string;
    searchPlaceholder: string;
    searchAria: string;
    searchSubmit: string;
    cart: (count: number) => string;
    backToShop: string;
    seller: string;
    aboutHeading: string;
    descriptionPending: string;
    detailsHeading: string;
    labelRealm: string;
    labelType: string;
    labelNexusPrime: string;
    typeDigital: string;
    typePhysical: string;
    typeDigitalLong: string;
    typePhysicalLong: string;
    nexusPrimeEligible: string;
    nexusPrimeYes: string;
    nexusPrimeNo: string;
    comparePrice: string;
    addToCart: string;
    buyNow: string;
    getFree: string;
    adding: string;
    loginToBuy: string;
    loginToGetFree: string;
    secureCheckout: string;
    freeCheckoutHint: string;
    downloadProduct: string;
    downloadLead: string;
    downloadLoginRequired: string;
    inStock: (count: number) => string;
    outOfStock: string;
    addToCartFailed: string;
    checkoutFailed: string;
    cartHeading: string;
    cartEyebrow: string;
    cartEmpty: string;
    cartBrowseShop: string;
    cartRemove: string;
    cartTotal: string;
    cartSubtotal: string;
    cartLoginCheckout: string;
    claimFree: string;
    freeClaimLoading: string;
    freeClaimFailed: string;
    alreadyOwned: string;
    ownedHint: string;
    sellerPreviewHint: string;
    freeAlreadyClaimed: string;
    shippingHeading: string;
    shippingLead: string;
    shippingName: string;
    shippingCountry: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingAddress2: string;
    shippingFeeLabel: string;
    checkoutShippingOnly: string;
    checkoutStripe: string;
    checkoutLoading: string;
    heroHeading: string;
    featured: string;
    ratingAria: (rating: number) => string;
    instantDownload: string;
    nexusPrimeBadge: string;
  };
  events: {
    heading: string;
    headingPast: string;
    lead: string;
    empty: string;
    viewAll: string;
    eventUnit: string;
    sidebarRealms: string;
    sidebarFormat: string;
    sidebarWhen: string;
    whenUpcoming: string;
    whenPast: string;
    whenAll: string;
    featured: string;
    heroHeading: string;
  };
  community: {
    heading: string;
    lead: string;
    boardsHeading: string;
    threadsHeading: string;
    recentThreads: string;
    empty: string;
    boardDescriptions: Record<
      "general" | "gallery" | "shop" | "events" | "works" | "lore",
      string
    >;
    boardNames: Record<
      "general" | "gallery" | "shop" | "events" | "works" | "lore",
      string
    >;
  };
  works: {
    heading: string;
    lead: string;
    empty: string;
  };
  lab: {
    heading: string;
    lead: string;
    empty: string;
    flowHint: string;
    memberCount: (n: number) => string;
    previewLink: string;
    previewBanner: string;
  };
  help: {
    eyebrow: string;
    heading: string;
    lead: string;
    ticketsLoginTitle: string;
    ticketsLoginLead: string;
    slaHeading: string;
    slaFirstResponse: string;
    slaHours: string;
    slaEmail: string;
    slaFirstResponseValue: string;
    slaHoursValue: string;
    links: HelpLinkContent[];
  };
  auth: {
    loginTitle: string;
    loginLead: string;
    signupTitle: string;
    signupLead: string;
    email: string;
    password: string;
    loginSubmit: string;
    loginLoading: string;
    signupSubmit: string;
    signupLoading: string;
    noAccount: string;
    hasAccount: string;
    confirmEmailSent: string;
    signupConfirmEmail: string;
    authCallbackFailed: string;
    forgotPasswordLink: string;
    forgotPasswordTitle: string;
    forgotPasswordLead: string;
    forgotPasswordSubmit: string;
    forgotPasswordLoading: string;
    forgotPasswordSent: string;
    forgotPasswordFailed: string;
    resetPasswordTitle: string;
    resetPasswordLead: string;
    newPassword: string;
    confirmPassword: string;
    resetPasswordSubmit: string;
    resetPasswordLoading: string;
    resetPasswordFailed: string;
    passwordMismatch: string;
    backToLogin: string;
    oauthDivider: string;
    continueWithGoogle: string;
    oauthLoading: string;
  };
  settings: {
    heading: string;
    lead: string;
  };
  notFound: {
    heading: string;
    body: string;
    home: string;
    help: string;
  };
  pages: PageMessages;
  guides: GuidesContent;
  forms: FormsContent;
  settingsUi: SettingsUiContent;
  engagement: EngagementContent;
  signup: SignupContent;
};

export type ContentKey = keyof ContentCatalog;
