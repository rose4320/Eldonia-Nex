const PLACEHOLDER_URL = "https://your-project.supabase.co";
const PLACEHOLDER_KEY = "your-anon-key";

export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) return false;
  if (url === PLACEHOLDER_URL || url.includes("your-project")) return false;
  if (anonKey === PLACEHOLDER_KEY || anonKey === "your-anon-key") return false;
  return true;
}

export function supabaseSetupMessage(): string {
  return (
    "Supabase が未設定です。.env.local に NEXT_PUBLIC_SUPABASE_URL と " +
    "NEXT_PUBLIC_SUPABASE_ANON_KEY を設定し、開発サーバーを再起動してください。"
  );
}

export function mapAuthError(error: unknown): string {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return (
      "Supabase に接続できません。.env.local の URL / anon key が正しいか確認し、" +
      "npm run dev を再起動してください。"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "ログインに失敗しました。";
}
