import type { CommunityThreadWithAuthor } from "@/types/database";

export const THREADS_PAGE_SIZE = 10;

export type PaginatedThreads = {
  threads: CommunityThreadWithAuthor[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
