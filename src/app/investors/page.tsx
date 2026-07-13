import { permanentRedirect } from "next/navigation";

/** Former investor URL — contributor pin rewards. */
export default function InvestorsPage() {
  permanentRedirect("/contributors");
}
