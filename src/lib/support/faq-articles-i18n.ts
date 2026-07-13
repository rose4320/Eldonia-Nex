/**
 * @deprecated Use `getReleaseFaqArticles` from `faq-release-catalog.ts`.
 */
export type FaqArticleFields = {
  question: string;
  answer: string;
};

export {
  getReleaseFaqArticles,
  type FaqReleaseArticle,
} from "@/lib/support/faq-release-catalog";
