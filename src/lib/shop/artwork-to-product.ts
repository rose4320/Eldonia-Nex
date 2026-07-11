import { normalizeDigitalProductUrls } from "@/lib/shop/product-download";
import type { ArtworkMediaType, ShopProductType } from "@/types/database";

const SHOP_REALM_VALUES = new Set(["apparel", "digital", "goods", "tools", "books"]);

const DIGITAL_MEDIA_TYPES = new Set<ArtworkMediaType>(["image", "document", "audio", "video", "model"]);

export type ArtworkShopListingInput = {
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  media_url: string;
  media_type: ArtworkMediaType;
  category: string;
};

export type ArtworkShopListingFields = {
  title: string;
  description: string | null;
  category: string;
  product_type: ShopProductType;
  image_url: string | null;
  download_url: string | null;
};

function mapShopCategory(artworkCategory: string): string {
  return SHOP_REALM_VALUES.has(artworkCategory) ? artworkCategory : "goods";
}

function defaultProductType(mediaType: ArtworkMediaType): ShopProductType {
  return DIGITAL_MEDIA_TYPES.has(mediaType) ? "digital" : "physical";
}

export function buildArtworkShopListing(
  artwork: ArtworkShopListingInput,
): ArtworkShopListingFields {
  const isImageProduct = artwork.media_type === "image";
  const coverUrl = artwork.thumbnail_url ?? (isImageProduct ? artwork.media_url : null);
  const distributionUrl = isImageProduct ? artwork.media_url : artwork.media_url;

  if (defaultProductType(artwork.media_type) === "digital") {
    const normalized = normalizeDigitalProductUrls({
      imageUrl: coverUrl ?? "",
      downloadUrl: isImageProduct ? artwork.media_url : distributionUrl,
    });

    return {
      title: artwork.title,
      description: artwork.description,
      category: mapShopCategory(artwork.category),
      product_type: "digital",
      image_url: normalized.image_url,
      download_url: normalized.download_url,
    };
  }

  return {
    title: artwork.title,
    description: artwork.description,
    category: mapShopCategory(artwork.category),
    product_type: "physical",
    image_url: coverUrl ?? artwork.media_url,
    download_url: null,
  };
}
