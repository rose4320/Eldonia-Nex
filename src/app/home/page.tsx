import { permanentRedirect } from "next/navigation";

/** 旧 URL `/home` → `/` へ恒久リダイレクト */
export default function LegacyHomeRedirect() {
  permanentRedirect("/");
}
