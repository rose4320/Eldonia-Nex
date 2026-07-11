import { redirect } from "next/navigation";

type ShopSellRedirectPageProps = {
  searchParams: Promise<{ from_artwork?: string }>;
};

export default async function ShopSellRedirectPage({ searchParams }: ShopSellRedirectPageProps) {
  const params = await searchParams;
  const query = params.from_artwork
    ? `?from_artwork=${encodeURIComponent(params.from_artwork)}`
    : "";
  redirect(`/settings/post/product${query}`);
}
