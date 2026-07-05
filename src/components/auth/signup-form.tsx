"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createClient, hasBrowserSupabaseConfig } from "@/lib/supabase/client";
import { resolvePostLoginPath, sanitizeRedirectTo } from "@/lib/auth/redirect";
import { buildAuthCallbackUrl } from "@/lib/auth/site-url";
import { localeFromCountry } from "@/lib/i18n/country-locale";
import type { SignupPlanId } from "@/lib/i18n/content/signup-messages";
import {
  mapAuthError,
  mapSupabaseAuthMessage,
  supabaseSetupMessage,
} from "@/lib/supabase/env";

type SignupFormProps = {
  redirectTo: string;
  supabaseConfigured: boolean;
  referralCode: string | null;
};

type SignupStep = "basic" | "plan" | "payment" | "consent" | "complete";

type SignupDraft = {
  email: string;
  displayName: string;
  username: string;
  legalName: string;
  country: string;
  phone: string;
  isCreator: boolean;
};

const STORAGE_KEY = "eldonia_signup_onboarding";
const SKIP_ONBOARDING_PAYMENTS = true;

const initialDraft: SignupDraft = {
  email: "",
  displayName: "",
  username: "",
  legalName: "",
  country: "JP",
  phone: "",
  isCreator: true,
};

type SupabaseBrowserClient = ReturnType<typeof createClient>;

