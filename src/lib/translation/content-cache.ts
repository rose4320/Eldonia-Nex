import type { CommunityReplyWithAuthor, CommunityThreadWithAuthor } from "@/types/database";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";
import {
  getCachedTranslation,
  getFieldTranslationsWithWarm,
  warmContentTranslations,
  type ContentTranslationEntityType,
  type ContentTranslationField,
  type FieldTranslationMap,
  type TranslationFieldSpec,
} from "@/lib/translation/field-translations";

export type ThreadCardTranslations = {
  title?: string;
  preview?: string;
};

/** @deprecated use ThreadCardTranslations */
export type ThreadListTranslation = ThreadCardTranslations & { body?: string };

export { getCachedTranslation, warmContentTranslations };
export type {
  ContentTranslationEntityType,
  ContentTranslationField,
  FieldTranslationMap,
};

type ThreadTranslationTarget = TranslationFieldSpec & { resultKey: "title" | "preview" };

function buildThreadCardTargets(
  threads: CommunityThreadWithAuthor[],
  latestReplies: Map<string, CommunityReplyWithAuthor>,
  targetLocale: string,
): ThreadTranslationTarget[] {
  const targets: ThreadTranslationTarget[] = [];

  for (const thread of threads) {
    const latestReply = latestReplies.get(thread.id);
    const previewText = latestReply?.body ?? thread.body;
    const previewLocale = latestReply?.locale ?? thread.locale;
    const previewEntityType: ContentTranslationEntityType = latestReply
      ? "community_reply"
      : "community_thread";
    const previewEntityId = latestReply?.id ?? thread.id;

    targets.push({
      groupId: thread.id,
      resultKey: "title",
      entityType: "community_thread",
      entityId: thread.id,
      fieldName: "title",
      sourceLocale: thread.locale,
      sourceText: thread.title,
    });

    targets.push({
      groupId: thread.id,
      resultKey: "preview",
      entityType: previewEntityType,
      entityId: previewEntityId,
      fieldName: "body",
      sourceLocale: previewLocale,
      sourceText: previewText,
    });
  }

  return targets.filter((target) => {
    const source = inferSourceLocale(target.sourceText, target.sourceLocale as "ja");
    return source !== targetLocale;
  });
}

function toThreadCardMap(map: FieldTranslationMap): Record<string, ThreadCardTranslations> {
  const result: Record<string, ThreadCardTranslations> = {};
  for (const [threadId, values] of Object.entries(map)) {
    result[threadId] = {
      title: values.title,
      preview: values.preview,
    };
  }
  return result;
}

export async function getThreadCardTranslationsWithWarm(
  threads: CommunityThreadWithAuthor[],
  latestReplies: Map<string, CommunityReplyWithAuthor>,
  targetLocale: string,
  options?: { warmLimit?: number; liveLimit?: number },
): Promise<Record<string, ThreadCardTranslations>> {
  if (targetLocale === "ja") return {};
  const specs = buildThreadCardTargets(threads, latestReplies, targetLocale);
  const map = await getFieldTranslationsWithWarm(
    specs,
    targetLocale,
    options ?? { warmLimit: 0, liveLimit: 0 },
  );
  return toThreadCardMap(map);
}

/** @deprecated use getThreadCardTranslationsWithWarm */
export async function getThreadListTranslationsWithWarm(
  threads: Array<{ id: string; locale: string; title: string; body: string }>,
  targetLocale: string,
  warmLimit = 5,
): Promise<Record<string, ThreadListTranslation>> {
  const asThreads = threads as CommunityThreadWithAuthor[];
  const emptyReplies = new Map<string, CommunityReplyWithAuthor>();
  const result = await getThreadCardTranslationsWithWarm(
    asThreads,
    emptyReplies,
    targetLocale,
    { warmLimit },
  );
  const legacy: Record<string, ThreadListTranslation> = {};
  for (const [id, value] of Object.entries(result)) {
    legacy[id] = { title: value.title, body: value.preview, preview: value.preview };
  }
  return legacy;
}
