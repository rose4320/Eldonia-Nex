import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  CONTENT_TRANSLATION_LOCALES,
  type ContentTranslationLocale,
} from "@/lib/translation/config";
import { createTranslationHash, shouldTranslate } from "@/lib/translation/hash";
import { translateTextWithGoogle } from "@/lib/translation/google";
import { normalizeNexusLocale } from "@/lib/nexus-translate/translate";

export type ContentTranslationEntityType =
  | "community_thread"
  | "community_reply"
  | "gallery_artwork"
  | "shop_product"
  | "nexus_event"
  | "works_quest"
  | "user_profile"
  | "lab_post";

export type ContentTranslationField = {
  fieldName: string;
  text: string;
};

export type TranslationFieldSpec = {
  groupId: string;
  resultKey: string;
  entityType: ContentTranslationEntityType;
  entityId: string;
  fieldName: string;
  sourceLocale: string;
  sourceText: string;
};

export type FieldTranslationMap = Record<string, Record<string, string>>;

function toContentLocale(value: string): ContentTranslationLocale {
  return normalizeNexusLocale(value) as ContentTranslationLocale;
}

function targetLocales(source: ContentTranslationLocale): ContentTranslationLocale[] {
  return CONTENT_TRANSLATION_LOCALES.filter((locale) => locale !== source);
}

async function translateForDisplay(params: {
  text: string;
  sourceLocale: string;
  targetLocale: string;
}): Promise<string | null> {
  const source = toContentLocale(params.sourceLocale);
  const target = toContentLocale(params.targetLocale);
  if (!shouldTranslate({ sourceLocale: source, targetLocale: target, text: params.text })) {
    return null;
  }
  try {
    const google = await translateTextWithGoogle({
      text: params.text,
      sourceLocale: source,
      targetLocale: target,
    });
    return google.translatedText;
  } catch {
    return null;
  }
}

export async function getCachedTranslation(params: {
  entityType: ContentTranslationEntityType;
  entityId: string;
  fieldName: string;
  sourceLocale: string;
  targetLocale: string;
  sourceText: string;
}): Promise<string | null> {
  const source = toContentLocale(params.sourceLocale);
  const target = toContentLocale(params.targetLocale);

  if (!shouldTranslate({ sourceLocale: source, targetLocale: target, text: params.sourceText })) {
    return null;
  }

  const sourceHash = createTranslationHash({
    sourceLocale: source,
    targetLocale: target,
    text: params.sourceText,
  });

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("content_translations")
      .select("translated_text, source_hash")
      .eq("entity_type", params.entityType)
      .eq("entity_id", params.entityId)
      .eq("field_name", params.fieldName)
      .eq("target_locale", target)
      .maybeSingle();

    if (error || !data || data.source_hash !== sourceHash) return null;
    return data.translated_text;
  } catch {
    return null;
  }
}

async function readCachedSpecs(
  specs: TranslationFieldSpec[],
  targetLocale: string,
): Promise<FieldTranslationMap> {
  const result: FieldTranslationMap = {};
  const target = toContentLocale(targetLocale);

  const translatableSpecs = specs.filter((spec) =>
    shouldTranslate({
      sourceLocale: toContentLocale(spec.sourceLocale),
      targetLocale: target,
      text: spec.sourceText,
    }),
  );
  if (translatableSpecs.length === 0) return result;

  const byEntityType = new Map<ContentTranslationEntityType, TranslationFieldSpec[]>();
  for (const spec of translatableSpecs) {
    const list = byEntityType.get(spec.entityType) ?? [];
    list.push(spec);
    byEntityType.set(spec.entityType, list);
  }

  try {
    const supabase = await createClient();
    for (const [entityType, typeSpecs] of byEntityType) {
      const entityIds = [...new Set(typeSpecs.map((spec) => spec.entityId))];
      const fieldNames = [...new Set(typeSpecs.map((spec) => spec.fieldName))];
      if (entityIds.length === 0) continue;

      const { data, error } = await supabase
        .from("content_translations")
        .select("entity_id, field_name, translated_text, source_hash")
        .eq("entity_type", entityType)
        .eq("target_locale", target)
        .in("entity_id", entityIds)
        .in("field_name", fieldNames);

      if (error || !data?.length) continue;

      const rowByKey = new Map<string, (typeof data)[number]>();
      for (const row of data) {
        rowByKey.set(`${row.entity_id}:${row.field_name}`, row);
      }

      for (const spec of typeSpecs) {
        const row = rowByKey.get(`${spec.entityId}:${spec.fieldName}`);
        if (!row) continue;
        const source = toContentLocale(spec.sourceLocale);
        const sourceHash = createTranslationHash({
          sourceLocale: source,
          targetLocale: target,
          text: spec.sourceText,
        });
        if (row.source_hash !== sourceHash) continue;
        if (!result[spec.groupId]) result[spec.groupId] = {};
        result[spec.groupId][spec.resultKey] = row.translated_text;
      }
    }
  } catch {
    return result;
  }

  return result;
}