function readStoredSignup(): { draft: SignupDraft; selectedPlan: SignupPlanId } {
  if (typeof window === "undefined") {
    return { draft: initialDraft, selectedPlan: "free" };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { draft: initialDraft, selectedPlan: "free" };
    const parsed = JSON.parse(raw) as {
      draft?: Partial<SignupDraft>;
      selectedPlan?: SignupPlanId;
    };
    return {
      draft: { ...initialDraft, ...parsed.draft },
      selectedPlan: parsed.selectedPlan ?? "free",
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return { draft: initialDraft, selectedPlan: "free" };
  }
}

export function SignupForm({ redirectTo, supabaseConfigured, referralCode }: SignupFormProps) {
  const t = useContent();
  const signup = t.signup;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<SignupStep>("basic");
  const [draft, setDraft] = useState<SignupDraft>(() => readStoredSignup().draft);
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<SignupPlanId>(
    () => readStoredSignup().selectedPlan,
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [activeConsentIndex, setActiveConsentIndex] = useState(0);
  const [checkedConsents, setCheckedConsents] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPlanInfo = useMemo(
    () => signup.plans.find((plan) => plan.id === selectedPlan) ?? signup.plans[0],
    [signup.plans, selectedPlan],
  );
  const activeConsent = signup.consents[activeConsentIndex];
  const consentItems = signup.consents;

  const checkoutSuccess = searchParams.get("checkout") === "success";

  useEffect(() => {
    if (!checkoutSuccess) return;

    const planParam = searchParams.get("plan");
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate signup step from Stripe return URL once */
    if (planParam === "free" || planParam === "standard" || planParam === "pro") {
      setSelectedPlan(planParam);
    }
    setPaymentCompleted(true);
    setStep("consent");
    setMessage(signup.messages.paymentComplete);
    /* eslint-enable react-hooks/set-state-in-effect */
    void (hasBrowserSupabaseConfig()
      ? createClient()
          .auth.getUser()
          .then(({ data }) => {
            if (data.user) setUserId(data.user.id);
          })
      : Promise.resolve());
  }, [checkoutSuccess, searchParams, signup.messages.paymentComplete]);

  function updateDraft<K extends keyof SignupDraft>(key: K, value: SignupDraft[K]) {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ draft: next, selectedPlan }),
      );
      return next;
    });
  }

  function persistPlan(plan: SignupPlanId) {
    setSelectedPlan(plan);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ draft, selectedPlan: plan }),
    );
  }

  function resetFeedback() {
    setError(null);
    setMessage(null);
  }

  function continueToConsentWithoutPayment() {
    setPaymentCompleted(false);
    setStep("consent");
    setMessage(
      selectedPlan === "free"
        ? signup.messages.freePlanSelected
        : signup.messages.paymentSkipped,
    );
  }

  function handlePlanContinue() {
    resetFeedback();
    if (selectedPlan === "free" || SKIP_ONBOARDING_PAYMENTS) {
      continueToConsentWithoutPayment();
      return;
    }
    setStep("payment");
  }

  async function isUsernameAvailable(supabase: SupabaseBrowserClient, username: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return !data;
  }

  async function saveBasicInfo(
    supabase: SupabaseBrowserClient,
    currentUserId: string,
    email: string,
  ) {
    const username = draft.username.trim().toLowerCase() || null;
    const country = draft.country.trim().toUpperCase() || "JP";
    const locale = localeFromCountry(country);
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: currentUserId,
        username,
        display_name: draft.displayName.trim() || email.split("@")[0],
        is_creator: draft.isCreator,
        locale,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      return profileError.message.includes("profiles_username")
        ? signup.messages.usernameTaken
        : profileError.message;
    }

    const { error: settingsError } = await supabase.from("user_settings").upsert(
      {
        user_id: currentUserId,
        legal_name: draft.legalName.trim() || null,
        country,
        phone: draft.phone.trim() || null,
      },
      { onConflict: "user_id" },
    );

    return settingsError?.message ?? null;
  }

  async function handleBasicSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetFeedback();
    setLoading(true);

    if (!supabaseConfigured || !hasBrowserSupabaseConfig()) {
      setError(supabaseSetupMessage());
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const email = draft.email.trim().toLowerCase();
      const username = draft.username.trim().toLowerCase();

      if (username && !(await isUsernameAvailable(supabase, username))) {
        setError(signup.messages.usernameTaken);
        setLoading(false);
        return;
      }

      const country = draft.country.trim().toUpperCase() || "JP";
      const locale = localeFromCountry(country);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: draft.displayName.trim(),
            username: username || null,
            referral_code: referralCode,
            country,
            locale,
          },
          emailRedirectTo: buildAuthCallbackUrl(redirectTo, window.location.origin, locale),
        },
      });

      if (signUpError) {
        setError(mapSupabaseAuthMessage(signUpError.message));
        setLoading(false);
        return;
      }

      if (data.session) {
        const currentUserId = data.user?.id;
        if (currentUserId) {
          setUserId(currentUserId);
          const basicInfoError = await saveBasicInfo(supabase, currentUserId, email);

          if (basicInfoError) {
            setError(basicInfoError);
            setLoading(false);
            return;
          }

          await awardUserExp(supabase, "user.signup", "user.signup");
          void fetch("/api/auth/sync-django", { method: "POST" });
        }

        router.refresh();
        setStep("plan");
        setMessage(signup.messages.basicSaved);
        setLoading(false);
        return;
      }

      setMessage(`${t.auth.signupConfirmEmail} ${signup.messages.confirmEmailContinue}`);
      setLoading(false);
    } catch (caught) {
      setError(mapAuthError(caught));
      setLoading(false);
    }
  }

  async function handleCheckout() {
    resetFeedback();

    if (selectedPlan === "free" || SKIP_ONBOARDING_PAYMENTS) {
      continueToConsentWithoutPayment();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan, redirectTo: sanitizeRedirectTo(redirectTo) }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setError(payload.error ?? signup.messages.checkoutFailed);
        setLoading(false);
        return;
      }

      window.location.assign(payload.url);
    } catch (caught) {
      setError(mapAuthError(caught));
      setLoading(false);
    }
  }

  async function handleConsentNext() {
    resetFeedback();

    if (!checkedConsents[activeConsent.type]) {
      setError(signup.messages.consentRequired);
      return;
    }

    if (activeConsentIndex < consentItems.length - 1) {
      setActiveConsentIndex((current) => current + 1);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/consents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          paymentStatus: paymentCompleted ? "completed" : "not_required",
          consents: consentItems.map(({ type, title, version }) => ({
            type,
            title,
            version,
          })),
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? signup.messages.consentSaveFailed);
        setLoading(false);
        return;
      }

      window.localStorage.removeItem(STORAGE_KEY);
      window.location.assign(resolvePostLoginPath(redirectTo));
      return;
    } catch (caught) {
      setError(mapAuthError(caught));
      setLoading(false);
    }
  }

  function renderProgress() {
    const steps: Array<{ id: SignupStep; label: string }> = [
      { id: "basic", label: signup.steps.basic },
      { id: "plan", label: signup.steps.plan },
      { id: "payment", label: signup.steps.payment },
      { id: "consent", label: signup.steps.consent },
    ];

    return (
      <ol className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {steps.map((item) => {
          const isActive = item.id === step;
          return (
            <li
              key={item.id}
              className={`rounded-md border px-3 py-2 text-center ${
                isActive
                  ? "border-eldonia-gold/60 bg-eldonia-gold/10 text-eldonia-gold-light"
                  : "border-eldonia-border text-eldonia-text-muted"
              }`}
            >
              {item.label}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-5">
      {renderProgress()}

      {step === "basic" && (
        <form onSubmit={handleBasicSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="display-name" className="eldonia-label">
              {signup.basic.displayName}
            </label>
            <input
              id="display-name"
              type="text"
              autoComplete="name"
              required
              value={draft.displayName}
              onChange={(event) => updateDraft("displayName", event.target.value)}
              className="eldonia-input"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="eldonia-label">
              {signup.basic.username}
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              minLength={3}
              maxLength={30}
              pattern="[a-z0-9_]+"
              title={signup.basic.hints.username}
              value={draft.username}
              onChange={(event) =>
                updateDraft(
                  "username",
                  event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                )
              }
              className="eldonia-input"
              placeholder="creator_name"
            />
            <p className="eldonia-hint">{signup.basic.hints.username}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="eldonia-label">
              {t.auth.email}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={draft.email}
              onChange={(event) => updateDraft("email", event.target.value)}
              className="eldonia-input"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="eldonia-label">
              {t.auth.password}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="eldonia-input"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="legal-name" className="eldonia-label">
              {signup.basic.legalName}
            </label>
            <input
              id="legal-name"
              type="text"
              autoComplete="name"
              value={draft.legalName}
              onChange={(event) => updateDraft("legalName", event.target.value)}
              className="eldonia-input"
            />
          </div>

          <div className="grid grid-cols-[7rem_1fr] gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="country" className="eldonia-label">
                {signup.basic.country}
              </label>
              <input
                id="country"
                type="text"
                maxLength={2}
                value={draft.country}
                onChange={(event) => updateDraft("country", event.target.value.toUpperCase())}
                className="eldonia-input"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="eldonia-label">
                {signup.basic.phone}
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={draft.phone}
                onChange={(event) => updateDraft("phone", event.target.value)}
                className="eldonia-input"
              />
            </div>
          </div>

          <label className="sm:col-span-2 flex items-start gap-3 rounded-md border border-eldonia-border bg-eldonia-gold/5 p-3 text-sm text-eldonia-text-muted">
            <input
              type="checkbox"
              checked={draft.isCreator}
              onChange={(event) => updateDraft("isCreator", event.target.checked)}
              className="mt-1"
            />
            {signup.basic.creatorToggle}
          </label>

          <button
            type="submit"
            disabled={loading || !supabaseConfigured}
            className="eldonia-btn-primary sm:col-span-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t.auth.signupLoading : signup.basic.submit}
          </button>

          <div className="sm:col-span-2 flex justify-center">
            <OAuthButtons redirectTo={redirectTo} signup referralCode={referralCode} />
          </div>
        </form>
      )}

      {step === "plan" && (
        <section className="flex flex-col gap-4">
          <div>
            <p className="eldonia-eyebrow">{signup.plan.eyebrow}</p>
            <h2 className="eldonia-heading eldonia-heading-sm mt-2">{signup.plan.title}</h2>
            <p className="eldonia-body mt-2 text-sm">{signup.plan.lead}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {signup.plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => persistPlan(plan.id)}
                className={`eldonia-card text-left transition ${
                  selectedPlan === plan.id ? "ring-2 ring-eldonia-gold/60" : ""
                }`}
              >
                <p className="eldonia-eyebrow">{plan.name}</p>
                <p className="mt-2 text-xl font-semibold text-eldonia-gold-light">{plan.price}</p>
                <p className="eldonia-body mt-2 text-sm">{plan.lead}</p>
                <ul className="mt-4 space-y-2 text-sm text-eldonia-text-muted">
                  {plan.features.map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setStep("basic")} className="eldonia-btn-secondary">
              {signup.plan.back}
            </button>
            <button type="button" onClick={handlePlanContinue} className="eldonia-btn-primary">
              {selectedPlan === "free" || SKIP_ONBOARDING_PAYMENTS
                ? signup.payment.toConsentFree
                : signup.plan.toPayment}
            </button>
          </div>
        </section>
      )}

      {step === "payment" && (
        <section className="eldonia-card">
          <p className="eldonia-eyebrow">{signup.payment.eyebrow}</p>
          <h2 className="eldonia-heading eldonia-heading-sm mt-2">
            {signup.payment.titleConfirm(selectedPlanInfo.name)}
          </h2>
          <p className="eldonia-body mt-3 text-sm">
            {SKIP_ONBOARDING_PAYMENTS && selectedPlan !== "free"
              ? `選択中: ${selectedPlanInfo.price}。テスト運営中のため、Stripe決済は行わず規約確認へ進みます。`
              : signup.payment.leadSelected(selectedPlanInfo.price)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setStep("plan")} className="eldonia-btn-secondary">
              {signup.payment.backToPlan}
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading || !userId}
              className="eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? signup.payment.preparing
                : selectedPlan === "free" || SKIP_ONBOARDING_PAYMENTS
                  ? signup.payment.toConsentFree
                  : signup.payment.toStripe}
            </button>
          </div>
          {!userId && (
            <p className="eldonia-alert-error mt-4">{signup.payment.sessionMissing}</p>
          )}
        </section>
      )}

      {step === "consent" && activeConsent && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8">
          <div className="eldonia-card max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <p className="eldonia-eyebrow">
              {signup.consent.progress(activeConsentIndex + 1, consentItems.length)}
            </p>
            <h2 className="eldonia-heading eldonia-heading-sm mt-2">{activeConsent.title}</h2>
            <p className="eldonia-body mt-3 text-sm">{activeConsent.lead}</p>
            <div className="mt-5 rounded-md border border-eldonia-border bg-black/20 p-4">
              <ul className="space-y-3 text-sm leading-6 text-eldonia-text-muted">
                {activeConsent.body.map((paragraph) => (
                  <li key={paragraph}>- {paragraph}</li>
                ))}
              </ul>
            </div>
            <label className="mt-5 flex items-start gap-3 rounded-md border border-eldonia-border bg-eldonia-gold/5 p-3 text-sm text-eldonia-text">
              <input
                type="checkbox"
                checked={Boolean(checkedConsents[activeConsent.type])}
                onChange={(event) =>
                  setCheckedConsents((current) => ({
                    ...current,
                    [activeConsent.type]: event.target.checked,
                  }))
                }
                className="mt-1"
              />
              {activeConsent.requiredLabel}
            </label>
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  activeConsentIndex === 0
                    ? setStep(selectedPlan === "free" || SKIP_ONBOARDING_PAYMENTS ? "plan" : "payment")
                    : setActiveConsentIndex((current) => current - 1)
                }
                className="eldonia-btn-secondary"
              >
                {signup.consent.back}
              </button>
              <button
                type="button"
                onClick={handleConsentNext}
                disabled={loading || !checkedConsents[activeConsent.type]}
                className="eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? signup.consent.saving
                  : activeConsentIndex === consentItems.length - 1
                    ? signup.consent.finish
                    : signup.consent.next}
              </button>
            </div>
          </div>
        </section>
      )}

      {step === "complete" && (
        <section className="eldonia-card text-center">
          <p className="eldonia-eyebrow">{signup.complete.eyebrow}</p>
          <h2 className="eldonia-heading eldonia-heading-sm mt-2">{signup.complete.title}</h2>
          <p className="eldonia-body mt-3 text-sm">{signup.complete.lead}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={sanitizeRedirectTo(redirectTo)} className="eldonia-btn-primary">
              {signup.complete.start}
            </Link>
            <Link href="/settings" className="eldonia-btn-secondary">
              {signup.complete.settings}
            </Link>
          </div>
        </section>
      )}

      {error && <p className="eldonia-alert-error">{error}</p>}
      {message && <p className="eldonia-alert-success">{message}</p>}

      {step === "basic" && (
        <p className="text-center text-sm text-eldonia-text-muted">
          {t.auth.hasAccount}{" "}
          <Link
            href={`/auth/login?redirect_to=${encodeURIComponent(redirectTo)}`}
            className="eldonia-link font-medium"
          >
            {t.chrome.login}
          </Link>
        </p>
      )}
    </div>
  );
}
