import { SettingsReferralCard } from "@/components/settings/settings-referral-card";
import { getReferralProgramData } from "@/lib/referrals/get-referral-program";

type SettingsReferralSectionProps = {
  userId: string;
  email?: string | null;
  username?: string | null;
};

export async function SettingsReferralSection({
  userId,
  email,
  username,
}: SettingsReferralSectionProps) {
  const referral = await getReferralProgramData(userId, email, username);
  return <SettingsReferralCard referral={referral} />;
}
