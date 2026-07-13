import { createClient } from "@/lib/supabase/server";
import type {
  CommunityBoard,
  CommunityReplyWithAuthor,
  CommunityThreadWithAuthor,
} from "@/types/database";
import { THREADS_PAGE_SIZE, type PaginatedThreads } from "./pagination";
import { SAMPLE_BOARDS, SAMPLE_THREADS } from "./sample-data";

export async function getCommunityBoards(): Promise<CommunityBoard[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("community_boards")
      .select("*")
      .order("sort_order");

    if (!error && data?.length) return data as CommunityBoard[];
  } catch {
    // fallback
  }
  return SAMPLE_BOARDS;
}

function filterThreads(
  items: CommunityThreadWithAuthor[],
  filters?: { boardSlug?: string; q?: string },
) {
  let result = [...items];
  if (filters?.boardSlug) {
    result = result.filter((t) => t.community_boards?.slug === filters.boardSlug);
  }
  const term = filters?.q?.trim().toLowerCase();
  if (term) {
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.body.toLowerCase().includes(term),
    );
  }
  return result;
}

export async function getCommunityThreadsPaginated(filters?: {
  boardSlug?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedThreads> {
  const pageSize = filters?.pageSize ?? THREADS_PAGE_SIZE;
  const page = Math.max(1, filters?.page ?? 1);

  try {
    const supabase = await createClient();
    let query = supabase
      .from("community_threads")
      .select(
        `
        *,
        profiles:author_id (display_name, username),
        community_boards:board_id (slug, name)
      `,
        { count: "exact" },
      )
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (filters?.boardSlug) {
      const boards = await getCommunityBoards();
      const board = boards.find((b) => b.slug === filters.boardSlug);
      if (board) query = query.eq("board_id", board.id);
    }

    const term = filters?.q?.trim();
    if (term) {
      query = query.or(`title.ilike.%${term}%,body.ilike.%${term}%`);
    }

    const from = (page - 1) * pageSize;
    const { data, error, count } = await query.range(from, from + pageSize - 1);

    if (!error && data) {
      const total = count ?? data.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      return {
        threads: data as CommunityThreadWithAuthor[],
        page: Math.min(page, totalPages),
        pageSize,
        total,
        totalPages,
      };
    }
  } catch {
    // fallback
  }

  const filtered = filterThreads(SAMPLE_THREADS, filters);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    threads: filtered.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}

/** @deprecated use getCommunityThreadsPaginated */
export async function getCommunityThreads(filters?: {
  boardSlug?: string;
  q?: string;
}): Promise<CommunityThreadWithAuthor[]> {
  const result = await getCommunityThreadsPaginated(filters);
  return result.threads;
}

export async function getCommunityThread(
  id: string,
): Promise<CommunityThreadWithAuthor | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("community_threads")
      .select(
        `
        *,
        profiles:author_id (display_name, username),
        community_boards:board_id (slug, name)
      `,
      )
      .eq("id", id)
      .single();

    if (!error && data) return data as CommunityThreadWithAuthor;
  } catch {
    // fallback
  }
  return SAMPLE_THREADS.find((t) => t.id === id) ?? null;
}

export async function getCommunityReplies(
  threadId: string,
): Promise<CommunityReplyWithAuthor[]> {
  try {
    const supabase = await createClient();
    const select = `
        *,
        profiles:author_id (display_name, username)
      `;
    let { data, error } = await supabase
      .from("community_replies")
      .select(select)
      .eq("thread_id", threadId)
      .is("deleted_at", null)
      .order("created_at");

    // Migration 040 not applied yet: retry without soft-delete filter.
    if (error) {
      ({ data, error } = await supabase
        .from("community_replies")
        .select(select)
        .eq("thread_id", threadId)
        .order("created_at"));
    }

    if (!error && data) {
      return (data as CommunityReplyWithAuthor[]).filter((r) => !r.deleted_at);
    }
  } catch {
    // fallback
  }

  if (threadId === "00000000-0000-4000-8000-000000000301") {
    return [
      {
        id: "r1",
        thread_id: threadId,
        author_id: null,
        body: "Welcome to the Nexus! 翻訳は近日対応予定です。",
        locale: "en",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        profiles: { display_name: "Traveler", username: "traveler" },
      },
    ];
  }
  return [];
}

export async function getLatestRepliesByThreadIds(
  threadIds: string[],
): Promise<Map<string, CommunityReplyWithAuthor>> {
  const map = new Map<string, CommunityReplyWithAuthor>();
  if (threadIds.length === 0) return map;

  try {
    const supabase = await createClient();
    const select = `
        *,
        profiles:author_id (display_name, username)
      `;
    let { data, error } = await supabase
      .from("community_replies")
      .select(select)
      .in("thread_id", threadIds)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      ({ data, error } = await supabase
        .from("community_replies")
        .select(select)
        .in("thread_id", threadIds)
        .order("created_at", { ascending: false }));
    }

    if (error || !data) return map;

    for (const row of data) {
      const reply = row as CommunityReplyWithAuthor;
      if (reply.deleted_at) continue;
      if (!map.has(reply.thread_id)) {
        map.set(reply.thread_id, reply);
      }
    }
  } catch {
    // ignore
  }

  return map;
}
