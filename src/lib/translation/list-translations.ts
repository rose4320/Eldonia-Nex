import { getCuratedArtworkTranslations } from "@/lib/gallery/artwork-localized-meta";
import type { UiLocale } from "@/lib/i18n/locale";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";
import {
  getFieldTranslationsWithWarm,
  type FieldTranslationMap,
  type TranslationFieldSpec,
} from "@/lib/translation/field-translations";
import type {
  ArtworkWithCreator,
  JobListingWithPoster,
  NexusEventWithOrganizer,
  ShopProductWithSeller,
} from "@/types/database";

/** List/card views: cache + curated only — no warm or live Google on the request path. */
export const LIST_TRANSLATION_OPTS = { warmLimit: 0, liveLimit: 0 } as const;

type ListField = { resultKey: string; fieldName: string; text: string | null | undefined };

function mergeTranslationMaps(
  base: FieldTranslationMap,
  override: FieldTranslationMap,
): FieldTranslationMap {
  const merged = { ...base };
  for (const [groupId, values] of Object.entries(override)) {
    merged[groupId] = { ...merged[groupId], ...values };
  }
  return merged;
}

function buildSpecs(
  items: Array<{ id: string; fields: ListField[] }>,
  entityType: TranslationFieldSpec["entityType"],
): TranslationFieldSpec[] {
  const specs: TranslationFieldSpec[] = [];
  for (const item of items) {
    for (const field of item.fields) {
      const text = field.text?.trim();
      if (!text) continue;
      specs.push({
        groupId: item.id,
        resultKey: field.resultKey,
        entityType,
        entityId: item.id,
        fieldName: field.fieldName,
        sourceLocale: inferSourceLocale(text),
        sourceText: text,
      });
    }
  }
  return specs;
}

export async function getArtworkListTranslations(
  artworks: ArtworkWithCreator[],
  targetLocale: string,
  options?: { warmLimit?: number; liveLimit?: number },
): Promise<FieldTranslationMap> {
  const curated = getCuratedArtworkTranslations(artworks, targetLocale as UiLocale);
  if (targetLocale === "ja") return curated;

  const generic = await getFieldTranslationsWithWarm(
    buildSpecs(
      artworks.map((artwork) => ({
        id: artwork.id,
        fields: [{ resultKey: "title", fieldName: "title", text: artwork.title }],
      })),
      "gallery_artwork",
    ),
    targetLocale,
    options ?? LIST_TRANSLATION_OPTS,
  );
  return mergeTranslationMaps(generic, curated);
}

export async function getArtworkDetailTranslations(
  artwork: ArtworkWithCreator,
  targetLocale: string,
): Promise<Record<string, string>> {
  const curated = getCuratedArtworkTranslations([artwork], targetLocale as UiLocale);
  const map = await getFieldTranslationsWithWarm(
    buildSpecs(
      [
        {
          id: artwork.id,
          fields: [
            { resultKey: "title", fieldName: "title", text: artwork.title },
            { resultKey: "description", fieldName: "description", text: artwork.description },
            { resultKey: "story_excerpt", fieldName: "story_excerpt", text: artwork.story_excerpt },
          ],
        },
      ],
      "gallery_artwork",
    ),
    targetLocale,
    { warmLimit: 1, liveLimit: 3 },
  );
  const merged = mergeTranslationMaps(map, curated);
  return merged[artwork.id] ?? {};
}

export async function getProductListTranslations(
  products: ShopProductWithSeller[],
  targetLocale: string,
  options?: { warmLimit?: number; liveLimit?: number },
): Promise<FieldTranslationMap> {
  if (targetLocale === "ja") return {};
  return getFieldTranslationsWithWarm(
    buildSpecs(
      products.map((product) => ({
        id: product.id,
        fields: [
          { resultKey: "title", fieldName: "title", text: product.title },
          ...(product.description
            ? [{ resultKey: "description", fieldName: "description", text: product.description }]
            : []),
        ],
      })),
      "shop_product",
    ),
    targetLocale,
    options ?? LIST_TRANSLATION_OPTS,
  );
}

