const PLACEHOLDER_URL = "https://your-project.supabase.co";
const PLACEHOLDER_KEYS = new Set([
  "your-anon-key",
  "your-publishable-key",
  "your-anon-key-from-supabase-status",
]);

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

/** Supabase Dashboard の Publishable Key（新形式）または anon JWT（旧形式） */
export function getSupabasePublishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  );
}

/** Dashboard の Secret Key（新形式）または service_role JWT（旧形式） */
export function getSupabaseSecretKey(): string {
  return (
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    ""
  );
}

/** サーバー専用: Secret を優先（Vercel に残った旧 anon key より安全） */
export function getSupabaseServerKey(): string {
  const secret = getSupabaseSecretKey();
  if (secret) return secret;
  return getSupabasePublishableKey();
}

export function getSupabaseEnv() {
  return {
    url: getSupabaseUrl(),
    publishableKey: getSupabasePublishableKey(),
  };
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const serverKey = getSupabaseServerKey();
  if (!url || !serverKey) return false;
  if (url === PLACEHOLDER_URL || url.includes("your-project")) return false;
  if (PLACEHOLDER_KEYS.has(serverKey)) return false;
  return true;
}

export function isSupabaseBrowserConfigured(): boolean {
  const publishableKey = getSupabasePublishableKey();
  if (!publishableKey || PLACEHOLDER_KEYS.has(publishableKey)) return false;
  return isSupabaseConfigured();
}

export function supabaseSetupMessage(): string {
  return (
    "Supabase が未設定です。.env.local に NEXT_PUBLIC_SUPABASE_URL と " +
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY（または NEXT_PUBLIC_SUPABASE_ANON_KEY）を設定し、" +
    "開発サーバーを再起動してください。"
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
    return mapSupabaseAuthMessage(error.message);
  }

  return "ログインに失敗しました。";
}

export function mapSupabaseAuthMessage(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) {
    return (
      "メールアドレスまたはパスワードが正しくありません。" +
      "フロントエンドは Supabase アカウントでログインします（Django Admin とは別です）。"
    );
  }
  if (normalized.includes("email not confirmed")) {
    return "メールアドレスの確認が完了していません。受信トレイをご確認ください。";
  }
  if (normalized.includes("user already registered")) {
    return "このメールアドレスは既に登録されています。ログインするか別のメールをお使いください。";
  }
  return message;
}
