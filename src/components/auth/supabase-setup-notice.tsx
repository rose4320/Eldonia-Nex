export function SupabaseSetupNotice() {
  return (
    <div className="eldonia-alert-error mb-6 text-left text-sm leading-7">
      <p className="font-display font-semibold tracking-wide text-eldonia-gold-light">
        Supabase 未設定
      </p>
      <p className="mt-2">
        <code className="text-eldonia-gold">.env.local</code>{" "}
        に Supabase Dashboard の Project URL と anon key を設定してください。
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-eldonia-text-muted">
        <li>Supabase Dashboard → Project Settings → API</li>
        <li>
          <code className="text-eldonia-gold">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          に Project URL
        </li>
        <li>
          <code className="text-eldonia-gold">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>{" "}
          に Publishable key（旧 anon key も可）
        </li>
        <li>設定後、<code className="text-eldonia-gold">npm run dev</code> を再起動</li>
      </ol>
    </div>
  );
}