export async function getProductDetailTranslations(
  product: ShopProductWithSeller,
  targetLocale: string,
): Promise<Record<string, string>> {
  const map = await getFieldTranslationsWithWarm(
    buildSpecs(
      [
        {
          id: product.id,
          fields: [
            { resultKey: "title", fieldName: "title", text: product.title },
            { resultKey: "description", fieldName: "description", text: product.description },
          ],
        },
      ],
      "shop_product",
    ),
    targetLocale,
    { warmLimit: 1, liveLimit: 4 },
  );
  return map[product.id] ?? {};
}

export async function getEventListTranslations(
  events: NexusEventWithOrganizer[],
  targetLocale: string,
  options?: { warmLimit?: number; liveLimit?: number },
): Promise<FieldTranslationMap> {
  if (targetLocale === "ja") return {};
  return getFieldTranslationsWithWarm(
    buildSpecs(
      events.map((event) => ({
        id: event.id,
        fields: [
          { resultKey: "title", fieldName: "title", text: event.title },
          ...(event.description
            ? [{ resultKey: "description", fieldName: "description", text: event.description }]
            : []),
        ],
      })),
      "nexus_event",
    ),
    targetLocale,
    options ?? LIST_TRANSLATION_OPTS,
  );
}

export async function getEventDetailTranslations(
  event: NexusEventWithOrganizer,
  targetLocale: string,
): Promise<Record<string, string>> {
  const map = await getFieldTranslationsWithWarm(
    buildSpecs(
      [
        {
          id: event.id,
          fields: [
            { resultKey: "title", fieldName: "title", text: event.title },
            { resultKey: "description", fieldName: "description", text: event.description },
          ],
        },
      ],
      "nexus_event",
    ),
    targetLocale,
    { warmLimit: 1, liveLimit: 4 },
  );
  return map[event.id] ?? {};
}

export async function getJobListTranslations(
  jobs: JobListingWithPoster[],
  targetLocale: string,
  options?: { warmLimit?: number; liveLimit?: number },
): Promise<FieldTranslationMap> {
  if (targetLocale === "ja") return {};
  return getFieldTranslationsWithWarm(
    buildSpecs(
      jobs.map((job) => ({
        id: job.id,
        fields: [
          { resultKey: "title", fieldName: "title", text: job.title },
          { resultKey: "description", fieldName: "description", text: job.description },
        ],
      })),
      "works_quest",
    ),
    targetLocale,
    options ?? LIST_TRANSLATION_OPTS,
  );
}

export async function getJobDetailTranslations(
  job: JobListingWithPoster,
  targetLocale: string,
): Promise<Record<string, string>> {
  const map = await getFieldTranslationsWithWarm(
    buildSpecs(
      [
        {
          id: job.id,
          fields: [
            { resultKey: "title", fieldName: "title", text: job.title },
            { resultKey: "description", fieldName: "description", text: job.description },
          ],
        },
      ],
      "works_quest",
    ),
    targetLocale,
    { warmLimit: 1, liveLimit: 4 },
  );
  return map[job.id] ?? {};
}

export async function getCartItemTranslations(
  items: Array<{ key: string; kind: "shop" | "event"; id: string; title: string }>,
  targetLocale: string,
): Promise<Record<string, { title?: string }>> {
  const specs = items.map((item) => ({
    groupId: item.key,
    resultKey: "title",
    entityType: (item.kind === "shop" ? "shop_product" : "nexus_event") as
      | "shop_product"
      | "nexus_event",
    entityId: item.id,
    fieldName: "title",
    sourceLocale: inferSourceLocale(item.title),
    sourceText: item.title,
  }));
  return getFieldTranslationsWithWarm(specs, targetLocale, { warmLimit: 0, liveLimit: 0 });
}

export async function getProfileTextTranslations(
  profileId: string,
  fields: { bio?: string | null; headline?: string | null },
  targetLocale: string,
): Promise<Record<string, string>> {
  if (targetLocale === "ja") return {};
  const map = await getFieldTranslationsWithWarm(
    buildSpecs(
      [
        {
          id: profileId,
          fields: [
            { resultKey: "bio", fieldName: "bio", text: fields.bio },
            { resultKey: "headline", fieldName: "headline", text: fields.headline },
          ],
        },
      ],
      "user_profile",
    ),
    targetLocale,
    LIST_TRANSLATION_OPTS,
  );
  return map[profileId] ?? {};
}