function mergeFieldMaps(base: FieldTranslationMap, patch: FieldTranslationMap): FieldTranslationMap {
  const merged = { ...base };
  for (const [groupId, values] of Object.entries(patch)) {
    merged[groupId] = { ...merged[groupId], ...values };
  }
  return merged;
}

export async function warmContentTranslations(params: {
  entityType: ContentTranslationEntityType;
  entityId: string;
  sourceLocale: string;
  fields: ContentTranslationField[];
}): Promise<{ cached: number; skipped: number; errors: number }> {
  const admin = createAdminClient();
  if (!admin) {
    return { cached: 0, skipped: 0, errors: params.fields.length };
  }

  const source = toContentLocale(params.sourceLocale);
  const targets = targetLocales(source);
  let cached = 0;
  let skipped = 0;
  let errors = 0;

  for (const field of params.fields) {
    const trimmed = field.text.trim();
    if (!trimmed) {
      skipped += targets.length;
      continue;
    }

    for (const target of targets) {
      if (!shouldTranslate({ sourceLocale: source, targetLocale: target, text: trimmed })) {
        skipped += 1;
        continue;
      }

      const sourceHash = createTranslationHash({
        sourceLocale: source,
        targetLocale: target,
        text: trimmed,
      });

      try {
        const { data: existing } = await admin
          .from("content_translations")
          .select("source_hash")
          .eq("entity_type", params.entityType)
          .eq("entity_id", params.entityId)
          .eq("field_name", field.fieldName)
          .eq("target_locale", target)
          .maybeSingle();

        if (existing?.source_hash === sourceHash) {
          skipped += 1;
          continue;
        }

        const google = await translateTextWithGoogle({
          text: trimmed,
          sourceLocale: source,
          targetLocale: target,
        });

        const { error } = await admin.from("content_translations").upsert(
          {
            entity_type: params.entityType,
            entity_id: params.entityId,
            field_name: field.fieldName,
            source_locale: source,
            target_locale: target,
            provider: "google",
            review_status: "auto",
            source_hash: sourceHash,
            source_text: trimmed,
            translated_text: google.translatedText,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "entity_type,entity_id,field_name,target_locale" },
        );

        if (error) errors += 1;
        else cached += 1;
      } catch {
        errors += 1;
      }
    }
  }

  return { cached, skipped, errors };
}

/** Cache → warm → live Google fallback for arbitrary entity fields. */
export async function getFieldTranslationsWithWarm(
  specs: TranslationFieldSpec[],
  targetLocale: string,
  options?: { warmLimit?: number; liveLimit?: number },
): Promise<FieldTranslationMap> {
  const warmLimit = options?.warmLimit ?? 5;
  const liveLimit = options?.liveLimit ?? 12;
  if (specs.length === 0) return {};

  const target = toContentLocale(targetLocale);
  const translatableSpecs = specs.filter((spec) =>
    shouldTranslate({
      sourceLocale: toContentLocale(spec.sourceLocale),
      targetLocale: target,
      text: spec.sourceText,
    }),
  );
  if (translatableSpecs.length === 0) return {};

  let translations = await readCachedSpecs(translatableSpecs, targetLocale);

  const missingGroupIds = new Set<string>();
  for (const spec of translatableSpecs) {
    if (!translations[spec.groupId]?.[spec.resultKey]) {
      missingGroupIds.add(spec.groupId);
    }
  }

  if (missingGroupIds.size > 0 && warmLimit > 0) {
    const groupsToWarm = [...missingGroupIds].slice(0, warmLimit);
    for (const groupId of groupsToWarm) {
      const groupSpecs = translatableSpecs.filter((spec) => spec.groupId === groupId);
      const byEntity = new Map<string, TranslationFieldSpec[]>();
      for (const spec of groupSpecs) {
        const key = `${spec.entityType}:${spec.entityId}:${spec.sourceLocale}`;
        const list = byEntity.get(key) ?? [];
        list.push(spec);
        byEntity.set(key, list);
      }
      for (const entitySpecs of byEntity.values()) {
        const first = entitySpecs[0];
        await warmContentTranslations({
          entityType: first.entityType,
          entityId: first.entityId,
          sourceLocale: first.sourceLocale,
          fields: entitySpecs.map((spec) => ({
            fieldName: spec.fieldName,
            text: spec.sourceText,
          })),
        });
      }
    }
    translations = mergeFieldMaps(translations, await readCachedSpecs(translatableSpecs, targetLocale));
  }

  if (liveLimit > 0) {
    let liveCalls = 0;
    for (const spec of translatableSpecs) {
      if (translations[spec.groupId]?.[spec.resultKey]) continue;
      if (liveCalls >= liveLimit) break;
      const live = await translateForDisplay({
        text: spec.sourceText,
        sourceLocale: spec.sourceLocale,
        targetLocale,
      });
      liveCalls += 1;
      if (!live) continue;
      if (!translations[spec.groupId]) translations[spec.groupId] = {};
      translations[spec.groupId][spec.resultKey] = live;
    }
  }

  return translations;
}
